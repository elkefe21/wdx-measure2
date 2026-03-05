import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    const userId = event?.entity_id;
    const email = data?.email;

    if (!userId || !email) {
      return Response.json({ error: 'Missing user id or email' }, { status: 400 });
    }

    // Only set full_name if it's empty (not already set)
    if (!data?.full_name) {
      await base44.asServiceRole.entities.User.update(userId, { full_name: email });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});