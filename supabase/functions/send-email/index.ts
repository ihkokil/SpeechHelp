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
		// Get the API key from environment variable
		const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

		if (!RESEND_API_KEY) {
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

		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: 'SpeechHelp <speechhelper@strukt.io>',
				to: email,
				subject: subject || 'Welcome to SpeechHelp!',
				html: emailHtml,
				// Optional text version as fallback
				text: message || `Welcome to SpeechHelp! We're excited to have you on board.`
			}),
		})
		if (!res.ok) {
			console.error(await res.json())
			return new Response(
				JSON.stringify({ error: 'Failed to send email' }),
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
				data: await res.json()
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