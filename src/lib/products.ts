import { Stripe } from 'stripe';

// Define product types
export interface Product {
	id: string;
	name: string;
	description: string;
	features: string[];
	ctaText?: string;
}

export interface Price {
	id: string;
	productId: string;
	amount: number;
	currency: string;
	interval?: 'month' | 'year';
	intervalCount?: number;
}

export const products: Product[] = [
	{
		id: 'prod_basic',
		name: 'Basic / Free Trial',
		description: 'Perfect for individuals starting their speaking journey',
		features: [
			'One-Time Wonder: Craft a Single Speech for Any Occasion',
			'Unlock Expert Tips: Explore Our Speech Writing Secrets',
			'7-Day Access: Revisit and Refine Your Speech Anytime',
			'No credit card required'
		],
		ctaText: 'Get Started'
	},
	{
		id: 'prod_premium',
		name: 'Premium Plan',
		description: 'For serious speakers who need more power',
		features: [
			'Craft Up to 3 Speeches per Month: Speak with Confidence',
			'Advanced Speech Writing Insights: Elevate Your Skills',
			'Continuous Access: Manage and Modify Speeches Anytime',
			'Personalized Feedback: Expert Guidance at Your Fingertips',
			'Priority Email Support: Get Help When You Need It'
		],
		ctaText: 'Upgrade to Premium'
	},
	{
		id: 'prod_pro',
		name: 'Pro Plan',
		description: 'Full-featured plan for professional speakers',
		features: [
			'Unlimited Speech Creations: Master Every Occasion',
			'Comprehensive Speech Toolkit: Elevate Your Craft',
			'Ongoing Access: Your Speech Vault',
			'Enhanced Personalized Feedback: Expert Guidance at Your Fingertips',
			'Fast-Track Support: Direct Assistance, Anytime'
		],
		ctaText: 'Upgrade to Pro'
	}
];

export const prices: Price[] = [
	// Basic Plan - Free
	{
		id: 'price_basic_free',
		productId: 'prod_basic',
		amount: 0,
		currency: 'usd'
	},

	// Premium Plan - Monthly
	{
		id: 'price_premium_monthly',
		productId: 'prod_premium',
		amount: 999, // $9.99
		currency: 'usd',
		interval: 'month',
		intervalCount: 1
	},
	// Premium Plan - Yearly
	{
		id: 'price_premium_yearly',
		productId: 'prod_premium',
		amount: 9999, // $99.99
		currency: 'usd',
		interval: 'year',
		intervalCount: 1
	},

	// Pro Plan - Monthly
	{
		id: 'price_pro_monthly',
		productId: 'prod_pro',
		amount: 2999, // $29.99
		currency: 'usd',
		interval: 'month',
		intervalCount: 1
	},
	// Pro Plan - Yearly
	{
		id: 'price_pro_yearly',
		productId: 'prod_pro',
		amount: 29999, // $299.99
		currency: 'usd',
		interval: 'year',
		intervalCount: 1
	}
];

// Function to create Stripe products and prices
export const createStripeProducts = async (stripe: Stripe): Promise<void> => {
	try {
		// Create products
		for (const product of products) {
			const stripeProduct = await stripe.products.create({
				id: product.id,
				name: product.name,
				description: product.description,
				metadata: {
					features: JSON.stringify(product.features)
				}
			});

			console.log(`Created product: ${stripeProduct.name}`);
		}

		// Create prices
		for (const price of prices) {
			const stripePrice = await stripe.prices.create({
				product: price.productId,
				unit_amount: price.amount,
				currency: price.currency,
				recurring: price.interval ? {
					interval: price.interval,
					interval_count: price.intervalCount || 1
				} : undefined
			});

			console.log(`Created price: ${price.amount} ${price.currency} for product ${price.productId}`);
		}

		console.log('All products and prices created successfully');
	} catch (error) {
		console.error('Error creating Stripe products:', error);
		throw error;
	}
};

// Function to retrieve all products and prices
export const getProductsWithPrices = async (stripe: Stripe): Promise<{
	products: Stripe.Product[];
	prices: Stripe.Price[];
}> => {
	const products = await stripe.products.list({ active: true });
	const prices = await stripe.prices.list({ active: true });

	return {
		products: products.data,
		prices: prices.data
	};
};

// Helper function to get product with its prices
export const getFormattedProducts = async (stripe: Stripe) => {
	const { products, prices } = await getProductsWithPrices(stripe);

	return products.map(product => ({
		...product,
		prices: prices.filter(price => price.product === product.id)
	}));
};
