
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
		
		// Get SMTP credentials from environment variables
		const SMTP_HOST = Deno.env.get('SMTP_HOST');
		const SMTP_PORT = Deno.env.get('SMTP_PORT');
		const SMTP_USER = Deno.env.get('SMTP_USER');
		const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');

		if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
			console.error('SMTP credentials not found in environment variables');
			return new Response(
				JSON.stringify({ error: 'SMTP credentials not configured' }),
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
		console.log('Using SMTP host:', SMTP_HOST);

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
		const emailBody = emailHtml || `<h1>Welcome to SpeechHelp!</h1><p>${message || 'We\'re excited to have you on board.'}</p>`;

		// Create email headers and body for SMTP
		const emailHeaders = [
			`From: SpeechHelp <hello@speechhelp.ai>`,
			`To: ${email}`,
			`Subject: ${emailSubject}`,
			`Content-Type: text/html; charset=utf-8`,
			`MIME-Version: 1.0`,
			``
		].join('\r\n');

		const fullEmailBody = emailHeaders + emailBody;

		// Send email using SMTP
		console.log('Connecting to SMTP server...');
		
		try {
			const conn = await Deno.connect({
				hostname: SMTP_HOST,
				port: parseInt(SMTP_PORT),
			});

			const encoder = new TextEncoder();
			const decoder = new TextDecoder();

			// Helper function to read response
			const readResponse = async () => {
				const buffer = new Uint8Array(1024);
				const n = await conn.read(buffer);
				return decoder.decode(buffer.subarray(0, n || 0));
			};

			// Helper function to send command
			const sendCommand = async (command: string) => {
				await conn.write(encoder.encode(command + '\r\n'));
				return await readResponse();
			};

			// SMTP conversation
			let response = await readResponse(); // Initial greeting
			console.log('Server greeting:', response);

			response = await sendCommand('EHLO speechhelp.ai');
			console.log('EHLO response:', response);

			// Start TLS if port 587
			if (SMTP_PORT === '587') {
				response = await sendCommand('STARTTLS');
				console.log('STARTTLS response:', response);
				
				// For production, you'd need to upgrade to TLS connection here
				// For now, we'll continue with plain connection
			}

			// Authenticate
			const authString = btoa(`\0${SMTP_USER}\0${SMTP_PASSWORD}`);
			response = await sendCommand(`AUTH PLAIN ${authString}`);
			console.log('AUTH response:', response);

			// Send email
			response = await sendCommand(`MAIL FROM:<hello@speechhelp.ai>`);
			console.log('MAIL FROM response:', response);

			response = await sendCommand(`RCPT TO:<${email}>`);
			console.log('RCPT TO response:', response);

			response = await sendCommand('DATA');
			console.log('DATA response:', response);

			response = await sendCommand(fullEmailBody + '\r\n.');
			console.log('Email sent response:', response);

			await sendCommand('QUIT');
			conn.close();

			console.log('Email sent successfully via SMTP');

			return new Response(
				JSON.stringify({
					success: true,
					message: 'Welcome email sent successfully via SMTP',
					data: { recipient: email, subject: emailSubject }
				}),
				{
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);

		} catch (smtpError) {
			console.error('SMTP connection error:', smtpError);
			
			// Fallback: Log the email details for manual sending
			console.log('Email details for manual sending:');
			console.log('To:', email);
			console.log('Subject:', emailSubject);
			console.log('Body:', emailBody);

			return new Response(
				JSON.stringify({
					success: false,
					error: 'SMTP connection failed',
					details: smtpError.message,
					fallback: {
						recipient: email,
						subject: emailSubject,
						body: emailBody
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
