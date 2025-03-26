
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactTab = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the contact form
    toast({
      title: "Message sent",
      description: "Our support team will get back to you soon.",
      variant: "default",
    });
    // Reset form
    setContactName('');
    setContactEmail('');
    setContactMessage('');
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
  );
};

export default ContactTab;
