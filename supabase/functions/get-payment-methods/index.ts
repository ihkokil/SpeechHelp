
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

// Helper function to log with timestamps
const log = (message: string, data?: any) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${message}`);
	if (data) {
		console.log(JSON.stringify(data, null, 2));
	}
};

serve(async (req) => {
	// Log incoming request
	log(`Received ${req.method} request to ${req.url}`);

	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		log('Handling CORS preflight request');
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		// Log request headers for debugging
		log('Request headers:', Object.fromEntries(req.headers.entries()));

		const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
		if (!stripeKey) {
			log('ERROR: STRIPE_SECRET_KEY is not set');
			return new Response(
				JSON.stringify({ error: 'Stripe API key not configured' }),
				{
					status: 500,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Initialize Stripe
		log('Initializing Stripe client');
		const stripe = new Stripe(stripeKey, {
			apiVersion: '2023-10-16',
			httpClient: Stripe.createFetchHttpClient(),
		});

		// Initialize Supabase client with service role key
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);

		// Get user from authorization header
		const authHeader = req.headers.get('Authorization');
		if (!authHeader) {
			log('Error: No authorization header provided');
			return new Response(
				JSON.stringify({ error: 'No authorization header provided' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: userData, error: userError } = await supabase.auth.getUser(token);
		if (userError || !userData.user) {
			log('Error: Invalid user token');
			return new Response(
				JSON.stringify({ error: 'Invalid user token' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const user = userData.user;
		log('User authenticated', { userId: user.id, email: user.email });

		// Get user's profile to find Stripe customer ID
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('stripe_customer_id')
			.eq('id', user.id)
			.single();

		if (profileError || !profile?.stripe_customer_id) {
			log('No Stripe customer found for user');
			return new Response(
				JSON.stringify({ paymentMethods: [] }),
				{
					status: 200,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('Found Stripe customer', { customerId: profile.stripe_customer_id });

		// Get customer details including default payment method
		const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
		const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;

		log('Customer default payment method', { defaultPaymentMethodId });

		// Get payment methods from Stripe
		const paymentMethods = await stripe.paymentMethods.list({
			customer: profile.stripe_customer_id,
			type: 'card',
		});

		log('Retrieved payment methods from Stripe', { count: paymentMethods.data.length });

		// Format payment methods for frontend
		const formattedPaymentMethods = paymentMethods.data.map((pm) => ({
			id: pm.id,
			type: 'Credit Card',
			last4: pm.card?.last4 || '',
			expiryMonth: pm.card?.exp_month || 0,
			expiryYear: pm.card?.exp_year || 0,
			brand: pm.card?.brand ? pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1) : '',
			isDefault: pm.id === defaultPaymentMethodId,
			cardHolder: pm.billing_details?.name || '',
			billingAddress: {
				street: pm.billing_details?.address?.line1 || '',
				city: pm.billing_details?.address?.city || '',
				state: pm.billing_details?.address?.state || '',
				zipCode: pm.billing_details?.address?.postal_code || '',
				country: pm.billing_details?.address?.country || ''
			}
		}));

		log('Formatted payment methods for frontend', formattedPaymentMethods);

		return new Response(
			JSON.stringify({ paymentMethods: formattedPaymentMethods }),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);

	} catch (error) {
		log('Unhandled error:', error);
		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: error.message,
				stack: Deno.env.get('NODE_ENV') === 'production' ? undefined : error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
