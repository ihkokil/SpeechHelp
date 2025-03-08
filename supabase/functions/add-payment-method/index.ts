
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
		// Validate method
		if (req.method !== 'POST') {
			log(`Method ${req.method} not allowed`);
			return new Response(
				JSON.stringify({ error: 'Method not allowed' }),
				{
					status: 405,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

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
			log('Error: Invalid user token', userError);
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

		// Parse request body
		let requestBody;
		try {
			requestBody = await req.json();
		} catch (parseError) {
			log('Error parsing request body:', parseError);
			return new Response(
				JSON.stringify({ error: 'Invalid JSON in request body' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const { 
			cardNumber, 
			expiryMonth, 
			expiryYear, 
			cvv, 
			cardHolder, 
			isDefault
		} = requestBody;

		// Validate required fields
		if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardHolder) {
			log('Error: Missing required fields');
			return new Response(
				JSON.stringify({ error: 'Missing required fields' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const last4 = cardNumber.slice(-4);
		log('Request data', { 
			cardNumber: '****' + last4, 
			expiryMonth, 
			expiryYear,
			cardHolder,
			isDefault 
		});

		// Get or create Stripe customer
		let customerId: string;
		
		// Check if user already has a Stripe customer ID
		const { data: profile } = await supabase
			.from('profiles')
			.select('stripe_customer_id')
			.eq('id', user.id)
			.single();

		if (profile?.stripe_customer_id) {
			customerId = profile.stripe_customer_id;
			log('Found existing customer', { customerId });
		} else {
			// Create new customer
			const customer = await stripe.customers.create({
				email: user.email,
				name: cardHolder,
			});
			customerId = customer.id;
			log('Created new customer', { customerId });

			// Update profile with customer ID
			await supabase
				.from('profiles')
				.update({ stripe_customer_id: customerId })
				.eq('id', user.id);
		}

		// Check for existing payment methods with same card details
		log('Checking for existing payment methods');
		const existingPaymentMethods = await stripe.paymentMethods.list({
			customer: customerId,
			type: 'card',
		});

		// Check if a card with the same last4 and expiry already exists
		const duplicateCard = existingPaymentMethods.data.find(pm => 
			pm.card?.last4 === last4 && 
			pm.card?.exp_month === parseInt(expiryMonth) && 
			pm.card?.exp_year === parseInt(expiryYear)
		);

		if (duplicateCard) {
			log('Duplicate card found, not creating new payment method', { 
				existingCardId: duplicateCard.id,
				last4: duplicateCard.card?.last4 
			});
			
			return new Response(
				JSON.stringify({ 
					success: false,
					error: 'This card is already saved to your account',
					duplicate: true
				}),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// For test mode, we need to create a Setup Intent to collect payment method
		log('Creating Setup Intent for payment method collection');
		
		const setupIntent = await stripe.setupIntents.create({
			customer: customerId,
			payment_method_types: ['card'],
			usage: 'off_session',
		});

		log('Created Setup Intent', { setupIntentId: setupIntent.id, clientSecret: setupIntent.client_secret });

		// Check if this will be the first payment method (to set as default)
		const isFirstCard = existingPaymentMethods.data.length === 0;
		log('Payment method count check', { 
			existingCount: existingPaymentMethods.data.length,
			isFirstCard 
		});

		return new Response(
			JSON.stringify({ 
				success: true,
				message: 'Please complete payment method setup using Stripe Elements',
				setupIntent: {
					id: setupIntent.id,
					clientSecret: setupIntent.client_secret
				},
				isFirstCard: isFirstCard
			}),
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
				details: error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
