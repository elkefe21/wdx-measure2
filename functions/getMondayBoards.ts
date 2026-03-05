import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const MONDAY_API_KEY = Deno.env.get('MONDAY_API_KEY');

    const query = `
      query {
        boards(ids: [5621135120, 18401968020]) {
          id
          name
          groups {
            id
            title
          }
          columns {
            id
            title
            type
          }
        }
      }
    `;

    const res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': MONDAY_API_KEY,
        'Content-Type': 'application/json',
        'API-Version': '2024-01',
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});