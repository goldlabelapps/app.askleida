import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/practitioner - List all practitioners or fetch by id
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  const practitionerId = url?.searchParams.get('practitioner_id');
  const email = url?.searchParams.get('email')?.trim().toLowerCase();

  if (id) {
    // Get single practitioner by id
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('practitioner_id', id)
      .limit(1);
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const row = Array.isArray(data) ? data[0] ?? null : null;
    if (!row) {
      const res = makeRes({ tenant, message: 'Practitioner not found', severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }

    const res = makeRes({ tenant, message: 'Fetched practitioner', severity: 'success', data: row });
    return NextResponse.json(res);
  }

  if (practitionerId) {
    // List practitioners for a specific practitioner id
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched practitioners by practitioner_id', severity: 'success', data });
    return NextResponse.json(res);
  }

  if (email) {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('data->>email', email)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched practitioners by email', severity: 'success', data });
    return NextResponse.json(res);
  }

  const { data, error } = await supabase
    .from('practitioners')
    .select('*')
    .order('updated', { ascending: false, nullsFirst: false });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched practitioners', severity: 'success', data });
  return NextResponse.json(res);
}