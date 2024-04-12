
import * as React from 'react';
import { Section, Link, Text } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

interface EmailCTAProps {
  url?: string;
}

export const EmailCTA = ({ url = "https://speechhelp.ai/dashboard" }: EmailCTAProps) => {
  return (
    <Section style={styles.ctaSection}>
      <Text style={styles.ctaText}>Ready to create your first amazing speech?</Text>
      <Link style={styles.button} href={url}>
        Start Creating Now
      </Link>
    </Section>
  );
};
