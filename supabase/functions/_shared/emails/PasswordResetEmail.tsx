
import * as React from 'npm:react@18.3.1';

// Inline styles for the password reset email
const styles = {
  main: {
    backgroundColor: '#f6f9fc',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    padding: '50px 0'
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(20, 50, 70, 0.08)',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '40px 30px'
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  logo: {
    display: 'block',
    margin: '0 auto',
  },
  h1: {
    color: '#a94b9a',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 30px',
    textAlign: 'center' as const,
  },
  paragraph: {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '16px 0'
  },
  ctaSection: {
    margin: '40px 0',
    textAlign: 'center' as const
  },
  button: {
    backgroundColor: '#a94b9a',
    borderRadius: '8px',
    color: '#fff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '16px 32px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
  },
  link: {
    color: '#a94b9a',
    fontWeight: '500',
    textDecoration: 'none',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #eaeaea',
    margin: '30px 0'
  },
  securityNote: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    color: '#92400e',
    fontSize: '14px',
    margin: '20px 0',
    padding: '16px',
  },
  footerSection: {
    textAlign: 'center' as const,
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #eaeaea',
  },
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '12px 0',
  },
  footerCopyright: {
    color: '#9ca3af',
    fontSize: '12px',
    marginTop: '20px',
    marginBottom: '8px',
  }
};

interface PasswordResetEmailProps {
  resetUrl: string;
  userEmail?: string;
}

const PasswordResetEmail = ({ resetUrl, userEmail }: PasswordResetEmailProps) => {
  return (
    <html>
      <body style={styles.main}>
        <div style={styles.container}>
          {/* Header with Logo */}
          <div style={styles.logoSection}>
            <img
              src="https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/assets/Speech%20Help%20-%20Logo-New.png"
              width="150"
              height="44"
              alt="SpeechHelp"
              style={styles.logo}
            />
          </div>

          {/* Main Content */}
          <div>
            <h1 style={styles.h1}>Reset Your Password</h1>
            
            <p style={styles.paragraph}>
              We received a request to reset the password for your SpeechHelp account{userEmail ? ` (${userEmail})` : ''}.
            </p>

            <p style={styles.paragraph}>
              Click the button below to create a new password. This link will expire in 24 hours for security reasons.
            </p>

            {/* CTA Button */}
            <div style={styles.ctaSection}>
              <a href={resetUrl} style={styles.button}>
                Reset Your Password
              </a>
            </div>

            <p style={styles.paragraph}>
              If the button above doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style={styles.paragraph}>
              <a href={resetUrl} style={styles.link}>
                {resetUrl}
              </a>
            </p>

            <hr style={styles.divider} />

            <div style={styles.securityNote}>
              <strong>Security Note:</strong> If you didn't request this password reset, you can safely ignore this email. 
              Your password will remain unchanged.
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footerSection}>
            <p style={styles.footerText}>
              Need help? Contact our support team at{' '}
              <a href="mailto:hello@speechhelp.ai" style={styles.link}>
                hello@speechhelp.ai
              </a>
            </p>
            
            <p style={styles.footerCopyright}>
              © 2024 SpeechHelp. All rights reserved.
            </p>
            
            <p style={styles.footerText}>
              SpeechHelp, Inc. | Your AI Speech Assistant
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default PasswordResetEmail;
