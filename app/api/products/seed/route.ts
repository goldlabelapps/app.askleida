import { NextResponse } from 'next/server';
import { makeRes } from '../../';

const tenant = process.env.NEXT_PUBLIC_TENANT;

// GET /api/products/seed - Seed endpoint
export async function GET() {
  const res = makeRes({
    tenant,
    message: '🌱 Products API seed endpoint is ready! You can use this endpoint to seed your database or test connectivity.',
    severity: 'success',
    data: null,
  });
  return NextResponse.json(res);
}
