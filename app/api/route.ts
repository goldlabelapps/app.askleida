import { NextResponse } from 'next/server';
import { makeRes } from './lib/makeRes';

export async function GET() {
    const res = makeRes({
        tenant: process.env.NEXT_PUBLIC_TENANT,
        message: `Hullo`,
        severity: 'success',
    });
    return NextResponse.json(res);
}
