export const runtime = 'nodejs';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markEnrollmentAsPaid } from '@/database/enrollments';

// Disable body parsing, need raw body for webhook signature verification

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'No signature or webhook secret' },
      { status: 400 },
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Get the metadata we attached to the session
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (!userId || !courseId) {
        console.error('Missing metadata in Stripe webhook');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 },
        );
      }

      // Mark the enrollment as paid
      await markEnrollmentAsPaid(Number(userId), Number(courseId));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
