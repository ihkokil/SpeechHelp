
import Translate from '@/components/Translate';

const SecuritySection = () => {
  return (
    <section className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-yellow-800">
        <Translate text="legal.privacyPolicy.security.title" fallback="Data Security" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls and authentication mechanisms</li>
        <li>Secure data storage with Supabase</li>
        <li>Regular backups and disaster recovery procedures</li>
      </ul>
    </section>
  );
};

export default SecuritySection;
