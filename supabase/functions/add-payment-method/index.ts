
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

		// Map test card numbers to Stripe test tokens
		const testCardTokens: { [key: string]: string } = {
			'4242424242424242': 'pm_card_visa',
			'4000056655665556': 'pm_card_visa_debit',
			'5555555555554444': 'pm_card_mastercard',
			'2223003122003222': 'pm_card_mastercard',
			'5200828282828210': 'pm_card_mastercard_debit',
			'5105105105105100': 'pm_card_mastercard_prepaid',
			'378282246310005': 'pm_card_amex',
			'371449635398431': 'pm_card_amex',
			'6011111111111117': 'pm_card_discover',
			'6011000990139424': 'pm_card_discover',
			'3056930009020004': 'pm_card_diners',
			'36227206271667': 'pm_card_diners',
			'3566002020360505': 'pm_card_jcb',
			'6200000000000005': 'pm_card_unionpay'
		};

		let paymentMethod;
		
		// Check if this is a test card and use the appropriate token
		if (testCardTokens[cardNumber]) {
			log('Using Stripe test card token for card number', { cardNumber: '****' + cardNumber.slice(-4) });
			
			// For test cards, we'll create a payment method using the test token
			// But we need to create it differently for test environment
			try {
				paymentMethod = await stripe.paymentMethods.create({
					type: 'card',
					card: {
						token: testCardTokens[cardNumber]
					}
				});
			} catch (tokenError) {
				log('Test token method failed, trying direct card creation with test data');
				// If token method fails, create with test-safe parameters
				paymentMethod = await stripe.paymentMethods.create({
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
			}
		} else {
			// For non-test cards or in production, create normally
			log('Creating payment method with provided card details');
			paymentMethod = await stripe.paymentMethods.create({
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
		}

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
				details: error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
