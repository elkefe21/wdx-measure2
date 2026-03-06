import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const MONDAY_API = 'https://api.monday.com/v2';
const PROPOSALS_BOARD = '5621135120';
const CLIENTS_BOARD = '18401968020';
const PROPOSAL_SENT_GROUP = 'group_title';
const CLIENTS_GROUP = 'topics';

async function mondayQuery(query, apiKey) {
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

async function findClientByName(clientName, apiKey) {
  const query = `
    query {
      items_page_by_column_values(
        board_id: ${CLIENTS_BOARD},
        columns: [{ column_id: "name", column_values: ["${clientName.replace(/"/g, '\\"')}"] }]
        limit: 5
      ) {
        items { id name }
      }
    }
  `;
  const data = await mondayQuery(query, apiKey);
  const items = data?.data?.items_page_by_column_values?.items || [];
  return items.find(i => i.name.toLowerCase() === clientName.toLowerCase()) || null;
}

async function createClient(clientName, address, apiKey) {
  const columnValues = JSON.stringify({
    long_text_mm0zr9ky: { text: address || '' },
  }).replace(/"/g, '\\"');

  const query = `
    mutation {
      create_item(
        board_id: ${CLIENTS_BOARD},
        group_id: "${CLIENTS_GROUP}",
        item_name: "${clientName.replace(/"/g, '\\"')}",
        column_values: "${columnValues}"
      ) { id }
    }
  `;
  const data = await mondayQuery(query, apiKey);
  return data?.data?.create_item?.id;
}

async function createProposalItem(jobInfo, totalSqft, apiKey) {
  const address = [jobInfo.address, jobInfo.city, jobInfo.zip].filter(Boolean).join(', ');
  const itemName = `${jobInfo.clientName} — ${jobInfo.date || new Date().toISOString().split('T')[0]}`;

  const columnValues = JSON.stringify({
    text_mkst15hn: jobInfo.clientName,
    location_mkstw7gc: { address: address },
    date4: { date: jobInfo.date || new Date().toISOString().split('T')[0] },
    color_mkyq8ptw: { label: jobInfo.permitted === 'Yes' ? 'Yes' : 'No' },
    numeric_mksxvz55: parseFloat(totalSqft) || 0,
    text: jobInfo.jobNotes || '',
  });

  const escaped = columnValues.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const query = `
    mutation {
      create_item(
        board_id: ${PROPOSALS_BOARD},
        group_id: "${PROPOSAL_SENT_GROUP}",
        item_name: "${itemName.replace(/"/g, '\\"')}",
        column_values: "${escaped}"
      ) { id }
    }
  `;
  const data = await mondayQuery(query, apiKey);
  return data?.data?.create_item?.id;
}

async function createSubitem(parentId, lineItem, apiKey) {
  const label = `#${lineItem.item} ${lineItem.mark || ''} ${lineItem.series || ''} ${lineItem.config || ''}`.trim();
  const name = label.replace(/"/g, '\\"');
  const query = `
    mutation {
      create_subitem(
        parent_item_id: ${parentId},
        item_name: "${name}"
      ) { id }
    }
  `;
  await mondayQuery(query, apiKey);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { jobInfo, lineItems, photos, totalSqft } = await req.json();

    const MONDAY_API_KEY = Deno.env.get('MONDAY_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    // ── 1. Find or create client ──────────────────────────────────────────────
    let clientId = null;
    const existingClient = await findClientByName(jobInfo.clientName, MONDAY_API_KEY);
    if (existingClient) {
      clientId = existingClient.id;
      console.log('Found existing client:', clientId);
    } else {
      const address = [jobInfo.address, jobInfo.city, jobInfo.zip].filter(Boolean).join(', ');
      clientId = await createClient(jobInfo.clientName, address, MONDAY_API_KEY);
      console.log('Created new client:', clientId);
    }

    // ── 2. Create proposal item ───────────────────────────────────────────────
    const proposalId = await createProposalItem(jobInfo, totalSqft, MONDAY_API_KEY);
    console.log('Created proposal item:', proposalId);

    // ── 3. Add line items as subitems ─────────────────────────────────────────
    if (proposalId && lineItems?.length) {
      for (const item of lineItems) {
        await createSubitem(proposalId, item, MONDAY_API_KEY);
      }
    }

    // ── 4. Send email notification ────────────────────────────────────────────
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
        i.item, i.mark || '', i.series || '', i.config || '',
        i.width || '', i.height || '', i.qty || '', i.sqft || '',
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

    const optionKeys = [
      { key: 'opt_Privacy', label: 'Privacy' },
      { key: 'opt_Flush Adapter (no flange)', label: 'Flush Adapter' },
      { key: 'opt_LH', label: 'LH' },
      { key: 'opt_RH', label: 'RH' },
    ];

    const itemRows = lineItems.map((i, idx) => {
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
        <td style="padding:10px 12px;border-bottom:1px solid #ede9e3;color:#888880;font-size:12px">${i.notes || '—'}</td>
      </tr>`;
    }).join('');

    const field = (label, value) => `
      <tr>
        <td style="padding:12px 20px;width:40%;color:#e86c2f;font-size:14px;font-weight:600;border-bottom:1px solid #f0ede8">${label}</td>
        <td style="padding:12px 20px;color:#1a1a1a;font-size:14px;border-bottom:1px solid #f0ede8">
          <span style="display:inline-block;background:#f0ede8;border-radius:5px;padding:3px 10px;font-size:13px">${value || '—'}</span>
        </td>
      </tr>`;

    const mondayLink = proposalId
      ? `<div style="text-align:center;margin:16px 0"><a href="https://wdx-impact.monday.com/boards/${PROPOSALS_BOARD}/pulses/${proposalId}" style="background:#e86c2f;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">View in Monday.com</a></div>`
      : '';

    const htmlBody = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:680px;margin:30px auto;padding:0 16px 40px">
    <div style="background:#fff;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;border:2px solid #e86c2f;border-bottom:none">
      <span style="color:#e86c2f;font-size:26px;font-weight:900;letter-spacing:0.06em">WDX IMPACT</span>
      <div style="color:#e86c2f;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.7">Field Measurements</div>
      <h1 style="color:#e86c2f;margin:16px 0 0;font-size:20px;font-weight:700">New Measurement Submitted</h1>
    </div>
    <div style="height:4px;background:linear-gradient(90deg,#e86c2f,#e8a020)"></div>
    <div style="background:#fff;border-radius:0 0 16px 16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      ${mondayLink}
      <table style="width:100%;border-collapse:collapse"><tbody>
        ${field('Customer Name', jobInfo.clientName)}
        ${field('Address', [jobInfo.address, jobInfo.city, jobInfo.zip].filter(Boolean).join(', '))}
        ${field('Measured By', jobInfo.techName)}
        ${field('Date', jobInfo.date)}
        ${field('Permitted', jobInfo.permitted)}
        ${field('Glass Color', jobInfo.glassColor)}
        ${field('Frame Color', jobInfo.frameColor)}
        ${field('Low-E Coating', jobInfo.loweCoating)}
        ${jobInfo.jobNotes ? field('Job Notes', jobInfo.jobNotes) : ''}
      </tbody></table>
      <div style="padding:20px 20px 8px;background:#f9f7f5;border-top:2px solid #e86c2f">
        <div style="font-size:11px;font-weight:700;color:#e86c2f;text-transform:uppercase;letter-spacing:0.15em">Measurements</div>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:560px">
          <thead><tr style="background:#f0ede8">
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase">#</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;text-align:left">Mark</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;text-align:left">Series</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;text-align:left">Config</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase">W</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase">H</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase">Qty</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase">ft²</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;text-align:left">Options</th>
            <th style="padding:10px 12px;font-size:11px;font-weight:700;color:#888880;text-transform:uppercase;text-align:left">Notes</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
          <tfoot><tr style="background:#fff8f5">
            <td colspan="8" style="padding:14px 20px;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right">Total Square Footage:</td>
            <td colspan="2" style="padding:14px 20px;font-size:18px;font-weight:900;color:#e86c2f">${parseFloat(totalSqft).toFixed(2)} ft²</td>
          </tr></tfoot>
        </table>
      </div>
      <div style="padding:20px 24px;background:#f9f7f5;border-top:1px solid #ede9e3;text-align:center">
        <div style="font-size:12px;color:#aaa">WDX Impact Windows &amp; Doors · CGC #1535086<br>Miami-Dade · Broward · Palm Beach</div>
      </div>
    </div>
  </div>
</body></html>`;

    const clientSlug = (jobInfo.clientName || 'measurements').replace(/\s+/g, '_');
    const dateSlug = jobInfo.date || new Date().toISOString().split('T')[0];

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'WDX Field Measurements <measurements@wdximpact.com>',
        to: ['alex@wdximpact.com'],
        subject: `WDX Measure Form — ${jobInfo.clientName} — ${parseFloat(totalSqft).toFixed(2)} ft²`,
        html: htmlBody,
        attachments: [{ filename: `WDX_${clientSlug}_${dateSlug}.csv`, content: csvBase64 }],
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error('Resend error:', resendData);
      return Response.json({ error: resendData.message }, { status: 500 });
    }

    return Response.json({ success: true, proposalId, clientId, emailId: resendData.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});