import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/tips/categories?practitioner_id=... - List unique categories for a practitioner
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const practitionerId = url?.searchParams.get('practitioner_id')?.trim();

  if (!practitionerId) {
    const res = makeRes({
      tenant,
      message: 'Missing practitioner_id',
      severity: 'error',
    });
    return NextResponse.json(res, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tips')
    .select('data')
    .eq('practitioner_id', practitionerId);

  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }

  const categories = Array.from(
    new Set(
      (Array.isArray(data) ? data : [])
        .map((row: any) => row?.data?.category)
        .filter((value: unknown): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const res = makeRes({
    tenant,
    message: 'Fetched tip categories by practitioner_id',
    severity: 'success',
    data: categories,
  });

  return NextResponse.json(res);
}
