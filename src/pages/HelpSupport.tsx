
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { HelpCircle, BookOpen, MessageSquare, Mail, Phone, ExternalLink, FileText, Video } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the help database
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the contact form
    toast({
      title: "Message sent",
      description: "Our support team will get back to you soon.",
      variant: "success",
    });
    // Reset form
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const faqs = [
    {
      question: "How do I create my first speech?",
      answer: "Navigate to the Speech Lab from your dashboard. Click on 'Create New Speech', select the occasion, fill in the speech details, and follow the guided process to generate your speech."
    },
    {
      question: "Can I edit my generated speeches?",
      answer: "Yes! After generating a speech, you'll be taken to the editor where you can modify any part of your speech. Your changes will be saved automatically."
    },
    {
      question: "How do I share my speech with others?",
      answer: "From the 'My Speeches' section, find the speech you want to share, click on the share icon, and you can either copy a shareable link or directly send it via email."
    },
    {
      question: "What subscription plans do you offer?",
      answer: "We offer various subscription plans including Free, Premium, and Professional. Visit our Pricing page to see detailed features and benefits of each plan."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime by going to Settings > Subscription and clicking on 'Cancel Subscription'. Your account will remain active until the end of the billing period."
    }
  ];

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-2">Find answers to common questions or contact our support team</p>
          </div>

          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="faq" className="flex flex-col items-center gap-1 py-2">
                <HelpCircle className="h-5 w-5" />
                <span>FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex flex-col items-center gap-1 py-2">
                <BookOpen className="h-5 w-5" />
                <span>Guides</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex flex-col items-center gap-1 py-2">
                <MessageSquare className="h-5 w-5" />
                <span>Contact Us</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex flex-col items-center gap-1 py-2">
                <FileText className="h-5 w-5" />
                <span>Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Find answers to our most commonly asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Guides & Tutorials</CardTitle>
                  <CardDescription>Step-by-step guides to help you get the most out of Speech Help</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Learn the basics of creating your first speech</p>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Read Guide
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Speech Writing Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Professional tips to enhance your speech writing</p>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View Tips
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Video Tutorials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Watch helpful videos explaining our features</p>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Watch Videos
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Account Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Learn how to manage your account settings</p>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Read Guide
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Our Support Team</CardTitle>
                  <CardDescription>We're here to help with any questions or issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Mail className="h-5 w-5 text-pink-600" />
                          Email Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">support@speechhelp.com</p>
                        <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Phone className="h-5 w-5 text-pink-600" />
                          Phone Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">+1 (800) 123-4567</p>
                        <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9am-5pm EST</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-pink-600" />
                          Live Chat
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Available in your dashboard</p>
                        <p className="text-xs text-gray-500 mt-1">Premium subscribers only</p>
                      </CardContent>
                    </Card>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input 
                          id="name" 
                          value={contactName} 
                          onChange={(e) => setContactName(e.target.value)} 
                          placeholder="Your name" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)} 
                          placeholder="Your email" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        id="message" 
                        value={contactMessage} 
                        onChange={(e) => setContactMessage(e.target.value)} 
                        placeholder="How can we help you?" 
                        rows={5} 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full md:w-auto">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                  <CardDescription>Helpful resources to improve your speech writing and delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Speech Writing Templates</CardTitle>
                        <CardDescription>Download templates for different types of speeches</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Wedding Speech Template</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <FileText className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Graduation Speech Template</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <FileText className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Business Presentation Template</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <FileText className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">External Resources</CardTitle>
                        <CardDescription>Valuable resources from around the web</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Public Speaking Tips</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Voice Training Exercises</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Body Language Guide</span>
                          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
