
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
		
		// Get Resend API key from environment variables
		const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

		console.log('Resend API Key:', RESEND_API_KEY ? 'SET' : 'NOT SET');

		if (!RESEND_API_KEY) {
			console.error('Resend API key not found in environment variables');
			return new Response(
				JSON.stringify({ error: 'Email service not configured. Please set up Resend API key.' }),
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

		// Create the email content
		const emailSubject = subject || 'Welcome to SpeechHelp!';
		const emailBody = emailHtml || `
			<html>
			<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<img src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/assets/Speech%20Help%20-%20Logo-New.png" 
						 width="150" height="44" alt="SpeechHelp" style="display: block; margin: 0 auto;">
				</div>
				<h1 style="color: #be185d; text-align: center;">${emailSubject}</h1>
				<p>Hi ${username || 'there'},</p>
				<p>${message || "Welcome to SpeechHelp! We're excited to have you on board."}</p>
				<p>Thank you for joining SpeechHelp! Your journey to creating impactful, memorable speeches starts now.</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="https://speechhelp.ai/dashboard" 
					   style="background-color: #be185d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
						Start Creating Speeches
					</a>
				</div>
				<p style="color: #666; font-size: 14px; text-align: center;">
					If you have any questions, contact us at hello@speechhelp.ai
				</p>
			</body>
			</html>
		`;

		// Send email using Resend API
		console.log('Sending email via Resend API...');
		
		try {
			const emailPayload = {
				from: 'SpeechHelp <hello@speechhelp.ai>',
				to: [email],
				subject: emailSubject,
				html: emailBody
			};

			console.log('Email payload:', {
				from: emailPayload.from,
				to: emailPayload.to,
				subject: emailPayload.subject
			});

			const resendResponse = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${RESEND_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailPayload),
			});

			const resendData = await resendResponse.json();
			console.log('Resend API response:', resendData);

			if (!resendResponse.ok) {
				console.error('Resend API error:', resendData);
				throw new Error(`Resend API error: ${resendData.message || 'Unknown error'}`);
			}

			console.log('Email sent successfully via Resend');

			return new Response(
				JSON.stringify({
					success: true,
					message: 'Welcome email sent successfully via Resend',
					data: { 
						recipient: email, 
						subject: emailSubject,
						messageId: resendData.id 
					}
				}),
				{
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);

		} catch (emailError) {
			console.error('Email sending error:', {
				message: emailError.message,
				stack: emailError.stack
			});
			
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Email sending failed',
					details: emailError.message,
					troubleshooting: {
						recipient: email,
						subject: emailSubject,
						suggestions: [
							'Check if Resend API key is valid',
							'Verify the sender domain is configured in Resend',
							'Check if the recipient email is valid',
							'Make sure you have added your domain to Resend',
							'Check Resend dashboard for any delivery issues'
						]
					}
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

	} catch (error) {
		console.error('General error in send-email function:', {
			message: error.message,
			stack: error.stack
		});

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
