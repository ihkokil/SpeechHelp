
import Translate from '@/components/Translate';

const ThirdPartyCookiesSection = () => {
  return (
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
  );
};

export default ThirdPartyCookiesSection;
