
import { useState } from 'react';
import { ButtonCustom } from './ui/button-custom';
import { MailIcon, MessageSquare, LucideProps } from 'lucide-react';

interface ContactIconProps extends LucideProps {
  title: string;
}

const ContactIcon = ({ title, ...props }: ContactIconProps) => {
  return (
    <div className="flex items-center my-4">
      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
        {props.children}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who We Are & <span className="text-pink-600">How We Help</span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="w-full md:w-1/2 p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Get in Touch</h3>
              <p className="text-gray-600 mb-6">Have questions about our services? Reach out to us and we'll get back to you as soon as possible.</p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <div>
                  <ButtonCustom variant="magenta" size="lg" className="w-full">
                    Send Message
                  </ButtonCustom>
                </div>
              </form>
            </div>
            <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white flex items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <p className="mb-6">We're here to answer your questions and help you get the most out of SpeechHelp.</p>
                
                <ContactIcon title="hello@speechhelp.com">
                  <MailIcon className="h-5 w-5 text-pink-600" />
                </ContactIcon>
                
                <ContactIcon title="Live Chat Support">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                </ContactIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
