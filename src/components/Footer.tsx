import { Facebook, Twitter, Instagram, Linkedin, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                <span className="text-pink-600">SPEECH</span>HELP
              </span>
            </a>
            <p className="text-gray-600 mb-6 max-w-md">
              Empower your voice with our AI-driven platform. Create unforgettable speeches for every occasion with ease and precision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">You, the User</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 hover:text-pink-600 transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@speechhelp.com" className="text-gray-600 hover:text-pink-600 transition-colors">hello@speechhelp.com</a>
              </li>
              <li>
                <a href="tel:+18005551234" className="text-gray-600 hover:text-pink-600 transition-colors">+1 (800) 555-1234</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Community</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} SpeechHelp is a registered service of Creativity Crisis, LLC | All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
