
import React from 'react';
import { PartyPopper } from 'lucide-react';
import Confetti from 'react-confetti';

interface SpeechGenerationProgressProps {
  visible: boolean;
}

const SpeechGenerationProgress: React.FC<SpeechGenerationProgressProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
      />
      <div className="rounded-full bg-white/90 backdrop-blur-sm p-10 shadow-lg z-10 text-center w-80 h-80 flex flex-col items-center justify-center border-4 border-pink-500 animate-scale-in">
        <div className="mb-4">
          <PartyPopper className="h-16 w-16 text-pink-600 mb-2" />
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Congratulations</h2>
        <h3 className="text-2xl font-bold text-pink-600 mb-4">You Did It!</h3>
        <p className="text-gray-700">Your speech is being generated...</p>
      </div>
    </div>
  );
};

export default SpeechGenerationProgress;
