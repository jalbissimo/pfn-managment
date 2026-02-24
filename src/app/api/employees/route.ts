import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  const includeDeleted = searchParams.get('includeDeleted') === '1';

  let q = supabaseAdmin
    .from('employees')
    .select('id,name,job_title,hourly_rate,hours_per_day,updated_at,deleted')
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
    name: String(body.name ?? '').trim(),
    job_title: body.jobTitle ?? null,
    hourly_rate: Number(body.hourlyRate ?? 0),
    hours_per_day: Number(body.hoursPerDay ?? 0),
    deleted: !!body.deleted
  };

  if (!payload.id || !payload.name) {
    return Response.json({ error: 'Missing id/name' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('employees')
    .upsert(payload, { onConflict: 'id' })
    .select('id,name,job_title,hourly_rate,hours_per_day,updated_at,deleted')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
