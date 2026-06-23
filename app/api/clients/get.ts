import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/clients - List all clients or fetch by id
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  const practitionerId = url?.searchParams.get('practitioner_id');
  const email = url?.searchParams.get('email')?.trim().toLowerCase();
  if (id) {
    // Get single client by id
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', id)
      .limit(1);
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const row = Array.isArray(data) ? data[0] ?? null : null;
    if (!row) {
      const res = makeRes({ tenant, message: 'Client not found', severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }

    const res = makeRes({ tenant, message: 'Fetched client', severity: 'success', data: row });
    return NextResponse.json(res);
  }

  if (practitionerId) {
    // List clients for a specific practitioner
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched clients by practitioner_id', severity: 'success', data });
    return NextResponse.json(res);
  }

  if (email) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('data->>email', email)
      .order('updated', { ascending: false, nullsFirst: false });
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 500 });
    }
    const res = makeRes({ tenant, message: 'Fetched clients by email', severity: 'success', data });
    return NextResponse.json(res);
  }

  // List all clients
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('updated', { ascending: false, nullsFirst: false });
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched clients', severity: 'success', data });
  return NextResponse.json(res);
}
