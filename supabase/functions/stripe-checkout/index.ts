
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

interface CheckoutRequestBody {
	plan: string;
	priceId: string;
	userId?: string;
	returnUrl: string;
	pricingPeriod: 'monthly' | 'yearly';
}

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

		const requestBody = await req.json();
		log('Request body:', requestBody);

		const { priceId, userId, returnUrl, pricingPeriod, plan } = requestBody as CheckoutRequestBody;

		if (!priceId) {
			log('Error: Missing required parameter: priceId');
			return new Response(
				JSON.stringify({ error: 'Missing required parameters' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Log environment variables (be careful not to log sensitive values in production)
		const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
		log('Stripe key exists:', !!stripeKey);
		if (!stripeKey) {
			log('ERROR: STRIPE_SECRET_KEY environment variable is not set');
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

		// Map from our local price IDs to actual Stripe price IDs
		const priceIdMap: Record<string, string> = {
			price_premium_monthly: 'price_1RAP4ARpjThCjn22l1gJgbj7',
			price_premium_yearly: 'price_1RAP4ARpjThCjn22ndn40xT2',
			price_pro_monthly: 'price_1RAP4ARpjThCjn220EX7m28A',
			price_pro_yearly: 'price_1RAP4ARpjThCjn22OYzdydQi'
		};

		const stripePriceId = priceIdMap[priceId] || priceId;
		log(`Mapped price ID: ${priceId} → ${stripePriceId}`);

		if (!stripePriceId) {
			log(`Error: Invalid price ID mapping for ${priceId}`);
			return new Response(
				JSON.stringify({ error: `Invalid price ID: ${priceId}` }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Initialize Supabase client with service role key
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);

		// Get user email for customer creation if user is logged in
		let customerEmail: string | undefined;
		if (userId) {
			const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
			if (!userError && userData.user) {
				customerEmail = userData.user.email;
			}
		}

		// Check if customer exists or create one
		let customerId: string | undefined;
		if (customerEmail) {
			const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
			if (customers.data.length > 0) {
				customerId = customers.data[0].id;
				log('Found existing customer:', customerId);
			}
		}

		// Extract the origin from returnUrl to ensure correct redirect
		const url = new URL(returnUrl);
		const origin = `${url.protocol}//${url.host}`;
		
		// FIXED: Use /settings instead of /account for success URL
		const successUrl = `${origin}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`;
		const cancelUrl = `${origin}/pricing?canceled=true`;
		
		log('Using URLs:', { successUrl, cancelUrl });

		// Prepare checkout session parameters
		const sessionParams: any = {
			payment_method_types: ['card'],
			line_items: [
				{
					price: stripePriceId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: successUrl,
			cancel_url: cancelUrl,
			client_reference_id: userId, // Store user ID for identification
			metadata: {
				userId,
				plan,
				pricingPeriod,
			},
			allow_promotion_codes: true,
		};

		// Add customer information
		if (customerId) {
			sessionParams.customer = customerId;
		} else if (customerEmail) {
			sessionParams.customer_email = customerEmail;
		}

		log('Creating checkout session with params:', JSON.stringify(sessionParams, null, 2));

		// Create Stripe checkout session
		try {
			const session = await stripe.checkout.sessions.create(sessionParams);
			log('Checkout session created successfully:', { id: session.id, url: session.url });

			return new Response(
				JSON.stringify({ id: session.id, url: session.url, body: requestBody }),
				{
					status: 200,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		} catch (stripeError) {
			log('Stripe API error:', stripeError);
			return new Response(
				JSON.stringify({
					error: 'Stripe API error',
					message: stripeError.message,
					type: stripeError.type,
					code: stripeError.code,
					param: stripeError.param,
					body: requestBody
				}),
				{
					status: 500,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}
	} catch (error) {
		log('Unhandled error:', error);

		// Determine if it's a JSON parsing error
		let errorMessage = error.message;
		if (errorMessage.includes('JSON')) {
			errorMessage = 'Invalid JSON in request body';
		}

		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: errorMessage,
				stack: Deno.env.get('NODE_ENV') === 'production' ? undefined : error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
