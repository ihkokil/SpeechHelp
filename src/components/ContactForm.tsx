
import { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      
      // Show success message (would use toast in a real app)
      alert('Message sent! We\'ll get back to you soon.');
    }, 1500);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('contact.title', currentLanguage.code)}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact.getInTouch', currentLanguage.code)}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="md:col-span-3">
            <p className="text-gray-600 mb-8">
              {t('contact.questions', currentLanguage.code)}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.name', currentLanguage.code)}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('contact.namePlaceholder', currentLanguage.code)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.email', currentLanguage.code)}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('contact.emailPlaceholder', currentLanguage.code)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.message', currentLanguage.code)}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('contact.messagePlaceholder', currentLanguage.code)}
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
                    Processing...
                  </span>
                ) : (
                  t('contact.sendButton', currentLanguage.code)
                )}
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">{t('contact.infoTitle', currentLanguage.code)}</h3>
            <p className="mb-8 text-white/90">{t('contact.infoSubtitle', currentLanguage.code)}</p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-white/70" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Email</h4>
                  <a href="mailto:hello@speechhelp.ai" className="text-white hover:underline">
                    {t('contact.emailAddress', currentLanguage.code)}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <MessageSquare className="h-6 w-6 text-white/70" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Chat</h4>
                  <p className="text-white/90">{t('contact.liveChatSupport', currentLanguage.code)}</p>
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
