
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequestBody {
	email: string;
	username?: string;
	subject?: string;
	message?: string;
	emailHtml?: string;
}

serve(async (req) => {
	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		console.log('Send email function called');
		
		// Get the API key from environment variable
		const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

		if (!RESEND_API_KEY) {
			console.error('RESEND_API_KEY not found in environment variables');
			return new Response(
				JSON.stringify({ error: 'Resend API key not configured' }),
				{
					status: 500,
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);
		}

		// Parse request body
		const { email, username, subject, message, emailHtml } = await req.json() as EmailRequestBody;
		console.log('Email request for:', email);

		if (!email) {
			return new Response(
				JSON.stringify({ error: 'Email address is required' }),
				{
					status: 400,
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);
		}

		console.log('Sending email via Resend API');
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: 'SpeechHelp <hello@speechhelp.ai>',
				to: [email],
				cc: ['hello@speechhelp.ai'],  // Adding CC to hello@speechhelp.ai
				subject: subject || 'Welcome to SpeechHelp!',
				html: emailHtml || `<h1>Welcome to SpeechHelp!</h1><p>${message || 'We\'re excited to have you on board.'}</p>`,
				// Optional text version as fallback
				text: message || `Welcome to SpeechHelp! We're excited to have you on board.`
			}),
		});

		const responseData = await res.json();
		console.log('Resend API response:', responseData);

		if (!res.ok) {
			console.error('Resend API error:', responseData);
			return new Response(
				JSON.stringify({ error: 'Failed to send email', details: responseData }),
				{
					status: 500,
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Welcome email sent successfully',
				data: responseData
			}),
			{
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);

	} catch (error) {
		console.error('Error sending email:', error);

		return new Response(
			JSON.stringify({
				error: error.message || 'Failed to send email',
				details: error.toString()
			}),
			{
				status: 500,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);
	}
});
