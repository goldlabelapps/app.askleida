import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../lib/makeRes';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  // Query the information_schema to get all table names
  const { data, error } = await supabase.rpc('list_tables');
  if (error) {
    const res = makeRes({
      tenant,
      message: error.message,
      severity: 'error',
    });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({
    tenant,
    message: 'Fetched Supabase tables successfully',
    severity: 'success',
    data,
  });
  return NextResponse.json(res);
}
