import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const RESEND_API_KEY = secrets.get('RESEND_API_KEY');

    // Use service role — this runs from a scheduled workflow, no user context
    const allMeasurements = await base44.asServiceRole.entities.Measurement.list('-created_date', 500);
    const today = new Date().toISOString().split('T')[0];

    // Find measurements due for follow-up (only quoted or responded get reminders)
    const due = (Array.isArray(allMeasurements) ? allMeasurements : []).filter(m =>
      m.next_followup_date &&
      m.next_followup_date <= today &&
      (m.crm_status === 'quoted' || m.crm_status === 'responded' || !m.crm_status)
    );

    let processed = 0;
    let emailsSent = 0;
    let errors = 0;

    // Follow-up schedule offsets (in days from created_date): 7, 15, 30, then 45, 60, 75...
    const initialOffsets = [7, 15, 30];

    for (const m of due) {
      try {
        const newCount = (m.followup_count || 0) + 1;
        const createdDate = new Date(m.created_date);

        // Compute next follow-up date
        let nextDate = null;
        if (newCount <= 3) {
          nextDate = new Date(createdDate.getTime() + initialOffsets[newCount - 1] * 86400000);
        } else if (m.recurring_followup) {
          nextDate = new Date(createdDate.getTime() + (30 + (newCount - 3) * 15) * 86400000);
        }

        // Look up the field tech's email
        let techEmail = null;
        let techName = m.tech_name || '';
        if (m.created_by_id) {
          try {
            const users = await base44.asServiceRole.entities.User.filter({ id: m.created_by_id });
            if (users && users.length > 0) {
              techEmail = users[0].email;
              if (!techName) techName = users[0].full_name || users[0].email;
            }
          } catch (e) {
            console.error('User lookup failed for', m.created_by_id, e.message);
          }
        }

        // Send reminder email to the field tech
        if (techEmail && RESEND_API_KEY) {
          const followupLabel = newCount <= 3 ? `Follow-up #${newCount}` : `Recurring follow-up #${newCount}`;
          const html = `
<div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#e86c2f;padding:20px 24px;border-radius:12px 12px 0 0">
    <div style="color:white;font-size:20px;font-weight:800">WDX Impact — Follow-up Reminder</div>
    <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px">${followupLabel} · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
  </div>
  <div style="background:white;padding:24px;border:1px solid #e8e4de;border-top:none;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a">Hi ${techName || 'there'},</p>
    <p style="margin:0 0 16px;font-size:14px;color:#555;line-height:1.6">It's time to follow up with <strong>${m.client_name || 'your client'}</strong> about their window &amp; door quote. Reach out, check in, and update their status in the dashboard when you hear back.</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr><td style="padding:8px 0;color:#e86c2f;font-weight:600;font-size:13px;width:35%">Client</td><td style="padding:8px 0;color:#1a1a1a;font-size:13px">${m.client_name || '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#e86c2f;font-weight:600;font-size:13px">Address</td><td style="padding:8px 0;color:#555;font-size:13px">${[m.address, m.city, m.zip].filter(Boolean).join(', ') || '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#e86c2f;font-weight:600;font-size:13px">Measured</td><td style="padding:8px 0;color:#555;font-size:13px">${m.date || new Date(m.created_date).toLocaleDateString()}</td></tr>
      <tr><td style="padding:8px 0;color:#e86c2f;font-weight:600;font-size:13px">Total</td><td style="padding:8px 0;color:#555;font-size:13px">${(m.total_sqft || 0).toFixed(1)} ft²</td></tr>
      <tr><td style="padding:8px 0;color:#e86c2f;font-weight:600;font-size:13px">Phone</td><td style="padding:8px 0;color:#555;font-size:13px">${m.client_phone || '—'}</td></tr>
    </table>
    <a href="https://wdx-impact.app/dashboard" style="display:inline-block;background:#e86c2f;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Open CRM Dashboard</a>
  </div>
</div>`;

          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'WDX Impact <noreply@resend.dev>',
              to: techEmail,
              subject: `${followupLabel}: Follow up with ${m.client_name || 'client'}`,
              html,
            }),
          });
          if (res.ok) emailsSent++;
        }

        // Update the measurement record
        await base44.asServiceRole.entities.Measurement.update(m.id, {
          followup_count: newCount,
          next_followup_date: nextDate ? nextDate.toISOString().split('T')[0] : null,
        });
        processed++;
      } catch (e) {
        errors++;
        console.error('Error processing follow-up for measurement', m.id, e.message);
      }
    }

    return Response.json({ processed, emailsSent, errors, totalDue: due.length });
  } catch (error) {
    console.error('processFollowups error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}