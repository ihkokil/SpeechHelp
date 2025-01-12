
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

		// Parse request body
		const requestBody = await req.json();
		const { 
			cardNumber, 
			expiryMonth, 
			expiryYear, 
			cvv, 
			cardHolder, 
			isDefault
		} = requestBody;

		log('Request data', { 
			cardNumber: '****' + cardNumber.slice(-4), 
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

		// Create payment method in Stripe
		const paymentMethod = await stripe.paymentMethods.create({
			type: 'card',
			card: {
				number: cardNumber,
				exp_month: parseInt(expiryMonth),
				exp_year: parseInt(expiryYear),
				cvc: cvv,
			},
			billing_details: {
				name: cardHolder,
			},
		});

		log('Created payment method', { paymentMethodId: paymentMethod.id });

		// Attach payment method to customer
		await stripe.paymentMethods.attach(paymentMethod.id, {
			customer: customerId,
		});

		log('Attached payment method to customer');

		// If this should be the default payment method, set it as default
		if (isDefault) {
			await stripe.customers.update(customerId, {
				invoice_settings: {
					default_payment_method: paymentMethod.id,
				},
			});
			log('Set as default payment method');
		}

		// Return the created payment method data
		const responseData = {
			id: paymentMethod.id,
			type: 'Credit Card',
			last4: paymentMethod.card?.last4,
			expiryMonth: paymentMethod.card?.exp_month,
			expiryYear: paymentMethod.card?.exp_year,
			brand: paymentMethod.card?.brand,
			isDefault: isDefault,
			cardHolder: cardHolder,
		};

		log('Payment method created successfully', responseData);

		return new Response(
			JSON.stringify({ 
				success: true,
				paymentMethod: responseData,
				message: 'Payment method added successfully'
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
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
