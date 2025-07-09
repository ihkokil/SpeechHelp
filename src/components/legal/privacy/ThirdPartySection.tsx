
import Translate from '@/components/Translate';

const ThirdPartySection = () => {
  return (
    <section className="border-l-4 border-green-500 pl-6 bg-green-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-green-800">
        <Translate text="legal.privacyPolicy.thirdParty.title" fallback="AI Processing and Third-Party Services" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Our speech generation service utilizes artificial intelligence technology provided by OpenAI. When you create speeches:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Your input data may be processed by OpenAI's API to generate speech content</li>
        <li>We implement appropriate safeguards to protect your data during AI processing</li>
        <li>Generated content is returned to you and may be stored in your account</li>
        <li>We do not share your personal speech content with third parties for marketing purposes</li>
      </ul>
      
      <p className="text-gray-700 leading-relaxed mb-4">
        We also use Stripe for secure payment processing. Stripe maintains PCI DSS compliance and handles sensitive payment information according to industry standards.
      </p>
    </section>
  );
};

export default ThirdPartySection;
