
import Translate from '@/components/Translate';

const IntroductionSection = () => {
  return (
    <section className="border-l-4 border-pink-500 pl-6 bg-pink-50 p-6 rounded-r-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-pink-800">
        <Translate text="legal.privacyPolicy.introduction.title" fallback="Introduction" />
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Welcome to SpeechHelp ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered speech generation service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access or use our service.
      </p>
    </section>
  );
};

export default IntroductionSection;
