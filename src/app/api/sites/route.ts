import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('id,name,address,updated_at,deleted')
    .eq('deleted', false)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 } as any);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const row = {
    id: body.id,
    name: body.name,
    address: body.address ?? null,
    deleted: !!body.deleted,
    updated_at: body.updatedAt ?? new Date().toISOString()
  };

  const { error } = await supabaseAdmin.from('sites').upsert(row, { onConflict: 'id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 } as any);

  return NextResponse.json({ ok: true });
}
