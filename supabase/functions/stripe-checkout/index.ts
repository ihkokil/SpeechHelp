
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
		// Initialize Supabase client to get user info
		const supabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') ?? "",
			Deno.env.get('SUPABASE_ANON_KEY') ?? ""
		);

		// Get authenticated user
		const authHeader = req.headers.get("Authorization");
		let userId = null;
		let userEmail = null;

		if (authHeader) {
			const token = authHeader.replace("Bearer ", "");
			const { data: userData } = await supabaseClient.auth.getUser(token);
			userId = userData.user?.id;
			userEmail = userData.user?.email;
			log('Authenticated user found:', { userId, userEmail });
		}

		const requestBody = await req.json();
		log('Request body:', requestBody);

		const { priceId, returnUrl, pricingPeriod, plan } = requestBody as CheckoutRequestBody;

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

		// Get Stripe API key from environment
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

		// Prepare checkout session parameters
		const sessionParams = {
			payment_method_types: ['card'],
			line_items: [
				{
					price: stripePriceId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${returnUrl}?canceled=true`,
			client_reference_id: userId, // This is crucial for linking payment to user
			customer_email: userEmail,
			metadata: {
				userId: userId || 'anonymous',
				plan,
				pricingPeriod,
			},
			allow_promotion_codes: true,
		};

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
