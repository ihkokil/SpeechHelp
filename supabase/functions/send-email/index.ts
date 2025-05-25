
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

		// Create the email content with better deliverability
		const emailSubject = subject || 'Welcome to SpeechHelp!';
		const emailBody = emailHtml || `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Welcome to SpeechHelp</title>
			</head>
			<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
				<table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
					<tr>
						<td style="text-align: center; padding-bottom: 30px;">
							<h1 style="color: #be185d; font-size: 24px; margin: 0; font-weight: bold;">SpeechHelp</h1>
							<p style="color: #666666; margin: 5px 0 0 0; font-size: 14px;">Your AI Speech Assistant</p>
						</td>
					</tr>
					<tr>
						<td style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
							<h2 style="color: #be185d; text-align: center; margin-top: 0; font-size: 28px;">${emailSubject}</h2>
							<p style="font-size: 16px; margin-bottom: 20px;">Hi ${username || 'there'},</p>
							<p style="font-size: 16px; margin-bottom: 20px;">${message || "Welcome to SpeechHelp! We're excited to have you on board."}</p>
							<p style="font-size: 16px; margin-bottom: 30px;">Thank you for joining SpeechHelp! Your journey to creating impactful, memorable speeches starts now.</p>
							
							<table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
								<tr>
									<td style="text-align: center;">
										<a href="https://speechhelp.ai/dashboard" 
										   style="background-color: #be185d; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
											Start Creating Speeches
										</a>
									</td>
								</tr>
							</table>
							
							<div style="background-color: #e8f4f8; padding: 20px; border-radius: 6px; margin: 25px 0;">
								<h3 style="color: #be185d; margin-top: 0; font-size: 18px;">What you can do:</h3>
								<ul style="margin: 0; padding-left: 20px;">
									<li style="margin-bottom: 8px;">Generate professional speeches in minutes</li>
									<li style="margin-bottom: 8px;">Customize with our intuitive editor</li>
									<li style="margin-bottom: 8px;">Save speeches in your personal library</li>
									<li style="margin-bottom: 8px;">Export in multiple formats</li>
								</ul>
							</div>
						</td>
					</tr>
					<tr>
						<td style="text-align: center; padding-top: 30px; color: #666666; font-size: 14px;">
							<p style="margin-bottom: 10px;">Need help? Contact us at <a href="mailto:hello@speechhelp.ai" style="color: #be185d; text-decoration: none;">hello@speechhelp.ai</a></p>
							<p style="margin: 0; font-size: 12px; color: #999999;">
								© 2024 SpeechHelp. All rights reserved.<br>
								If you didn't request this email, you can safely ignore it.
							</p>
						</td>
					</tr>
				</table>
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

			// Send email headers and body with proper formatting
			const emailHeaders = [
				`From: SpeechHelp <${SMTP_USER}>`,
				`To: ${email}`,
				`Subject: ${emailSubject}`,
				'MIME-Version: 1.0',
				'Content-Type: text/html; charset=UTF-8',
				'Content-Transfer-Encoding: 8bit',
				'X-Mailer: SpeechHelp-Mailer',
				'X-Priority: 3',
				'Message-ID: <' + Date.now() + '@speechhelp.ai>',
				''
			].join('\r\n');

			const fullMessage = emailHeaders + emailBody + '\r\n.';
			
			await conn.write(encoder.encode(fullMessage + '\r\n'));
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
