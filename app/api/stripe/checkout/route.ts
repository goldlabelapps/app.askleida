import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const getStripeClient = () => {
  if (!stripeSecretKey) {
    return null;
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2026-05-27.dahlia',
  });
};

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    console.error('[stripe/checkout] STRIPE_SECRET_KEY is not configured.');
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
  }

  try {
    const { priceId, successUrl, cancelUrl } = await req.json();
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe/checkout] Session creation failed.', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
