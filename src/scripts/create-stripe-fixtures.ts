
import { config } from 'dotenv';
import { resolve } from 'path';
import Stripe from 'stripe';
import { createStripeProducts } from '../lib/products';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	console.error('Missing STRIPE_SECRET_KEY in environment variables');
	process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2025-03-31.basil', // Updated to the correct API version
});

async function main() {
	try {
		console.log('Creating Stripe products and prices...');
		await createStripeProducts(stripe);
		console.log('Stripe setup completed successfully!');
	} catch (error) {
		console.error('Error setting up Stripe fixtures:', error);
		process.exit(1);
	}
}

main(); 
