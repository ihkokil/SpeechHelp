
import React from 'react';
import Confetti from 'react-confetti';

interface SpeechConfettiProps {
  active: boolean;
  width: number;
  height: number;
}

const SpeechConfetti: React.FC<SpeechConfettiProps> = ({ active, width, height }) => {
  if (!active) return null;
  
  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.1}
    />
  );
};

export default SpeechConfetti;
