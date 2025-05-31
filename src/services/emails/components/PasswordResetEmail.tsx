
import * as React from 'react';
import { Html, Body, Container, Head, Heading, Hr, Img, Link, Preview, Section, Text } from '@react-email/components';
import * as styles from '../styles/password-reset-styles';

interface PasswordResetEmailProps {
  resetUrl: string;
  userEmail?: string;
}

export const PasswordResetEmail = ({ resetUrl, userEmail }: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your SpeechHelp password</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header with Logo */}
          <Section style={styles.logoSection}>
            <Img
              src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg"
              width="150"
              height="44"
              alt="SpeechHelp"
              style={styles.logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.contentSection}>
            <Heading style={styles.h1}>Reset Your Password</Heading>
            
            <Text style={styles.paragraph}>
              We received a request to reset the password for your SpeechHelp account{userEmail ? ` (${userEmail})` : ''}.
            </Text>

            <Text style={styles.paragraph}>
              Click the button below to create a new password. This link will expire in 24 hours for security reasons.
            </Text>

            {/* CTA Button */}
            <Section style={styles.ctaSection}>
              <Link href={resetUrl} style={styles.button}>
                Reset Your Password
              </Link>
            </Section>

            <Text style={styles.paragraph}>
              If the button above doesn't work, copy and paste this link into your browser:
            </Text>
            
            <Text style={styles.linkText}>
              <Link href={resetUrl} style={styles.link}>
                {resetUrl}
              </Link>
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.securityNote}>
              <strong>Security Note:</strong> If you didn't request this password reset, you can safely ignore this email. 
              Your password will remain unchanged.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footerSection}>
            <Text style={styles.footerText}>
              Need help? Contact our support team at{' '}
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
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;
