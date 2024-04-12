
import * as React from 'react';
import { Section, Text, Hr } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailFooter = () => {
  return (
    <>
      <Hr style={styles.divider} />

      <Section style={styles.footerSection}>
        <Text style={styles.footerText}>
          Best regards,<br />
          The SpeechHelp Team
        </Text>
        
        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} SpeechHelp. All rights reserved.
        </Text>
      </Section>
    </>
  );
};
