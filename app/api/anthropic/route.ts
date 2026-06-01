import { NextRequest, NextResponse } from 'next/server';
import { makeRes } from '../';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const res = makeRes({
      message: 'ANTHROPIC',
      severity: 'success',
      data: { apiKey },
    });
    return NextResponse.json(res);
  } catch (error: any) {
    const res = makeRes({
      message: 'Anthropic',
      severity: 'error',
      data: { error: error.message },
    });
    return NextResponse.json(res);
  }
}
