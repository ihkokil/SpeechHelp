
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
      numberOfPieces={1000} // Increased for more confetti
      tweenDuration={8000} // Slowed down for longer animation
      gravity={0.05} // Reduced gravity for slower falling confetti
      colors={[
        '#D946EF', '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', 
        '#FFDEE2', '#8B5CF6', '#e91e63', '#9c27b0', '#673ab7',
        '#ff79c6', '#bd93f9', '#ff92df', '#f8f8f2', '#ffb6c1'
      ]} // Pink and purple theme colors
    />
  );
};

export default SpeechConfetti;
