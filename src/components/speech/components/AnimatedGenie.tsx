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
      <div className="relative w-40 h-40">
        {/* Magical Aura */}
        <div className={cn(
          "absolute inset-0 rounded-full transition-all duration-1000",
          stage === 'presenting' ? "bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-spin" : "bg-gradient-to-br from-primary/10 to-accent/10"
        )}></div>
        
        {/* Floating Sparkles */}
        {stage === 'presenting' && (
          <>
            <div className="absolute top-4 left-8 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></div>
          </>
        )}

        {/* Genie Base */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          stage === 'presenting' && "animate-bounce"
        )}>
          <div className={cn(
            "w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm transition-all duration-500",
            stage === 'writing-enthusiastic' && "animate-pulse scale-110",
            stage === 'presenting' && "scale-125 shadow-2xl shadow-primary/50"
          )}>
            
            {/* Genie Face */}
            <div className="relative w-16 h-16">
              {/* Head */}
              <div className={cn(
                "absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 transition-all duration-300",
                stage === 'thinking' && "animate-pulse",
                stage === 'writing' && "scale-105",
                stage === 'writing-enthusiastic' && "animate-bounce scale-110",
                stage === 'crumpling' && "scale-95",
                stage === 'presenting' && "scale-110 animate-pulse"
              )}>
                
                {/* Eyes */}
                <div className={cn(
                  "absolute top-3 left-2 w-1.5 h-1.5 bg-gray-800 rounded-full transition-all duration-300",
                  stage === 'thinking' && "animate-pulse",
                  stage === 'presenting' && "animate-ping"
                )}></div>
                <div className={cn(
                  "absolute top-3 right-2 w-1.5 h-1.5 bg-gray-800 rounded-full transition-all duration-300",
                  stage === 'thinking' && "animate-pulse",
                  stage === 'presenting' && "animate-ping"
                )}></div>
                
                {/* Smile */}
                <div className={cn(
                  "absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full transition-all duration-300",
                  stage === 'presenting' && "w-5 border-b-4"
                )}></div>
                
                {/* Hat */}
                <div className={cn(
                  "absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-primary to-accent rounded-t-full transition-all duration-500",
                  stage === 'writing-enthusiastic' && "animate-bounce",
                  stage === 'presenting' && "w-10 h-5 animate-pulse"
                )}>
                  <div className={cn(
                    "absolute top-0 right-1 w-1 h-1 bg-yellow-300 rounded-full transition-all duration-300",
                    stage === 'presenting' ? "animate-bounce w-2 h-2" : "animate-ping"
                  )}></div>
                  {stage === 'presenting' && (
                    <div className="absolute top-0 left-1 w-1 h-1 bg-pink-300 rounded-full animate-bounce"></div>
                  )}
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