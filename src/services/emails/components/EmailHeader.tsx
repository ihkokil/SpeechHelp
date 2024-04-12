
import * as React from 'react';
import { Img, Heading, Section } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailHeader = () => {
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
        <Heading style={styles.h1}>Welcome to SpeechHelp!</Heading>
      </Section>
    </>
  );
};
