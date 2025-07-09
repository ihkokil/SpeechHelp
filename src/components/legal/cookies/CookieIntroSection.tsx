
import Translate from '@/components/Translate';

const CookieIntroSection = () => {
  return (
    <section className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-blue-800">
        <Translate text="legal.cookiePolicy.introduction.title" fallback="What Are Cookies" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        This Cookie Policy explains how SpeechHelp, operated by Creativity Crisis, LLC ("we," "us," or "our"), uses cookies and similar tracking technologies when you visit our website and use our AI speech generation service.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Cookies are small text files that are placed on your device when you visit a website. They help websites remember your preferences, improve your browsing experience, and provide analytics about how the site is used.
      </p>
    </section>
  );
};

export default CookieIntroSection;
