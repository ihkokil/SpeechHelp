
import { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import Translate from '@/components/Translate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the contact form edge function
      const { data, error } = await supabase.functions.invoke('send-contact-form', {
        body: {
          name: name,
          email: email,
          message: message
        }
      });

      if (error) {
        console.error('Contact form submission error:', error);
        toast({
          title: "Error sending message",
          description: "Failed to send your message. Please try again or contact us directly at hello@speechhelp.ai",
          variant: "destructive",
        });
      } else if (data?.success) {
        // Reset form
        setName('');
        setEmail('');
        setMessage('');
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you soon.",
          variant: "success",
        });
      } else {
        console.error('Contact form submission failed:', data);
        toast({
          title: "Error sending message",
          description: "Failed to send your message. Please try again or contact us directly at hello@speechhelp.ai",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      toast({
        title: "Error sending message",
        description: "Failed to send your message. Please try again or contact us directly at hello@speechhelp.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20 relative">
      {/* Add an anchor div at the top for better scroll positioning */}
      <div id="contact" className="absolute top-0"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            <Translate text="contact.whoWeAre" /> <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"><Translate text="contact.howWeHelp" /></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <Translate text="contact.getInTouch" />
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="md:col-span-3">
            <p className="text-gray-600 mb-8">
              <Translate text="contact.questions" />
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <Translate text="contact.name" />
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  <Translate text="contact.email" />
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  <Translate text="contact.message" />
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <Translate text="contact.sendButton" />
                )}
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4"><Translate text="contact.infoTitle" /></h3>
            <p className="mb-8 text-white/90"><Translate text="contact.infoSubtitle" /></p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-white/70" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Email</h4>
                  <a href="mailto:hello@speechhelp.ai" className="text-white hover:underline">
                    <Translate text="contact.emailAddress" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <MessageSquare className="h-6 w-6 text-white/70" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Chat</h4>
                  <p className="text-white/90"><Translate text="contact.liveChatSupport" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
