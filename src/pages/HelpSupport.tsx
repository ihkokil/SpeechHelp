
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from '@/components/help/SearchBar';
import FAQsTab from '@/components/help/FAQsTab';
import GuidesTab from '@/components/help/GuidesTab';
import ContactTab from '@/components/help/ContactTab';
import ResourcesTab from '@/components/help/ResourcesTab';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
      <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Find answers to common questions or contact our support team</p>
        </div>

        <div className="mb-8">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <TabsList className="flex w-full max-w-2xl rounded-lg overflow-hidden h-16 p-1.5 bg-gray-100">
              <TabsTrigger 
                value="faq" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm font-medium">FAQs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="guides" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Guides</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-medium">Contact Us</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Resources</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="faq" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <FAQsTab faqs={faqs} />
          </TabsContent>

          <TabsContent value="guides" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <GuidesTab />
          </TabsContent>

          <TabsContent value="contact" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <ContactTab />
          </TabsContent>

          <TabsContent value="resources" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </SpeechLabLayout>
  );
};

export default HelpSupport;
