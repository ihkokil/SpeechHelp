
import Translate from '@/components/Translate';

const ServiceDescriptionSection = () => {
  return (
    <section className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-blue-800">
        <Translate text="legal.termsOfService.service.title" fallback="Description of Service" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        SpeechHelp is an AI-powered platform that helps users create customized speeches for various occasions. Our service includes:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>AI-generated speech content based on user inputs</li>
        <li>Multiple speech types and customization options</li>
        <li>Speech editing and formatting tools</li>
        <li>Export capabilities (PDF, text formats)</li>
        <li>Account management and speech library</li>
        <li>Customer support and guidance resources</li>
      </ul>
    </section>
  );
};

export default ServiceDescriptionSection;
