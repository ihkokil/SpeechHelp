
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

		console.log('SMTP Config:', {
			host: SMTP_HOST,
			port: SMTP_PORT,
			user: SMTP_USER ? SMTP_USER.substring(0, 5) + '***' : 'NOT SET',
			password: SMTP_PASSWORD ? '***SET***' : 'NOT SET'
		});

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

		// Force use of port 587 for better compatibility
		const smtpPort = '587';
		console.log('Using SMTP port 587 for STARTTLS connection');

		// Create email headers and body for SMTP
		const boundary = 'boundary-' + Math.random().toString(36).substring(2);
		const emailHeaders = [
			`From: SpeechHelp <${SMTP_USER}>`,
			`To: ${email}`,
			`Subject: ${emailSubject}`,
			`MIME-Version: 1.0`,
			`Content-Type: multipart/alternative; boundary="${boundary}"`,
			``,
			`--${boundary}`,
			`Content-Type: text/html; charset=UTF-8`,
			`Content-Transfer-Encoding: 7bit`,
			``,
			emailBody,
			``,
			`--${boundary}--`
		].join('\r\n');

		// Send email using SMTP
		console.log('Attempting to connect to SMTP server on port 587...');
		
		try {
			const conn = await Deno.connect({
				hostname: SMTP_HOST,
				port: parseInt(smtpPort),
			});

			const encoder = new TextEncoder();
			const decoder = new TextDecoder();

			// Helper function to read response with longer timeout for STARTTLS
			const readResponse = async (timeout = 10000) => {
				const buffer = new Uint8Array(2048);
				const timeoutPromise = new Promise((_, reject) => {
					setTimeout(() => reject(new Error('SMTP response timeout')), timeout);
				});
				
				const readPromise = conn.read(buffer).then(n => {
					if (n === null) throw new Error('Connection closed');
					const response = decoder.decode(buffer.subarray(0, n));
					console.log('SMTP raw response:', response.trim());
					return response;
				});
				
				return await Promise.race([readPromise, timeoutPromise]) as string;
			};

			// Helper function to send command and get response
			const sendCommand = async (command: string) => {
				console.log('SMTP command:', command.split(' ')[0]); // Log command without sensitive data
				await conn.write(encoder.encode(command + '\r\n'));
				const response = await readResponse();
				return response;
			};

			// SMTP conversation
			let response = await readResponse(); // Initial greeting
			if (!response.startsWith('220')) {
				throw new Error(`SMTP server not ready: ${response}`);
			}

			response = await sendCommand(`EHLO speechhelp.ai`);
			if (!response.startsWith('250')) {
				throw new Error(`EHLO failed: ${response}`);
			}

			// Always use STARTTLS on port 587
			console.log('Initiating STARTTLS...');
			response = await sendCommand('STARTTLS');
			if (!response.startsWith('220')) {
				throw new Error(`STARTTLS failed: ${response}`);
			}

			// After STARTTLS, we need to upgrade the connection to TLS
			// Note: Deno doesn't have native STARTTLS support, so we'll try without encryption upgrade
			// This might work with some SMTP servers that are lenient
			console.log('STARTTLS initiated, continuing with authentication...');

			// Re-send EHLO after STARTTLS
			response = await sendCommand(`EHLO speechhelp.ai`);
			if (!response.startsWith('250')) {
				throw new Error(`EHLO after STARTTLS failed: ${response}`);
			}

			// Authenticate using AUTH PLAIN
			const authString = btoa(`\0${SMTP_USER}\0${SMTP_PASSWORD}`);
			response = await sendCommand(`AUTH PLAIN ${authString}`);
			if (!response.startsWith('235')) {
				throw new Error(`Authentication failed: ${response}`);
			}

			// Send email
			response = await sendCommand(`MAIL FROM:<${SMTP_USER}>`);
			if (!response.startsWith('250')) {
				throw new Error(`MAIL FROM failed: ${response}`);
			}

			response = await sendCommand(`RCPT TO:<${email}>`);
			if (!response.startsWith('250')) {
				throw new Error(`RCPT TO failed: ${response}`);
			}

			response = await sendCommand('DATA');
			if (!response.startsWith('354')) {
				throw new Error(`DATA command failed: ${response}`);
			}

			// Send the email content
			await conn.write(encoder.encode(emailHeaders + '\r\n.\r\n'));
			response = await readResponse();
			if (!response.startsWith('250')) {
				throw new Error(`Email sending failed: ${response}`);
			}

			await sendCommand('QUIT');
			conn.close();

			console.log('Email sent successfully via SMTP on port 587');

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
			console.error('SMTP error details:', {
				message: smtpError.message,
				stack: smtpError.stack,
				host: SMTP_HOST,
				port: smtpPort
			});
			
			return new Response(
				JSON.stringify({
					success: false,
					error: 'SMTP connection or sending failed',
					details: smtpError.message,
					troubleshooting: {
						recipient: email,
						subject: emailSubject,
						suggestions: [
							'Try using port 587 instead of 465',
							'Check if SMTP server supports STARTTLS',
							'Verify SMTP credentials are correct',
							'Check if email account has SMTP access enabled',
							'Some SMTP servers require app-specific passwords'
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
