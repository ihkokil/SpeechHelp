
import Translate from '@/components/Translate';

const CookieManagementSection = () => {
  return (
    <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-red-800">
        <Translate text="legal.cookiePolicy.management.title" fallback="Managing Your Cookie Preferences" />
      </h2>
      
      <h3 className="text-xl font-medium text-gray-800 mb-3">Browser Settings</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Most web browsers allow you to control cookies through their settings. You can:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Block all cookies</li>
        <li>Allow only first-party cookies</li>
        <li>Delete existing cookies</li>
        <li>Set preferences for specific websites</li>
      </ul>

      <h3 className="text-xl font-medium text-gray-800 mb-3">Browser-Specific Instructions</h3>
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data<br />
            <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data<br />
            <strong>Safari:</strong> Preferences → Privacy → Cookies and website data<br />
            <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
          </p>
        </div>
      </div>

      <h3 className="text-xl font-medium text-gray-800 mb-3">Impact of Disabling Cookies</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Please note that disabling certain cookies may affect your experience with our service:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>You may need to log in repeatedly</li>
        <li>Your preferences and settings may not be saved</li>
        <li>Some features may not function properly</li>
        <li>Performance and user experience may be reduced</li>
      </ul>
    </section>
  );
};

export default CookieManagementSection;
