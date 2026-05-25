import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/products - List all products
export async function GET(req: Request) {
  const url = req?.url ? new URL(req.url) : null;
  const id = url?.searchParams.get('id');
  if (id) {
    // Get product(s) by id (may return multiple, handle as array)
    const { data, error } = await supabase.from('products').select('*').eq('product_id', id);
    if (error) {
      const res = makeRes({ tenant, message: error.message, severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    if (!data || data.length === 0) {
      const res = makeRes({ tenant, message: 'No product found with this id', severity: 'error' });
      return NextResponse.json(res, { status: 404 });
    }
    const res = makeRes({ tenant, message: 'Fetched product(s)', severity: 'success', data });
    return NextResponse.json(res);
  }
  // List all products
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Fetched products', severity: 'success', data });
  return NextResponse.json(res);
}
