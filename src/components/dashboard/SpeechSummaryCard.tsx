
import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

interface SpeechSummaryCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  period: string;
  bgColor?: string;
  showExpand?: boolean;
}

const SpeechSummaryCard = ({ 
  icon, 
  count, 
  label, 
  period, 
  bgColor = 'bg-white',
  showExpand = true
}: SpeechSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Translate label and period if they are translation keys
  const translatedLabel = t(label, currentLanguage.code);
  const translatedPeriod = t(period, currentLanguage.code);
  
  return (
    <div className={cn(
      "rounded-lg border border-gray-200 overflow-hidden",
      bgColor
    )}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              {icon}
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900">{count}</h3>
              <p className="text-sm text-gray-600 mt-1">{translatedLabel}</p>
            </div>
          </div>
          
          {showExpand && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {translatedPeriod}
              <ChevronDownIcon className={cn(
                "h-4 w-4 ml-1 transition-transform",
                expanded && "transform rotate-180"
              )} />
            </button>
          )}
          
          {!showExpand && (
            <span className="text-sm text-gray-500">{translatedPeriod}</span>
          )}
        </div>
        
        {showExpand && expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Detailed statistics will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechSummaryCard;
