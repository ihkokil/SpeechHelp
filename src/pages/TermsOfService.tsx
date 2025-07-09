
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import LegalPageHeader from '@/components/legal/shared/LegalPageHeader';
import AgreementSection from '@/components/legal/terms/AgreementSection';
import ServiceDescriptionSection from '@/components/legal/terms/ServiceDescriptionSection';
import UserAccountsSection from '@/components/legal/terms/UserAccountsSection';
import PaymentSection from '@/components/legal/terms/PaymentSection';
import AcceptableUseSection from '@/components/legal/terms/AcceptableUseSection';
import IntellectualPropertySection from '@/components/legal/terms/IntellectualPropertySection';
import ContactSection from '@/components/legal/shared/ContactSection';

const TermsOfService = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <LegalPageHeader
            title="Terms of Service"
            titleKey="legal.termsOfService.title"
            gradientFrom="purple-600"
            gradientTo="blue-600"
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
            <AgreementSection />
            <ServiceDescriptionSection />
            <UserAccountsSection />
            <PaymentSection />
            <AcceptableUseSection />
            <IntellectualPropertySection />

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

            <ContactSection sectionType="terms" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
