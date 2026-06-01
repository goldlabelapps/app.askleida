import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  if (!stripe || !webhookSecret) {
    console.error('[stripe/webhook] Stripe secrets are not fully configured.');
    return NextResponse.json({ error: 'Webhook service unavailable' }, { status: 503 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (error) {
    console.error('[stripe/webhook] Signature verification failed.', error);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any; // Use 'any' for compatibility with latest Stripe SDK
      // TODO: Implement onNewPayment logic here
      void session;
      break;
    }
    default:
      // Unexpected event type
      return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
