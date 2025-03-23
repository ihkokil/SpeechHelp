
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
      tweenDuration={10000} // Slowed down for longer animation
      gravity={0.05} // Reduced gravity for slower falling confetti
      colors={[
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
        '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#FFEB3B'
      ]} // Added more colors for variety
    />
  );
};

export default SpeechConfetti;
