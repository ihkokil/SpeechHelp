
import Translate from '@/components/Translate';

const InformationCollectionSection = () => {
  return (
    <section className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-purple-800">
        <Translate text="legal.privacyPolicy.collection.title" fallback="Information We Collect" />
      </h2>
      
      <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        We may collect personal information that you voluntarily provide to us when you:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Register for an account</li>
        <li>Subscribe to our service</li>
        <li>Contact us for support</li>
        <li>Participate in surveys or promotions</li>
      </ul>
      
      <p className="text-gray-700 leading-relaxed mb-4">
        This information may include:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Name and contact information (email address, phone number)</li>
        <li>Billing information and payment details (processed securely through Stripe)</li>
        <li>Account credentials and preferences</li>
        <li>Communication preferences</li>
      </ul>

      <h3 className="text-xl font-medium text-gray-800 mb-3">Speech Content and Usage Data</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        When you use our AI speech generation service, we may collect:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Speech content you create, edit, or save</li>
        <li>Speech type preferences and customization settings</li>
        <li>Usage patterns and service interactions</li>
        <li>Performance metrics and analytics data</li>
      </ul>

      <h3 className="text-xl font-medium text-gray-800 mb-3">Technical Information</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        We automatically collect certain technical information, including:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>IP address and location data</li>
        <li>Browser type and version</li>
        <li>Device information and operating system</li>
        <li>Website usage patterns and navigation data</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>
    </section>
  );
};

export default InformationCollectionSection;
