
import * as React from 'react';
import { Img, Heading, Section, Text } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

interface EmailHeaderProps {
  username?: string;
}

export const EmailHeader = ({ username }: EmailHeaderProps) => {
  return (
    <>
      <Section style={styles.logoSection}>
        <Img
          src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/emails/speech-help-new-logo.svg"
          width="180"
          height="65"
          alt="SpeechHelp Logo"
          style={styles.logo}
        />
      </Section>
      
      <Section style={styles.headerSection}>
        <Heading style={styles.h1}>Welcome to SpeechHelp{username ? `, ${username}` : ''}!</Heading>
        <Text style={styles.tagline}>Your personal AI speech assistant</Text>
      </Section>
    </>
  );
};
