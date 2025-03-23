
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
      numberOfPieces={800}
      tweenDuration={8000}
      gravity={0.1}
      colors={[
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
        '#8BC34A', '#CDDC39'
      ]}
    />
  );
};

export default SpeechConfetti;
