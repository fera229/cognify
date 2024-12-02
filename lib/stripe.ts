import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('Stripe secret key is not defined.');
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
