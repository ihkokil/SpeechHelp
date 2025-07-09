
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import LegalPageHeader from '@/components/legal/shared/LegalPageHeader';
import CookieIntroSection from '@/components/legal/cookies/CookieIntroSection';
import CookieTypesSection from '@/components/legal/cookies/CookieTypesSection';
import ThirdPartyCookiesSection from '@/components/legal/cookies/ThirdPartyCookiesSection';
import CookieUsageSection from '@/components/legal/cookies/CookieUsageSection';
import CookieManagementSection from '@/components/legal/cookies/CookieManagementSection';
import ContactSection from '@/components/legal/shared/ContactSection';

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
          <LegalPageHeader
            title="Cookie Policy"
            titleKey="legal.cookiePolicy.title"
            gradientFrom="blue-600"
            gradientTo="green-600"
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
            <CookieIntroSection />
            <CookieTypesSection />
            <ThirdPartyCookiesSection />
            <CookieUsageSection />
            <CookieManagementSection />

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

            <ContactSection sectionType="cookies" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
