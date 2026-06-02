import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/tips - List all tips or fetch by id
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  const practitionerId = url?.searchParams.get('practitioner_id');
  if (id) {
    // Get single tip by id
    const { data, error } = await supabase.from('tips').select('*').eq('tip_id', id).single();
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const res = makeRes({ tenant, message: 'Fetched tip', severity: 'success', data });
    return NextResponse.json(res);
  }

  if (practitionerId) {
    // List tips for a specific practitioner
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched tips by practitioner_id', severity: 'success', data });
    return NextResponse.json(res);
  }

  // List all tips
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .order('updated', { ascending: false, nullsFirst: false });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched tips', severity: 'success', data });
  return NextResponse.json(res);
}
