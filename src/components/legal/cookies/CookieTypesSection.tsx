
import Translate from '@/components/Translate';

const CookieTypesSection = () => {
  return (
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
  );
};

export default CookieTypesSection;
