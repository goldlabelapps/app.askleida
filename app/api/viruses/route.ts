import { NextResponse } from 'next/server';
import { makeRes } from '../lib/makeRes';
import { getEndpoints } from '../';

export async function GET() {
    const res = makeRes({
        tenant: process.env.NEXT_PUBLIC_TENANT,
        severity: 'success',
        message: `/viruses endpoint`,
    });
    return NextResponse.json(res);
}