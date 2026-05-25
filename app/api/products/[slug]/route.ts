import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/products/:slug - Get product by slug
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  if (!slug) {
    const res = makeRes({ tenant, message: 'Missing slug parameter', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug);
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 404 });
  }
  if (!data || data.length === 0) {
    const res = makeRes({ tenant, message: 'No product found with this slug', severity: 'error' });
    return NextResponse.json(res, { status: 404 });
  }
  // If only one product, return the object, else return the array
  const result = data.length === 1 ? data[0] : data;
  const res = makeRes({ tenant, message: 'Fetched product(s)', severity: 'success', data: result });
  return NextResponse.json(res);
}
