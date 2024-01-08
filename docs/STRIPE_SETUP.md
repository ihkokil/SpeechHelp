# Stripe Setup Guide

This guide explains how to set up Stripe products and pricing for the Speech Helper AI application.

## Prerequisites

1. A Stripe account (you can create one at [stripe.com](https://stripe.com))
2. Stripe API keys (available in your Stripe Dashboard)

## Setting Up Environment Variables

1. Update your `.env.local` file with your Stripe secret key:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key_here
```

Replace `sk_test_your_stripe_test_key_here` with your actual test key from the Stripe Dashboard.

## Product Configuration

The products and pricing plans are defined in `src/lib/products.ts`. There are three plans:

1. **Basic / Free Trial** - $0.00 (Free)
   - One-time speech creation
   - Basic tips
   - 7-day access

2. **Premium Plan** - $9.99/month or $99.99/year
   - Up to 3 speeches per month
   - Advanced writing insights
   - Continuous access to speeches
   - Personalized feedback
   - Priority email support

3. **Pro Plan** - $29.99/month or $299.99/year
   - Unlimited speech creations
   - Comprehensive toolkit
   - Ongoing access to all speeches
   - Enhanced personalized feedback
   - Fast-track support

## Creating Stripe Products

To create these products in your Stripe account:

1. Run the setup script:

```bash
npm run stripe:setup
# or
pnpm stripe:setup
```

This will:
- Create the products in your Stripe account
- Create the corresponding prices (monthly and yearly for Premium and Pro plans)
- Output success messages for each created product and price

## Using the Pricing Component

The `PricingPlans` component in `src/components/PricingPlans.tsx` provides a UI for displaying the pricing plans with a toggle between monthly and yearly billing.

To use it in your application:

```tsx
import PricingPlans from './components/PricingPlans';

function App() {
  return (
    <div>
      <h1>Speech Helper AI</h1>
      <PricingPlans />
    </div>
  );
}
```

## Testing Payments

For testing payments in development:

1. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Use any future expiration date, any 3-digit CVC, and any postal code.

## Production Deployment

Before going to production:

1. Replace test keys with production keys
2. Update the `.env.local` file with production keys
3. Consider implementing webhook handling for subscription events

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api) 