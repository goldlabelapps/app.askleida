import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { makeRes } from '../lib/makeRes';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface I_EmailBody {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}

/**
 * POST /api/email
 *
 * Sends an email via Resend.
 *
 * Request headers:
 *   Authorization: Bearer <NOTIFY_SECRET>
 *
 * Request body (JSON):
 *   to       – email address or array of addresses
 *   subject  – email subject
 *   html     – email body (HTML)
 *   from     – sender email (optional, defaults to noreply@resend.dev)
 *   replyTo  – reply-to address (optional)
 */
export async function POST(req: NextRequest) {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const secret = process.env.NOTIFY_SECRET;
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!secret || token !== secret) {
        return NextResponse.json(
            makeRes({ severity: 'error', message: 'Unauthorized' }),
            { status: 401 },
        );
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    let body: I_EmailBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            makeRes({ severity: 'error', message: 'Invalid JSON body' }),
            { status: 400 },
        );
    }

    const { to, subject, html, from = 'nx@goldlabel.pro', replyTo } = body;

    if (!to) {
        return NextResponse.json(
            makeRes({ severity: 'error', message: '`to` is required' }),
            { status: 400 },
        );
    }

    if (!subject) {
        return NextResponse.json(
            makeRes({ severity: 'error', message: '`subject` is required' }),
            { status: 400 },
        );
    }

    if (!html) {
        return NextResponse.json(
            makeRes({ severity: 'error', message: '`html` is required' }),
            { status: 400 },
        );
    }

    try {
        const response = await resend.emails.send({
            from,
            to,
            subject,
            html,
            ...(replyTo && { reply_to: replyTo }),
        });

        if (response.error) {
            return NextResponse.json(
                makeRes({ severity: 'error', message: response.error.message }),
                { status: 400 },
            );
        }

        return NextResponse.json(
            makeRes({
                severity: 'success',
                message: 'Email sent successfully',
                data: { id: response.data?.id },
            }),
        );
    } catch (error) {
        console.error('Resend error:', error);
        return NextResponse.json(
            makeRes({
                severity: 'error',
                message: error instanceof Error ? error.message : 'Failed to send email',
            }),
            { status: 500 },
        );
    }
}
