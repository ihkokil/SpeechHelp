
import Translate from '@/components/Translate';

const AgreementSection = () => {
  return (
    <section className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-purple-800">
        <Translate text="legal.termsOfService.agreement.title" fallback="Agreement to Terms" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        These Terms of Service ("Terms") constitute a legally binding agreement between you and Creativity Crisis, LLC, operating SpeechHelp ("we," "us," or "our"). By accessing or using our AI-powered speech generation service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our service.
      </p>
    </section>
  );
};

export default AgreementSection;
