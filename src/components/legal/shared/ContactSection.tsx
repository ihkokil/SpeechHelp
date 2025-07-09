
import Translate from '@/components/Translate';

interface ContactSectionProps {
  sectionType: 'privacy' | 'terms' | 'cookies';
}

const ContactSection = ({ sectionType }: ContactSectionProps) => {
  const getTitle = () => {
    switch (sectionType) {
      case 'privacy':
        return <Translate text="legal.privacyPolicy.contact.title" fallback="Contact Us" />;
      case 'terms':
        return <Translate text="legal.termsOfService.contact.title" fallback="Contact Information" />;
      case 'cookies':
        return <Translate text="legal.cookiePolicy.contact.title" fallback="Contact Us About Cookies" />;
    }
  };

  const getSubject = () => {
    switch (sectionType) {
      case 'privacy':
        return 'Privacy Policy Inquiry';
      case 'terms':
        return 'Terms of Service Inquiry';
      case 'cookies':
        return 'Cookie Policy Inquiry';
    }
  };

  return (
    <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-red-800">
        {getTitle()}
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you have questions or concerns about this {sectionType === 'privacy' ? 'Privacy Policy' : sectionType === 'terms' ? 'Terms of Service' : 'Cookie Policy'}, please contact us at:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-700">
          <strong>Email:</strong> hello@speechhelp.ai<br />
          {sectionType === 'cookies' && <><strong>Subject:</strong> {getSubject()}<br /></>}
          <strong>Service:</strong> SpeechHelp - AI Speech Assistant<br />
          <strong>Entity:</strong> Creativity Crisis, LLC
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
