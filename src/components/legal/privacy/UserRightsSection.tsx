
import Translate from '@/components/Translate';

const UserRightsSection = () => {
  return (
    <section className="border-l-4 border-indigo-500 pl-6 bg-indigo-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-indigo-800">
        <Translate text="legal.privacyPolicy.rights.title" fallback="Your Rights and Choices" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Depending on your location, you may have certain rights regarding your personal information:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Access and review your personal information</li>
        <li>Correct inaccurate or incomplete information</li>
        <li>Delete your personal information (subject to certain limitations)</li>
        <li>Object to or restrict certain processing activities</li>
        <li>Data portability rights</li>
        <li>Withdraw consent where processing is based on consent</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        To exercise these rights, please contact us at hello@speechhelp.ai.
      </p>
    </section>
  );
};

export default UserRightsSection;
