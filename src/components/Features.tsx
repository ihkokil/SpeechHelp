
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { CalendarRange, Zap, Target, Clock, Calendar, Sparkles } from 'lucide-react';
import Translate from '@/components/Translate';

const Features = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* We place the id at the VERY top of the component to ensure proper scroll positioning */}
        <div id="features" className="pt-3"></div>
        
        <div className="max-w-[90%] sm:max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            <Translate text="headers.welcomeTo" /> <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Speech Help!</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            <Translate text="features.introText1" />
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            <Translate text="features.introText2" />
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.ai.title" /></h3>
            <p className="text-gray-600"><Translate text="features.ai.description" /></p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.writersBlock.title" /></h3>
            <p className="text-gray-600"><Translate text="features.writersBlock.description" /></p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.tailored.title" /></h3>
            <p className="text-gray-600"><Translate text="features.tailored.description" /></p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.quick.title" /></h3>
            <p className="text-gray-600"><Translate text="features.quick.description" /></p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.occasions.title" /></h3>
            <p className="text-gray-600"><Translate text="features.occasions.description" /></p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <CalendarRange className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3"><Translate text="features.subscription.title" /></h3>
            <p className="text-gray-600"><Translate text="features.subscription.description" /></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
