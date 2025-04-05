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
	Text
} from '@react-email/components';

interface WelcomeEmailProps {
	username?: string;
}

export const WelcomeEmail = ({ username = 'there' }: WelcomeEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Welcome to SpeechHelp - Your AI Speech Assistant</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>Welcome to SpeechHelp!</Heading>

					<Text style={paragraph}>Hi {username},</Text>

					<Text style={paragraph}>
						Thank you for joining SpeechHelp! We're excited to help you create amazing speeches using our AI-powered platform.
					</Text>

					<Section style={ctaSection}>
						<Link style={button} href="https://speechhelp.ai/dashboard">
							Get Started Now
						</Link>
					</Section>

					<Text style={paragraph}>
						With SpeechHelp, you can:
					</Text>

					<ul style={list}>
						<li style={listItem}>Generate professional speeches for any occasion</li>
						<li style={listItem}>Customize your speech with detailed preferences</li>
						<li style={listItem}>Save and organize your speeches</li>
						<li style={listItem}>Get AI-powered feedback and improvements</li>
					</ul>

					<Text style={paragraph}>
						If you have any questions or need assistance, please don't hesitate to contact our support team.
					</Text>

					<Text style={paragraph}>
						Best regards,<br />
						The SpeechHelp Team
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

export default WelcomeEmail;

const main = {
	backgroundColor: '#f6f9fc',
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
	padding: '50px 0'
};

const container = {
	backgroundColor: '#ffffff',
	border: '1px solid #eee',
	borderRadius: '5px',
	boxShadow: '0 5px 10px rgba(20, 50, 70, 0.1)',
	marginLeft: 'auto',
	marginRight: 'auto',
	maxWidth: '600px',
	padding: '20px'
};

const h1 = {
	color: '#1d4ed8',
	fontSize: '24px',
	fontWeight: 'bold',
	margin: '30px 0',
	padding: '0',
	textAlign: 'center' as const
};

const paragraph = {
	color: '#4b5563',
	fontSize: '16px',
	lineHeight: '1.5',
	margin: '16px 0'
};

const ctaSection = {
	margin: '32px 0',
	textAlign: 'center' as const
};

const button = {
	backgroundColor: '#1d4ed8',
	borderRadius: '5px',
	color: '#fff',
	display: 'inline-block',
	fontSize: '16px',
	fontWeight: 'bold',
	padding: '12px 24px',
	textDecoration: 'none'
};

const list = {
	margin: '16px 0'
};

const listItem = {
	color: '#4b5563',
	fontSize: '16px',
	lineHeight: '1.5',
	margin: '8px 0'
}; 