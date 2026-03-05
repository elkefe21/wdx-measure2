import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    const name = data?.full_name || 'Unknown';
    const email = data?.email || 'Unknown';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WDX Field Measurements <measurements@wdximpact.com>',
        to: ['alex@wdximpact.com'],
        subject: `New User Signed Up — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f4f2ee;border-radius:12px">
            <div style="background:#fff;border-radius:10px;padding:28px;border-top:4px solid #e86c2f">
              <h2 style="color:#e86c2f;margin:0 0 16px">New User Signed Up</h2>
              <p style="color:#555;margin:0 0 12px">A new team member just joined the WDX Field Measurements app.</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Name</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px">Email</td><td style="padding:8px 0;color:#1a1a1a">${email}</td></tr>
              </table>
            </div>
            <p style="text-align:center;color:#bbb;font-size:11px;margin-top:16px">WDX Field Measurements App</p>
          </div>
        `,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error('Resend error:', resData);
      return Response.json({ error: resData.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});