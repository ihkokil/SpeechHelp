
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
		const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.ionos.com';
		const SMTP_PORT = Deno.env.get('SMTP_PORT') || '465';
		const SMTP_USER = Deno.env.get('SMTP_USER');
		const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');

		console.log('SMTP Config:', {
			host: SMTP_HOST,
			port: SMTP_PORT,
			user: SMTP_USER ? `${SMTP_USER.substring(0, 5)}***` : 'NOT SET',
			password: SMTP_PASSWORD ? '***SET***' : 'NOT SET'
		});

		if (!SMTP_USER || !SMTP_PASSWORD) {
			console.error('SMTP credentials not found in environment variables');
			return new Response(
				JSON.stringify({ error: 'Email service not configured. Please set up SMTP credentials.' }),
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

		// Send email using raw SMTP with SSL (port 465)
		console.log('Attempting to send email via SMTP...');
		
		try {
			const conn = await Deno.connectTls({
				hostname: SMTP_HOST,
				port: parseInt(SMTP_PORT)
			});

			const encoder = new TextEncoder();
			const decoder = new TextDecoder();

			// Helper function to read SMTP response
			const readResponse = async () => {
				const buffer = new Uint8Array(4096);
				const bytesRead = await conn.read(buffer);
				if (bytesRead === null) return '';
				return decoder.decode(buffer.subarray(0, bytesRead));
			};

			// Helper function to send SMTP command
			const sendCommand = async (command: string) => {
				console.log(`Sending: ${command.replace(/AUTH PLAIN .+/, 'AUTH PLAIN [HIDDEN]')}`);
				await conn.write(encoder.encode(command + '\r\n'));
				const response = await readResponse();
				console.log(`Response: ${response.trim()}`);
				return response;
			};

			// Read server greeting
			const greeting = await readResponse();
			console.log('Server greeting:', greeting.trim());

			// Send EHLO
			await sendCommand(`EHLO ${SMTP_HOST}`);

			// Authenticate using AUTH PLAIN
			const authString = btoa(`\0${SMTP_USER}\0${SMTP_PASSWORD}`);
			await sendCommand(`AUTH PLAIN ${authString}`);

			// Send MAIL FROM
			await sendCommand(`MAIL FROM:<${SMTP_USER}>`);

			// Send RCPT TO
			await sendCommand(`RCPT TO:<${email}>`);

			// Send DATA
			await sendCommand('DATA');

			// Send email headers and body
			const emailMessage = [
				`From: SpeechHelp <${SMTP_USER}>`,
				`To: ${email}`,
				`Subject: ${emailSubject}`,
				'MIME-Version: 1.0',
				'Content-Type: text/html; charset=UTF-8',
				'',
				emailBody,
				'.'
			].join('\r\n');

			await conn.write(encoder.encode(emailMessage + '\r\n'));
			const dataResponse = await readResponse();
			console.log('DATA response:', dataResponse.trim());

			// Send QUIT
			await sendCommand('QUIT');

			conn.close();

			console.log('Email sent successfully via SMTP');

			return new Response(
				JSON.stringify({
					success: true,
					message: 'Welcome email sent successfully via SMTP',
					data: { 
						recipient: email, 
						subject: emailSubject
					}
				}),
				{
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);

		} catch (smtpError: any) {
			console.error('SMTP error details:', {
				message: smtpError.message,
				stack: smtpError.stack,
				host: SMTP_HOST,
				port: SMTP_PORT
			});
			
			return new Response(
				JSON.stringify({
					success: false,
					error: 'SMTP email sending failed',
					details: smtpError.message,
					troubleshooting: {
						recipient: email,
						subject: emailSubject,
						suggestions: [
							'Verify SMTP credentials are correct',
							'Check if SMTP server allows connections from this IP',
							'Try using port 465 with SSL or port 587 with STARTTLS',
							'Check if your hosting provider has SMTP enabled',
							'Verify the sender email domain is properly configured'
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

	} catch (error: any) {
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
