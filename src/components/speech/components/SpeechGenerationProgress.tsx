
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface SpeechGenerationProgressProps {
  showConfetti: boolean;
}

const SpeechGenerationProgress: React.FC<SpeechGenerationProgressProps> = ({ showConfetti }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-4">
      <div className="text-center font-medium">
        <p className="mb-2">Crafting your speech...</p>
        <p className="text-sm text-muted-foreground">
          {progress < 30 && "Gathering your inputs..."}
          {progress >= 30 && progress < 60 && "Analyzing speech structure..."}
          {progress >= 60 && progress < 85 && "Polishing language and tone..."}
          {progress >= 85 && progress < 100 && "Finalizing your speech..."}
          {progress >= 100 && "Speech ready!"}
        </p>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {showConfetti && progress >= 100 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </div>
  );
};

export default SpeechGenerationProgress;
