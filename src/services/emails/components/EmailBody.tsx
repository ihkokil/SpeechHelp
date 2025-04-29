
import * as React from 'react';
import { Text, Section, Link } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';
import { EmailCTA } from './EmailCTA';
import { EmailFeatures } from './EmailFeatures';

interface EmailBodyProps {
  username?: string;
}

export const EmailBody = ({ username = 'there' }: EmailBodyProps) => {
  return (
    <>
      <Text style={styles.paragraph}>Hi {username},</Text>

      <Text style={styles.paragraph}>
        Thank you for joining SpeechHelp! We're excited to help you create amazing speeches using our AI-powered platform.
      </Text>

      <EmailCTA />
      <EmailFeatures />

      <Section style={styles.supportSection}>
        <Text style={styles.paragraph}>
          If you have any questions or need assistance, please don't hesitate to contact our support team at <Link href="mailto:hello@speechhelp.ai" style={styles.link}>hello@speechhelp.ai</Link>.
        </Text>
      </Section>
    </>
  );
};
