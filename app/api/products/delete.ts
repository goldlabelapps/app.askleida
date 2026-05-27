import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// DELETE /api/products - Delete a product (expects { product_id })
export async function DELETE(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    const res = makeRes({ tenant, message: 'Invalid JSON body', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  // Ensure body is a non-null object and not an array
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    const res = makeRes({ tenant, message: 'Request body must be a JSON object', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  const { id } = body;
  // Validate id as a non-empty string (UUID)
  if (!id || typeof id !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(id)) {
    const res = makeRes({ tenant, message: 'Missing or invalid product id (must be UUID)', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }

  // Use 'id' (UUID) for deletion
  const { data, error } = await supabase.from('products').delete().eq('id', id).select();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 500 });
  }
  const res = makeRes({ tenant, message: 'Product deleted', severity: 'success', data });
  return NextResponse.json(res);
}
