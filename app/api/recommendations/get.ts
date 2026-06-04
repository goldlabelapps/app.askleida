import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  const practitionerId = url?.searchParams.get('practitioner_id');

  if (id) {
    const { data, error } = await supabase.from('recommendations').select('*').eq('recommendation_id', id).single();
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const res = makeRes({ tenant, message: 'Fetched recommendation', severity: 'success', data });
    return NextResponse.json(res);
  }

  if (practitionerId) {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched recommendations by practitioner_id', severity: 'success', data });
    return NextResponse.json(res);
  }

  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('updated', { ascending: false, nullsFirst: false });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched recommendations', severity: 'success', data });
  return NextResponse.json(res);
}
