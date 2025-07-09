
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import LegalPageHeader from '@/components/legal/shared/LegalPageHeader';
import IntroductionSection from '@/components/legal/privacy/IntroductionSection';
import InformationCollectionSection from '@/components/legal/privacy/InformationCollectionSection';
import InformationUsageSection from '@/components/legal/privacy/InformationUsageSection';
import ThirdPartySection from '@/components/legal/privacy/ThirdPartySection';
import SecuritySection from '@/components/legal/privacy/SecuritySection';
import UserRightsSection from '@/components/legal/privacy/UserRightsSection';
import ContactSection from '@/components/legal/shared/ContactSection';

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
          <LegalPageHeader
            title="Privacy Policy"
            titleKey="legal.privacyPolicy.title"
            gradientFrom="pink-600"
            gradientTo="purple-600"
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
            <IntroductionSection />
            <InformationCollectionSection />
            <InformationUsageSection />
            <ThirdPartySection />
            <SecuritySection />
            <UserRightsSection />
            <ContactSection sectionType="privacy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
