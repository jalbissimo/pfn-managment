import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  const includeDeleted = searchParams.get('includeDeleted') === '1';

  let q = supabaseAdmin
    .from('time_entries')
    .select('id,employee_id,site_id,work_date,hours,note,updated_at,deleted')
    .order('updated_at', { ascending: true });

  if (!includeDeleted) q = q.eq('deleted', false);
  if (since) q = q.gt('updated_at', since);

  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const employeeId = String(body.employeeId ?? body.employee_id ?? '').trim();
  const workDate = String(body.workDate ?? body.work_date ?? '').trim();

  const siteIdRaw = String(body.siteId ?? body.site_id ?? '').trim();
  const siteId = siteIdRaw.length ? siteIdRaw : null;

  const incomingId = String(body.id ?? '').trim();
  if (!incomingId || !employeeId || !workDate) {
    return Response.json({ error: 'Missing id/employeeId/workDate' }, { status: 400 });
  }

  const { data: existing, error: findErr } = (await supabaseAdmin
    .from('time_entries')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('work_date', workDate)
    .maybeSingle()) as any;

  if (findErr) return Response.json({ error: findErr.message }, { status: 500 });

  const finalId = existing?.id ?? incomingId;

  const payload = {
    id: finalId,
    employee_id: employeeId,
    site_id: siteId,
    work_date: workDate,
    hours: Number(body.hours ?? 0),
    note: body.note ?? null,
    deleted: !!body.deleted
  };

  const { data, error } = await supabaseAdmin
    .from('time_entries')
    .upsert(payload, { onConflict: 'id' })
    .select('id,employee_id,site_id,work_date,hours,note,updated_at,deleted')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
