import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGenieProps {
  progress: number;
  className?: string;
}

const AnimatedGenie: React.FC<AnimatedGenieProps> = ({ progress, className }) => {
  const getGenieStage = () => {
    if (progress < 20) return 'thinking';
    if (progress < 40) return 'writing';
    if (progress < 60) return 'crumpling';
    if (progress < 80) return 'writing-enthusiastic';
    if (progress < 95) return 'reviewing';
    if (progress < 100) return 'preparing';
    return 'presenting';
  };

  const stage = getGenieStage();

  return (
    <div className={cn("relative flex justify-center items-center", className)}>
      <div className="relative w-32 h-32">
        {/* Genie Base */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm">
            
            {/* Genie Face */}
            <div className="relative w-16 h-16">
              {/* Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300">
                
                {/* Eyes */}
                <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                
                {/* Smile */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full"></div>
                
                {/* Hat */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-primary to-accent rounded-t-full">
                  <div className="absolute top-0 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Body */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg">
                
                {/* Arms */}
                <div className={cn(
                  "absolute -left-2 top-1 w-4 h-1 bg-pink-300 rounded-full transition-transform duration-300",
                  stage === 'thinking' && "rotate-45",
                  stage === 'writing' && "animate-bounce",
                  stage === 'writing-enthusiastic' && "animate-pulse",
                  stage === 'crumpling' && "animate-ping",
                  stage === 'reviewing' && "rotate-12",
                  stage === 'preparing' && "-rotate-12",
                  stage === 'presenting' && "rotate-0"
                )}></div>
                
                <div className={cn(
                  "absolute -right-2 top-1 w-4 h-1 bg-pink-300 rounded-full transition-transform duration-300",
                  stage === 'writing' && "animate-bounce",
                  stage === 'writing-enthusiastic' && "animate-pulse",
                  stage === 'crumpling' && "animate-ping",
                  stage === 'reviewing' && "-rotate-12",
                  stage === 'preparing' && "rotate-12",
                  stage === 'presenting' && "rotate-45"
                )}></div>

                {/* Tie (appears during preparing/presenting) */}
                {(stage === 'preparing' || stage === 'presenting') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-primary to-accent animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Writing Props */}
        {(stage === 'writing' || stage === 'writing-enthusiastic') && (
          <div className="absolute top-8 right-4">
            <div className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full animate-bounce"></div>
          </div>
        )}

        {/* Paper Props */}
        {stage === 'crumpling' && (
          <>
            <div className="absolute top-12 left-2 w-3 h-3 bg-white border border-gray-300 rounded animate-bounce"></div>
            <div className="absolute top-16 right-3 w-2 h-2 bg-white border border-gray-300 rounded animate-bounce"></div>
          </>
        )}

        {/* Magic Sparkles */}
        {stage === 'presenting' && (
          <>
            <div className="absolute top-2 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-6 right-6 w-1 h-1 bg-pink-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
          </>
        )}

        {/* Thought Bubble */}
        {stage === 'thinking' && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-8 h-6 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-xs">💭</div>
              </div>
              <div className="absolute -bottom-1 left-3 w-2 h-2 bg-white border-l-2 border-b-2 border-gray-300 transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedGenie;