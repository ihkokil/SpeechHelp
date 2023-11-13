
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from 'lucide-react';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FAQsTabProps {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const FAQsTab = ({ faqs }: FAQsTabProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Default FAQs
  const defaultFaqs = [
    {
      question: 'How do I create a new speech?',
      answer: 'Navigate to the Speech Lab from your dashboard and follow the guided steps to create a new speech. You can select an occasion, fill out the questionnaire, and our AI will help generate a speech tailored to your needs.'
    },
    {
      question: 'Can I edit my speeches after they are generated?',
      answer: 'Yes! After generation, you can edit your speech in the Speech Lab. You can also access all your saved speeches in the "My Speeches" section where you can view, edit, or delete them.'
    },
    {
      question: 'How do I export my speech?',
      answer: 'You can export your speech in various formats including PDF, Word document, or plain text. Just go to "My Speeches", select the speech you want to export, and use the export options available.'
    },
    {
      question: 'What if I need help with my speech?',
      answer: 'We offer writing tips and guidelines in the "Writing Tips" section. If you need more help, you can contact our support team through the "Help & Support" page.'
    },
    {
      question: 'How can I change my subscription plan?',
      answer: 'You can manage your subscription in the "Settings" page under the "Billing" tab. From there, you can upgrade, downgrade, or cancel your subscription.'
    }
  ];

  // Use provided FAQs or default to our standard set
  const displayFaqs = faqs || defaultFaqs;

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-5">
          {t('help.frequentlyAskedQuestions', currentLanguage.code)}
        </h3>
        
        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <Disclosure key={index} as="div" className="border border-gray-200 rounded-lg">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-left text-sm font-medium text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>{faq.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-3 text-sm text-gray-600">
                    {faq.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsTab;
