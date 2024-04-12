
import * as React from 'react';
import { Section, Link } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

interface EmailCTAProps {
  url?: string;
}

export const EmailCTA = ({ url = "https://speechhelp.ai/dashboard" }: EmailCTAProps) => {
  return (
    <Section style={styles.ctaSection}>
      <Link style={styles.button} href={url}>
        Get Started Now
      </Link>
    </Section>
  );
};
