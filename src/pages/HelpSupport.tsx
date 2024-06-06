
import { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import FAQsTab from '@/components/help/FAQsTab';
import GuidesTab from '@/components/help/GuidesTab';
import ContactTab from '@/components/help/ContactTab';
import ResourcesTab from '@/components/help/ResourcesTab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // Sample FAQs for the FAQsTab
  const faqs = [
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

  return (
    <SpeechLabLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Find answers to common questions or contact our support team</p>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help topics..." 
              className="w-full h-10 px-4 rounded-lg border border-gray-200"
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 h-10">Search</Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'faq' 
                  ? 'bg-purple-500 text-white rounded-t-xl' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="h-5 w-5 mb-1" />
              <span className="text-sm">FAQs</span>
            </button>
            
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'guides' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-sm">Guides</span>
            </button>
            
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'contact' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5 mb-1" />
              <span className="text-sm">Contact Us</span>
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'resources' 
                  ? 'bg-purple-500 text-white rounded-t-xl' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-sm">Resources</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          {activeTab === 'faq' && <FAQsTab faqs={faqs} />}
          {activeTab === 'guides' && <GuidesTab />}
          {activeTab === 'contact' && <ContactTab />}
          {activeTab === 'resources' && <ResourcesTab />}
        </div>
      </div>
    </SpeechLabLayout>
  );
};

export default HelpSupport;
