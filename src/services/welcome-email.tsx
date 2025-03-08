
import * as React from 'react';
import {
	Body,
	Container,
	Head,
	Html,
	Preview,
} from '@react-email/components';
import { EmailHeader } from './emails/components/EmailHeader';
import { EmailBody } from './emails/components/EmailBody';
import { EmailFooter } from './emails/components/EmailFooter';
import * as styles from './emails/styles/welcome-email-styles';

interface WelcomeEmailProps {
	username?: string;
}

export const WelcomeEmail = ({ username = 'there' }: WelcomeEmailProps) => {
	return (
		<Html>
			<Head>
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=SF+Pro+Display:wght@400;500;600;700&display=swap" />
			</Head>
			<Preview>Welcome to SpeechHelp - Your Personal AI Speech Assistant</Preview>
			<Body style={styles.main}>
				<Container style={styles.container}>
					<EmailHeader username={username} />
					<EmailBody username={username} />
					<EmailFooter />
				</Container>
			</Body>
		</Html>
	);
};

export default WelcomeEmail;
