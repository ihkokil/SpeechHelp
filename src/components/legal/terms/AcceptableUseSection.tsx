
import Translate from '@/components/Translate';

const AcceptableUseSection = () => {
  return (
    <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-red-800">
        <Translate text="legal.termsOfService.usage.title" fallback="Acceptable Use Policy" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        You agree not to use our service to:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Create content that is illegal, harmful, threatening, defamatory, or offensive</li>
        <li>Violate any intellectual property rights or privacy rights</li>
        <li>Transmit spam, malware, or other harmful content</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Interfere with or disrupt our service or servers</li>
        <li>Use our service for any commercial purpose without authorization</li>
        <li>Create content that promotes violence, discrimination, or hatred</li>
        <li>Impersonate any person or entity</li>
      </ul>
    </section>
  );
};

export default AcceptableUseSection;
