
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
import SearchBar from '@/components/help/SearchBar';

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
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'faq' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>FAQs</span>
            </button>
            
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'guides' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Guides</span>
            </button>
            
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'contact' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Contact Us</span>
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Resources</span>
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
