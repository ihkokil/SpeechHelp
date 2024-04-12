
import * as React from 'react';
import { Section, Text } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailFeatures = () => {
  return (
    <Section style={styles.featuresSection}>
      <Text style={styles.subheading}>
        With SpeechHelp, you can:
      </Text>

      <ul style={styles.list}>
        <li style={styles.listItem}>Generate professional speeches for any occasion</li>
        <li style={styles.listItem}>Customize your speech with detailed preferences</li>
        <li style={styles.listItem}>Save and organize your speeches</li>
        <li style={styles.listItem}>Get AI-powered feedback and improvements</li>
      </ul>
    </Section>
  );
};
