
import * as React from 'react';
import { Img, Section } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

interface EmailHeaderProps {
	username?: string;
}

export const EmailHeader = ({ username = 'there' }: EmailHeaderProps) => {
	return (
		<Section style={styles.logoSection}>
			<Img
				src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg"
				width="150"
				height="44"
				alt="SpeechHelp"
				style={styles.logo}
			/>
			<h1 style={styles.h1}>Welcome to SpeechHelp, {username}!</h1>
			<p style={styles.tagline}>
				Your personal AI speech assistant is ready to help you create amazing speeches.
			</p>
		</Section>
	);
};
