
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Translate from '@/components/Translate';

interface LegalPageHeaderProps {
  title: string;
  titleKey: string;
  gradientFrom: string;
  gradientTo: string;
}

const LegalPageHeader = ({ title, titleKey, gradientFrom, gradientTo }: LegalPageHeaderProps) => {
  return (
    <div className="mb-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <Translate text="legal.backToHome" fallback="Back to Home" />
      </Link>
      <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white rounded-xl p-6 mb-6`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <Translate text={titleKey} fallback={title} />
        </h1>
        <p className={`text-${gradientFrom.replace('-600', '-100')}`}>
          <Translate text="legal.lastUpdated" fallback="Last updated" />: June 11, 2025
        </p>
      </div>
    </div>
  );
};

export default LegalPageHeader;
