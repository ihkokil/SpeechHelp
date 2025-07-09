
import Translate from '@/components/Translate';

const CookieUsageSection = () => {
  return (
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
  );
};

export default CookieUsageSection;
