
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

const TermsOfService = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <Translate text="legal.termsOfService.title" fallback="Terms of Service" />
            </h1>
            <p className="text-gray-600">
              <Translate text="legal.lastUpdated" fallback="Last updated" />: December 11, 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-8">
            
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.agreement.title" fallback="Agreement to Terms" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Creativity Crisis, LLC, operating SpeechHelp ("we," "us," or "our"). By accessing or using our AI-powered speech generation service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.service.title" fallback="Description of Service" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SpeechHelp is an AI-powered platform that helps users create customized speeches for various occasions. Our service includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>AI-generated speech content based on user inputs</li>
                <li>Multiple speech types and customization options</li>
                <li>Speech editing and formatting tools</li>
                <li>Export capabilities (PDF, text formats)</li>
                <li>Account management and speech library</li>
                <li>Customer support and guidance resources</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.accounts.title" fallback="User Accounts and Registration" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features of our service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 13 years old to create an account. Users under 18 must have parental consent.
              </p>
            </section>

            {/* Subscription and Payment */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.payment.title" fallback="Subscription Plans and Payment" />
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Subscription Plans</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer various subscription plans with different features and usage limits. Plan details, pricing, and features are available on our pricing page and may be updated from time to time.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Payment Processing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Payments are processed securely through Stripe. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Pay all applicable fees and charges</li>
                <li>Provide valid payment information</li>
                <li>Authorize automatic recurring charges for subscription plans</li>
                <li>Pay any applicable taxes</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Cancellation and Refunds</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may cancel your subscription at any time through your account settings. Cancellations will take effect at the end of your current billing period. We do not provide refunds for partial billing periods except as required by law or at our sole discretion.
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.usage.title" fallback="Acceptable Use Policy" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use our service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Create content that is illegal, harmful, threatening, defamatory, or offensive</li>
                <li>Violate any intellectual property rights or privacy rights</li>
                <li>Transmit spam, malware, or other harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our service or servers</li>
                <li>Use our service for any commercial purpose without authorization</li>
                <li>Create content that promotes violence, discrimination, or hatred</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.ip.title" fallback="Intellectual Property Rights" />
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Our Property</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The SpeechHelp service, including its design, functionality, AI models, and original content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Your Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of the speeches you create using our service. However, you grant us a limited license to process, store, and display your content as necessary to provide our service. You represent that you have the right to create and use such content.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">AI-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Content generated by our AI is based on your inputs and our proprietary algorithms. While you may use the generated content, you acknowledge that AI-generated content may not be subject to copyright protection and should be reviewed for accuracy and appropriateness.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.disclaimers.title" fallback="Disclaimers and Limitations" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our service is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy or quality of AI-generated content</li>
                <li>Suitability for any particular purpose</li>
                <li>Security against all potential threats</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for reviewing and editing all generated content before use. We recommend having important speeches reviewed by qualified professionals.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.liability.title" fallback="Limitation of Liability" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our service.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our total liability for any claims shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.termination.title" fallback="Termination" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our service at any time, with or without cause or notice, including for violation of these Terms. Upon termination, your right to use our service will cease immediately.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.changes.title" fallback="Changes to Terms" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of significant changes by email or through our service. Your continued use of our service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Translate text="legal.termsOfService.contact.title" fallback="Contact Information" />
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
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

export default TermsOfService;
