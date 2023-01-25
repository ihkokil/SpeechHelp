
import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Translate from '@/components/Translate';

interface SpeechSummaryCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  period: string;
  bgColor?: string;
}

const SpeechSummaryCard = ({ 
  icon, 
  count, 
  label, 
  period, 
  bgColor = 'bg-white' 
}: SpeechSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
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
              <p className="text-sm text-gray-600 mt-1">
                <Translate text={label} />
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Translate text={period} />
            <ChevronDownIcon className={cn(
              "h-4 w-4 ml-1 transition-transform",
              expanded && "transform rotate-180"
            )} />
          </button>
        </div>
        
        {expanded && (
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
