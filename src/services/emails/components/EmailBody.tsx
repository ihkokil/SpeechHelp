
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
        Thank you for joining SpeechHelp! We're thrilled to welcome you to our community of public speaking enthusiasts. 
        Your journey to creating impactful, memorable speeches starts now.
      </Text>

      <Text style={styles.paragraph}>
        With your new account, you can immediately start crafting speeches that will captivate your audience, 
        whether you're preparing for a wedding toast, a business presentation, or an inspirational keynote.
      </Text>

      <EmailCTA />
      <EmailFeatures />

      <Section style={styles.supportSection}>
        <Text style={styles.paragraph}>
          We're here to support your communication journey every step of the way. If you have any questions or need assistance, 
          please reach out to our friendly support team at <Link href="mailto:hello@speechhelp.ai" style={styles.link}>hello@speechhelp.ai</Link>.
        </Text>
      </Section>
    </>
  );
};
