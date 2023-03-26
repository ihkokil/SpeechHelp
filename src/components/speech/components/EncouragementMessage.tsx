
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'react-confetti';

interface EncouragementMessageProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const EncouragementMessage: React.FC<EncouragementMessageProps> = ({ 
  currentQuestionIndex, 
  totalQuestions 
}) => {
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastShownIndex, setLastShownIndex] = useState(-1);
  const [usedMessageIndices, setUsedMessageIndices] = useState<number[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const encouragingMessages = [
    "Your insights are the secret ingredient to a brilliant speech!",
    "Every detail you share paints a richer picture. Keep it coming!",
    "You're doing great! Each answer brings us closer to perfection.",
    "The more we learn, the better your speech will be. Keep going!",
    "Your thoughts matter! Every bit helps us craft a masterpiece.",
    "Keep sharing! Your input is invaluable for a personalized touch.",
    "You're on a roll! Each answer adds more depth to your speech.",
    "Great job! Your information is turning into a memorable story.",
    "Your input is a treasure trove for us to create something special.",
    "Thank you for sharing! Your answers are shaping a wonderful speech."
  ];

  useEffect(() => {
    // Define when to show messages - only at specific milestone questions
    const shouldShowMessage = () => {
      if (currentQuestionIndex <= 0) return false;
      
      // Don't show a message if we recently showed one (wait at least 3 questions)
      if (lastShownIndex >= 0 && currentQuestionIndex - lastShownIndex < 3) return false;
      
      // Show messages at approximately 25%, 50% and 80% of the questionnaire
      const showPoints = [
        Math.floor(totalQuestions * 0.25),
        Math.floor(totalQuestions * 0.5),
        Math.floor(totalQuestions * 0.8)
      ];
      
      return showPoints.includes(currentQuestionIndex);
    };
    
    if (shouldShowMessage()) {
      // Pick a random message that hasn't been used yet
      let randomIndex;
      
      // If we've used all messages, reset the used indices
      if (usedMessageIndices.length >= encouragingMessages.length) {
        setUsedMessageIndices([]);
      }
      
      // Select a random message that hasn't been used
      do {
        randomIndex = Math.floor(Math.random() * encouragingMessages.length);
      } while (usedMessageIndices.includes(randomIndex));
      
      // Update used message indices
      setUsedMessageIndices(prev => [...prev, randomIndex]);
      setMessage(encouragingMessages[randomIndex]);
      
      // Remember this question index
      setLastShownIndex(currentQuestionIndex);
      
      // Show the message and confetti
      setShowMessage(true);
      setShowConfetti(true);
      
      // Hide the message and confetti after delays
      const messageTimer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Show message for 5 seconds
      
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000); // Show confetti for 2 seconds
      
      return () => {
        clearTimeout(messageTimer);
        clearTimeout(confettiTimer);
      };
    }
  }, [currentQuestionIndex, totalQuestions, encouragingMessages, lastShownIndex, usedMessageIndices]);

  // Only render if there's a message to show
  if (!showMessage) return null;

  return (
    <div className="flex justify-center w-full mt-6 mb-2">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            {/* Round thought bubble */}
            <div className="relative bg-white p-5 rounded-full shadow-lg">
              {/* Top bubble circles */}
              <div className="absolute -top-5 left-1/4 w-8 h-8 bg-white rounded-full shadow-sm"></div>
              <div className="absolute -top-7 left-1/3 w-10 h-10 bg-white rounded-full shadow-sm"></div>
              <div className="absolute -top-4 left-1/2 w-6 h-6 bg-white rounded-full shadow-sm"></div>
              
              {/* Thought bubble tail - small circles getting smaller */}
              <div className="absolute -bottom-8 left-1/4 w-5 h-5 bg-white rounded-full shadow-sm"></div>
              <div className="absolute -bottom-12 left-1/5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              <div className="absolute -bottom-16 left-[12%] w-3 h-3 bg-white rounded-full shadow-sm"></div>
              
              {/* Message content with gradient background */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-full border border-purple-100 text-center">
                <p className="text-purple-800 font-medium">{message}</p>
              </div>
            </div>
            
            {/* Pink and purple confetti positioned over the thought bubble */}
            {showConfetti && bubbleRef.current && (
              <div className="absolute top-0 left-0 right-0 pointer-events-none z-40">
                {React.createElement(confetti, {
                  width: bubbleRef.current.offsetWidth,
                  height: bubbleRef.current.offsetHeight,
                  recycle: false,
                  numberOfPieces: 50,
                  gravity: 0.2,
                  colors: ['#FFC0CB', '#FF69B4', '#DA70D6', '#BA55D3', '#9370DB', '#8A2BE2'], // Pink and purple shades
                  confettiSource: {
                    x: bubbleRef.current.offsetWidth / 2,
                    y: bubbleRef.current.offsetHeight / 2,
                    w: 0,
                    h: 0
                  }
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncouragementMessage;
