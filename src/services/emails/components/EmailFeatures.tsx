
import * as React from 'react';
import { Section, Text } from '@react-email/components';
import * as styles from '../styles/welcome-email-styles';

export const EmailFeatures = () => {
  return (
    <Section style={styles.featuresSection}>
      <Text style={styles.subheading}>
        What you can do with SpeechHelp:
      </Text>

      <ul style={styles.list}>
        <li style={styles.listItem}>Generate tailored, professional speeches in just minutes</li>
        <li style={styles.listItem}>Customize every aspect with our intuitive speech editor</li>
        <li style={styles.listItem}>Save and organize your speeches in your personal library</li>
        <li style={styles.listItem}>Receive AI-powered suggestions to enhance your delivery</li>
        <li style={styles.listItem}>Export your speeches in multiple formats for practice or presentation</li>
      </ul>

      <Text style={styles.paragraph}>
        Your free trial includes all premium features for the next 7 days. Explore everything SpeechHelp has to offer!
      </Text>
    </Section>
  );
};
