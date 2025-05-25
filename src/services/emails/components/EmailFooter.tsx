
import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailFooter = () => {
	return (
		<>
			<Hr style={styles.divider} />
			<Section style={styles.footerSection}>
				<Text style={styles.footerText}>
					If you have any questions or need help getting started, don't hesitate to reach out to us at{' '}
					<Link href="mailto:hello@speechhelp.ai" style={styles.link}>
						hello@speechhelp.ai
					</Link>
				</Text>
				
				<Text style={styles.footerCopyright}>
					© 2024 SpeechHelp. All rights reserved.
				</Text>
				
				<Text style={styles.footerText}>
					SpeechHelp, Inc. | Your AI Speech Assistant
				</Text>
			</Section>
		</>
	);
};
