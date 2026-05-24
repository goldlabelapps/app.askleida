import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { makeRes } from '../../';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tenant = process.env.NEXT_PUBLIC_TENANT;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/accounts/:id - Get account by user_id
export async function GET(
  req: Request,
  context?: { params?: { id?: string } }
) {
  let id = context?.params?.id;
  // Fallback: extract id from URL if not present in params
  if (!id && req.url) {
    const match = req.url.match(/\/accounts\/(.*?)($|\?|#)/);
    if (match && match[1]) {
      id = match[1];
    }
  }
  if (!id) {
    const res = makeRes({ tenant, message: 'Missing id parameter', severity: 'error' });
    return NextResponse.json(res, { status: 400 });
  }
  const { data, error } = await supabase.from('accounts').select('*').eq('user_id', id).single();
  if (error) {
    const res = makeRes({ tenant, message: error.message, severity: 'error' });
    return NextResponse.json(res, { status: 404 });
  }
  const res = makeRes({ tenant, message: 'Fetched account', severity: 'success', data });
  return NextResponse.json(res);
}
