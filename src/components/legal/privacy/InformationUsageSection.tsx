
import Translate from '@/components/Translate';

const InformationUsageSection = () => {
  return (
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
  );
};

export default InformationUsageSection;
