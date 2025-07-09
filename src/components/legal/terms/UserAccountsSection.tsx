
import Translate from '@/components/Translate';

const UserAccountsSection = () => {
  return (
    <section className="border-l-4 border-green-500 pl-6 bg-green-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-green-800">
        <Translate text="legal.termsOfService.accounts.title" fallback="User Accounts and Registration" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        To access certain features of our service, you must create an account. You agree to:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Provide accurate, current, and complete information during registration</li>
        <li>Maintain and update your account information</li>
        <li>Keep your login credentials secure and confidential</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        You must be at least 13 years old to create an account. Users under 18 must have parental consent.
      </p>
    </section>
  );
};

export default UserAccountsSection;
