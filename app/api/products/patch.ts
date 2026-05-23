import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PATCH /api/products - Update a product (expects { product_id, ...fields })
export async function PATCH(req: Request) {
  const body = await req.json();
  const { product_id, ...fields } = body;
  if (!product_id) {
    const res = makeRes({ tenant, message: 'Missing product_id', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('products').update(fields).eq('product_id', product_id).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Product updated', severity: 'success', data });
  return NextResponse.json(res);
}
