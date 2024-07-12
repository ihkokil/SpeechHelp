import { supabase } from '@/integrations/supabase/client';

interface CheckoutParams {
	plan: string;
	priceId: string;
	userId?: string;
	returnUrl: string;
	pricingPeriod: 'monthly' | 'yearly';
}

export async function createCheckoutSession({
	plan,
	priceId,
	userId,
	returnUrl,
	pricingPeriod,
}: CheckoutParams) {
	try {
		const body = {
			plan,
			priceId,
			userId,
			returnUrl,
			pricingPeriod,
		};
		console.log('Creating checkout session with body:', body);

		const { data, error } = await supabase.functions.invoke('stripe-checkout', {
			body,
		});

		console.log('Checkout session created:', data);


		if (error) {
			console.error('Error creating checkout session:', error);
			throw new Error(error.message);
		}

		if (!data || !data.url) {
			throw new Error('Invalid response from checkout service');
		}

		return {
			sessionId: data.id,
			url: data.url,
		};
	} catch (error) {
		console.error('Error in createCheckoutSession:', error);
		throw error;
	}
}

// Function to get price ID based on product and interval
export function getPriceId(productId: string, interval: 'monthly' | 'yearly'): string {
	const intervalSuffix = interval === 'yearly' ? 'yearly' : 'monthly';

	switch (productId) {
		case 'prod_premium':
			return `price_premium_${intervalSuffix}`;
		case 'prod_pro':
			return `price_pro_${intervalSuffix}`;
		default:
			return 'price_basic_free';
	}
} 