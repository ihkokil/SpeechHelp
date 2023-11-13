
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from '@/components/help/SearchBar';
import FAQsTab from '@/components/help/FAQsTab';
import GuidesTab from '@/components/help/GuidesTab';
import ContactTab from '@/components/help/ContactTab';
import ResourcesTab from '@/components/help/ResourcesTab';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-1">Find answers to common questions or contact our support team</p>
          </div>

          <div className="mb-8">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-gradient-to-r from-pink-500 via-pink-500 to-purple-600 p-1 rounded-lg">
              <TabsTrigger 
                value="faq" 
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
              >
                <HelpCircle className="h-5 w-5" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="guides" 
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
              >
                <BookOpen className="h-5 w-5" />
                <span>Guides</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Us</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
              >
                <FileText className="h-5 w-5" />
                <span>Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <FAQsTab />
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <GuidesTab />
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <ContactTab />
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <ResourcesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
