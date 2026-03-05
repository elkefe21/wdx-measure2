import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { jobInfo, lineItems, totalSqft } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    // ── Generate CSV ──────────────────────────────────────────────────────────
    const csvRows = [
      ['WDX Window & Door Measure Form'],
      [],
      ['FIELD', 'VALUE'],
      ['Client Name', jobInfo.clientName],
      ['Address', jobInfo.address],
      ['City', jobInfo.city],
      ['Zip', jobInfo.zip],
      ['Technician', jobInfo.techName],
      ['Date', jobInfo.date],
      ['Permitted', jobInfo.permitted],
      ['Glass Color', jobInfo.glassColor],
      ['Frame Color', jobInfo.frameColor],
      ['Low-E Coating', jobInfo.loweCoating],
      ['Job Notes', jobInfo.jobNotes || ''],
      ['Total SqFt', totalSqft],
      [],
      ['#', 'Mark', 'Series', 'Config', 'Width (in)', 'Height (in)', 'Qty', 'SqFt', 'Privacy', 'Flush Adapter', 'LH', 'RH', 'Notes'],
      ...lineItems.map(i => [
        i.item,
        i.mark || '',
        i.series || '',
        i.config || '',
        i.width || '',
        i.height || '',
        i.qty || '',
        i.sqft || '',
        i['opt_Privacy'] ? 'Yes' : '',
        i['opt_Flush Adapter (no flange)'] ? 'Yes' : '',
        i['opt_LH'] ? 'Yes' : '',
        i['opt_RH'] ? 'Yes' : '',
        i.notes || '',
      ]),
    ];
    const csvContent = csvRows
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const csvBase64 = btoa(unescape(encodeURIComponent(csvContent)));

    // ── Generate HTML email (Jotform-style) ──────────────────────────────────
    const itemRows = lineItems.map((i, idx) => {
      const optionKeys = [
        { key: 'opt_Privacy', label: 'Privacy' },
        { key: 'opt_Flush Adapter (no flange)', label: 'Flush Adapter' },
        { key: 'opt_LH', label: 'LH' },
        { key: 'opt_RH', label: 'RH' },
      ];
      const checkedOpts = optionKeys.filter(o => i[o.key]).map(o => `<div style="color:#e86c2f;font-size:12px">&#10003; ${o.label}</div>`).join('');
      return `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f9f7f5'}">
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px;text-align:center">${i.item}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px">${i.mark || '—'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px">${i.series || '—'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px">${i.config || '—'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px;text-align:center">${i.width || '—'}"</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px;text-align:center">${i.height || '—'}"</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#1a1a1a;font-size:13px;text-align:center">${i.qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#e86c2f;font-size:13px;font-weight:600;text-align:center">${i.sqft} ft²</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;font-size:12px">${checkedOpts || '<span style="color:#ccc">—</span>'}</td>
        ${i.notes ? `<td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#888880;font-size:12px">${i.notes}</td>` : '<td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#ccc;font-size:13px">—</td>'}
      </tr>
    `}).join('');

    const field = (label, value) => `
      <tr>
        <td style="padding:12px 20px;width:40%;color:#e86c2f;font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #f0ede8">${label}</td>
        <td style="padding:12px 20px;color:#1a1a1a;font-size:14px;border-bottom:1px solid #f0ede8">
          <span style="display:inline-block;background:#f0ede8;border-radius:5px;padding:3px 10px;font-size:13px">${value || '—'}</span>
        </td>
      </tr>
    `;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:680px;margin:30px auto;background:#f4f2ee;padding:0 16px 40px">

    <!-- Header -->
    <div style="background:#ffffff;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;border:2px solid #e86c2f;border-bottom:none">
      <div style="display:inline-block;border-radius:12px;padding:10px 20px;margin-bottom:12px">
        <span style="color:#e86c2f;font-size:26px;font-weight:900;letter-spacing:0.06em">WDX IMPACT</span>
      </div>
      <div style="color:#e86c2f;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px;opacity:0.7">Field Measurements</div>
      <h1 style="color:#e86c2f;margin:16px 0 0;font-size:20px;font-weight:700">Window &amp; Door Measure Form</h1>
    </div>

    <!-- Orange accent bar -->
    <div style="height:4px;background:linear-gradient(90deg,#e86c2f,#e8a020)"></div>

    <!-- Main card -->
    <div style="background:#ffffff;border-radius:0 0 16px 16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

      <!-- Client info table -->
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${field('Customer Name', jobInfo.clientName)}
          ${field('Customer Address', [jobInfo.address, jobInfo.city, jobInfo.zip].filter(Boolean).join(', '))}
          ${field('Measured By', jobInfo.techName)}
          ${field('Date of Measure', jobInfo.date)}
          ${field('Permitted', jobInfo.permitted)}
          ${field('Glass Color', jobInfo.glassColor)}
          ${field('Frame Color', jobInfo.frameColor)}
          ${field('Low-E Coating', jobInfo.loweCoating)}
          ${jobInfo.jobNotes ? field('Job Notes', jobInfo.jobNotes) : ''}
        </tbody>
      </table>

      <!-- Measurements section -->
      <div style="padding:20px 20px 8px;background:#f9f7f5;border-top:2px solid #e86c2f">
        <div style="font-size:11px;font-weight:700;color:#e86c2f;text-transform:uppercase;letter-spacing:0.15em">Measurements</div>
      </div>

      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:560px">
          <thead>
            <tr style="background:#f0ede8">
              <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">#</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Mark</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Series</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Config</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">W</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">H</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Qty</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">ft²</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Options</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;letter-spacing:0.08em">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr style="background:#fff8f5">
              <td colspan="8" style="padding:14px 20px;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right">Total Square Footage:</td>
              <td colspan="2" style="padding:14px 20px;font-size:18px;font-weight:900;color:#e86c2f">${parseFloat(totalSqft).toFixed(2)} ft²</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer -->
      <div style="padding:20px 24px;background:#f9f7f5;border-top:1px solid #ede9e3;text-align:center">
        <div style="font-size:12px;color:#aaa">
          WDX Impact Windows &amp; Doors · CGC #1535086<br>
          Miami-Dade · Broward · Palm Beach
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:16px;font-size:11px;color:#bbb">
      Submitted via WDX Field Measurements App
    </div>
  </div>
</body>
</html>`;

    const clientSlug = (jobInfo.clientName || 'measurements').replace(/\s+/g, '_');
    const dateSlug = jobInfo.date || new Date().toISOString().split('T')[0];
    const filename = `WDX_${clientSlug}_${dateSlug}.csv`;

    // ── Send via Resend ───────────────────────────────────────────────────────
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WDX Field Measurements <measurements@wdximpact.com>',
        to: ['alex@wdximpact.com'],
        subject: `WDX Measure Form — ${jobInfo.clientName} — ${parseFloat(totalSqft).toFixed(2)} ft²`,
        html: htmlBody,
        attachments: [
          {
            filename,
            content: csvBase64,
          },
        ],
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return Response.json({ error: resendData.message || 'Email failed' }, { status: 500 });
    }

    return Response.json({ success: true, id: resendData.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});