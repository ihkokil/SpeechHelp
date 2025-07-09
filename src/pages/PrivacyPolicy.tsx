
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

const PrivacyPolicy = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
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
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <Translate text="legal.privacyPolicy.title" fallback="Privacy Policy" />
              </h1>
              <p className="text-pink-100">
                <Translate text="legal.lastUpdated" fallback="Last updated" />: June 11, 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
            
            {/* Introduction */}
            <section className="border-l-4 border-pink-500 pl-6 bg-pink-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-pink-800">
                <Translate text="legal.privacyPolicy.introduction.title" fallback="Introduction" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to SpeechHelp ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered speech generation service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access or use our service.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-purple-800">
                <Translate text="legal.privacyPolicy.collection.title" fallback="Information We Collect" />
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Register for an account</li>
                <li>Subscribe to our service</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                This information may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing information and payment details (processed securely through Stripe)</li>
                <li>Account credentials and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Speech Content and Usage Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you use our AI speech generation service, we may collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Speech content you create, edit, or save</li>
                <li>Speech type preferences and customization settings</li>
                <li>Usage patterns and service interactions</li>
                <li>Performance metrics and analytics data</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Technical Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain technical information, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>Website usage patterns and navigation data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-blue-800">
                <Translate text="legal.privacyPolicy.usage.title" fallback="How We Use Your Information" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Provide, operate, and maintain our AI speech generation service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Improve and personalize your user experience</li>
                <li>Communicate with you about your account and our services</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send administrative information and service updates</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* AI and Third-Party Services */}
            <section className="border-l-4 border-green-500 pl-6 bg-green-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-green-800">
                <Translate text="legal.privacyPolicy.thirdParty.title" fallback="AI Processing and Third-Party Services" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our speech generation service utilizes artificial intelligence technology provided by OpenAI. When you create speeches:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Your input data may be processed by OpenAI's API to generate speech content</li>
                <li>We implement appropriate safeguards to protect your data during AI processing</li>
                <li>Generated content is returned to you and may be stored in your account</li>
                <li>We do not share your personal speech content with third parties for marketing purposes</li>
              </ul>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                We also use Stripe for secure payment processing. Stripe maintains PCI DSS compliance and handles sensitive payment information according to industry standards.
              </p>
            </section>

            {/* Data Security */}
            <section className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-yellow-800">
                <Translate text="legal.privacyPolicy.security.title" fallback="Data Security" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data storage with Supabase</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="border-l-4 border-indigo-500 pl-6 bg-indigo-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-indigo-800">
                <Translate text="legal.privacyPolicy.rights.title" fallback="Your Rights and Choices" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information (subject to certain limitations)</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Data portability rights</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                To exercise these rights, please contact us at hello@speechhelp.ai.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-red-800">
                <Translate text="legal.privacyPolicy.contact.title" fallback="Contact Us" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email:</strong> hello@speechhelp.ai<br />
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

export default PrivacyPolicy;
