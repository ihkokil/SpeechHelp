
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

const CookiePolicy = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <Translate text="legal.backToHome" fallback="Back to Home" />
            </Link>
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <Translate text="legal.cookiePolicy.title" fallback="Cookie Policy" />
              </h1>
              <p className="text-blue-100">
                <Translate text="legal.lastUpdated" fallback="Last updated" />: June 11, 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
            
            {/* Introduction */}
            <section className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-blue-800">
                <Translate text="legal.cookiePolicy.introduction.title" fallback="What Are Cookies" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Cookie Policy explains how SpeechHelp, operated by Creativity Crisis, LLC ("we," "us," or "our"), uses cookies and similar tracking technologies when you visit our website and use our AI speech generation service.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit a website. They help websites remember your preferences, improve your browsing experience, and provide analytics about how the site is used.
              </p>
            </section>

            {/* Types of Cookies */}
            <section className="border-l-4 border-green-500 pl-6 bg-green-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-green-800">
                <Translate text="legal.cookiePolicy.types.title" fallback="Types of Cookies We Use" />
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Essential Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies are necessary for our website to function properly and cannot be disabled. They include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Authentication tokens to keep you logged in</li>
                <li>Session identifiers for security purposes</li>
                <li>Language and accessibility preferences</li>
                <li>Security cookies to prevent fraud and abuse</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Functional Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies enable enhanced functionality and personalization:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>User interface preferences and settings</li>
                <li>Speech generation preferences and history</li>
                <li>Account settings and customization options</li>
                <li>Recent activity and saved drafts</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Analytics Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use analytics cookies to understand how our service is used and to improve our offerings:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Page views and user navigation patterns</li>
                <li>Feature usage and performance metrics</li>
                <li>Error tracking and debugging information</li>
                <li>A/B testing for service improvements</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Performance Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies help us optimize our service performance:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Loading times and response speeds</li>
                <li>Server performance monitoring</li>
                <li>Content delivery optimization</li>
                <li>Resource usage tracking</li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-purple-800">
                <Translate text="legal.cookiePolicy.thirdParty.title" fallback="Third-Party Cookies" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with trusted third-party services that may place cookies on your device:
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Supabase (Database and Authentication)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our backend infrastructure provider uses cookies for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>User authentication and session management</li>
                <li>Database connection optimization</li>
                <li>Security and fraud prevention</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Stripe (Payment Processing)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our payment processor uses cookies for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Secure payment processing</li>
                <li>Fraud detection and prevention</li>
                <li>Payment method preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">OpenAI (AI Processing)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When processing AI requests, certain technical cookies may be used for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>API request authentication</li>
                <li>Rate limiting and usage tracking</li>
                <li>Service optimization</li>
              </ul>
            </section>

            {/* How We Use Cookies */}
            <section className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-yellow-800">
                <Translate text="legal.cookiePolicy.usage.title" fallback="How We Use Cookie Information" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information collected through cookies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Provide and maintain our AI speech generation service</li>
                <li>Remember your preferences and settings</li>
                <li>Improve website performance and user experience</li>
                <li>Analyze usage patterns and service optimization</li>
                <li>Ensure security and prevent fraudulent activity</li>
                <li>Provide customer support and troubleshooting</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            {/* Cookie Management */}
            <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-red-800">
                <Translate text="legal.cookiePolicy.management.title" fallback="Managing Your Cookie Preferences" />
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Browser Settings</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Block all cookies</li>
                <li>Allow only first-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Browser-Specific Instructions</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data<br />
                    <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data<br />
                    <strong>Safari:</strong> Preferences → Privacy → Cookies and website data<br />
                    <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Impact of Disabling Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please note that disabling certain cookies may affect your experience with our service:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>You may need to log in repeatedly</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some features may not function properly</li>
                <li>Performance and user experience may be reduced</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.cookiePolicy.retention.title" fallback="Cookie Retention and Expiration" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Authentication cookies:</strong> Typically expire after 30 days of inactivity</li>
                <li><strong>Preference cookies:</strong> May persist for up to 1 year</li>
                <li><strong>Analytics cookies:</strong> Usually expire after 2 years</li>
              </ul>
            </section>

            {/* Updates to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.cookiePolicy.updates.title" fallback="Updates to This Cookie Policy" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Posting the updated policy on our website</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
                <li>Displaying prominent notices on our service</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.cookiePolicy.contact.title" fallback="Contact Us About Cookies" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or concerns about our use of cookies, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> hello@speechhelp.ai<br />
                  <strong>Subject:</strong> Cookie Policy Inquiry<br />
                  <strong>Service:</strong> SpeechHelp - AI Speech Assistant<br />
                  <strong>Entity:</strong> Creativity Crisis, LLC
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
