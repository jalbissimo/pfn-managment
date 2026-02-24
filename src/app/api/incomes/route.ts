import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  const includeDeleted = searchParams.get('includeDeleted') === '1';

  let q = supabaseAdmin
    .from('income_entries')
    .select('id,site_id,entry_date,description,amount,updated_at,deleted')
    .order('updated_at', { ascending: true });

  if (!includeDeleted) q = q.eq('deleted', false);
  if (since) q = q.gt('updated_at', since);

  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const payload = {
    id: body.id,
    site_id: body.siteId ?? null,
    entry_date: body.entryDate,
    description: String(body.description ?? '').trim(),
    amount: Number(body.amount ?? 0),
    deleted: !!body.deleted
  };

  if (!payload.id || !payload.entry_date || !payload.description) {
    return Response.json({ error: 'Missing id/entryDate/description' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('income_entries')
    .upsert(payload, { onConflict: 'id' })
    .select('id,site_id,entry_date,description,amount,updated_at,deleted')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
