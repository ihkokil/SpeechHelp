
import * as React from 'react';
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	Hr,
	Row,
	Column
} from '@react-email/components';

interface WelcomeEmailProps {
	username?: string;
}

export const WelcomeEmail = ({ username = 'there' }: WelcomeEmailProps) => {
	return (
		<Html>
			<Head>
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=SF+Pro+Display:wght@400;500;600;700&display=swap" />
			</Head>
			<Preview>Welcome to SpeechHelp - Your AI Speech Assistant</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={logoSection}>
						<Img
							src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/emails/speech-help-new-logo.svg"
							width="180"
							height="65"
							alt="SpeechHelp Logo"
							style={logo}
						/>
					</Section>
					
					<Section style={headerSection}>
						<Heading style={h1}>Welcome to SpeechHelp!</Heading>
					</Section>

					<Text style={paragraph}>Hi {username},</Text>

					<Text style={paragraph}>
						Thank you for joining SpeechHelp! We're excited to help you create amazing speeches using our AI-powered platform.
					</Text>

					<Section style={ctaSection}>
						<Link style={button} href="https://speechhelp.ai/dashboard">
							Get Started Now
						</Link>
					</Section>

					<Section style={featuresSection}>
						<Text style={subheading}>
							With SpeechHelp, you can:
						</Text>

						<ul style={list}>
							<li style={listItem}>Generate professional speeches for any occasion</li>
							<li style={listItem}>Customize your speech with detailed preferences</li>
							<li style={listItem}>Save and organize your speeches</li>
							<li style={listItem}>Get AI-powered feedback and improvements</li>
						</ul>
					</Section>

					<Section style={supportSection}>
						<Text style={paragraph}>
							If you have any questions or need assistance, please don't hesitate to contact our support team at <Link href="mailto:hello@speechhelp.ai" style={link}>hello@speechhelp.ai</Link>.
						</Text>
					</Section>

					<Hr style={divider} />

					<Section style={footerSection}>
						<Text style={footerText}>
							Best regards,<br />
							The SpeechHelp Team
						</Text>
						
						<Text style={footerCopyright}>
							© {new Date().getFullYear()} SpeechHelp. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default WelcomeEmail;

const main = {
	backgroundColor: '#f6f9fc',
	fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
	padding: '50px 0'
};

const container = {
	backgroundColor: '#ffffff',
	border: '1px solid #eee',
	borderRadius: '10px',
	boxShadow: '0 5px 15px rgba(20, 50, 70, 0.08)',
	margin: '0 auto',
	maxWidth: '600px',
	padding: '30px'
};

const logoSection = {
	textAlign: 'center' as const,
	marginBottom: '20px',
};

const logo = {
	display: 'block',
	margin: '0 auto',
};

const headerSection = {
	textAlign: 'center' as const,
	marginBottom: '30px',
};

const h1 = {
	color: '#a94b9a', // Brand purple/pink
	fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	fontSize: '28px',
	fontWeight: 'bold',
	margin: '30px 0 15px',
	padding: '0',
	textAlign: 'center' as const,
};

const paragraph = {
	color: '#4b5563',
	fontSize: '16px',
	lineHeight: '1.6',
	margin: '16px 0'
};

const subheading = {
	color: '#a94b9a', // Brand purple/pink
	fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	fontSize: '20px',
	fontWeight: '600',
	margin: '25px 0 15px',
};

const ctaSection = {
	margin: '35px 0',
	textAlign: 'center' as const
};

const button = {
	backgroundColor: '#a94b9a', // Brand purple/pink
	borderRadius: '8px',
	color: '#fff',
	display: 'inline-block',
	fontSize: '16px',
	fontWeight: 'bold',
	padding: '14px 28px',
	textDecoration: 'none',
	textTransform: 'uppercase' as const, // Fix: Use 'as const' to specify the correct type
	transition: 'background-color 0.3s ease'
};

const featuresSection = {
	backgroundColor: '#f9f5fc', // Light purple/pink background
	borderRadius: '8px',
	padding: '20px 25px',
	marginTop: '30px',
	marginBottom: '30px',
};

const list = {
	margin: '16px 0',
	padding: '0 0 0 24px',
};

const listItem = {
	color: '#4b5563',
	fontSize: '16px',
	lineHeight: '1.6',
	margin: '10px 0'
};

const supportSection = {
	margin: '25px 0',
};

const link = {
	color: '#a94b9a', // Brand purple/pink
	fontWeight: '500',
	textDecoration: 'none',
};

const divider = {
	border: 'none',
	borderTop: '1px solid #eaeaea',
	margin: '30px 0'
};

const footerSection = {
	textAlign: 'center' as const,
	marginTop: '20px',
};

const footerText = {
	color: '#4b5563',
	fontSize: '16px',
	lineHeight: '1.5',
	margin: '20px 0',
};

const footerCopyright = {
	color: '#9ca3af',
	fontSize: '14px',
	marginTop: '28px',
};
