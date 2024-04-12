
import * as React from 'react';
import { Section, Text, Hr, Link } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailFooter = () => {
  return (
    <>
      <Hr style={styles.divider} />

      <Section style={styles.footerSection}>
        <Text style={styles.footerText}>
          We're excited to be part of your public speaking journey!<br />
          The SpeechHelp Team
        </Text>
        
        <Section style={styles.socialLinks}>
          <Link href="https://twitter.com/speechhelpai" style={styles.socialLink}>Twitter</Link>
          <Link href="https://facebook.com/speechhelpai" style={styles.socialLink}>Facebook</Link>
          <Link href="https://instagram.com/speechhelpai" style={styles.socialLink}>Instagram</Link>
        </Section>
        
        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} SpeechHelp. All rights reserved.
        </Text>
      </Section>
    </>
  );
};
