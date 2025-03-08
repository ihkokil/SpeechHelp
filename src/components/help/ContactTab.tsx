
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactTab = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the contact form edge function
      const { data, error } = await supabase.functions.invoke('send-contact-form', {
        body: {
          name: contactName,
          email: contactEmail,
          message: contactMessage
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
        toast({
          title: "Message sent",
          description: "Our support team will get back to you soon.",
          variant: "success",
        });
        // Reset form
        setContactName('');
        setContactEmail('');
        setContactMessage('');
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
              <p className="text-sm text-gray-600">hello@speechhelp.ai</p>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <ButtonCustom 
            type="submit" 
            variant="premium" 
            className="w-full md:w-auto flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </ButtonCustom>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactTab;
