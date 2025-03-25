
import React, { useEffect, useState } from 'react';
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
    <>
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {React.createElement(confetti, {
            width: window.innerWidth,
            height: window.innerHeight,
            numberOfPieces: 50,
            recycle: false,
            gravity: 0.2
          })}
        </div>
      )}
      <div className="flex justify-center w-full mt-6 mb-2">
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white px-6 py-3 rounded-3xl shadow-lg max-w-md text-center"
            >
              {/* Thought bubble stem/tail */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6">
                <div className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-white shadow-sm"></div>
                <div className="absolute bottom-4 left-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
              </div>
              
              {/* Message content with gradient background */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-2xl border border-purple-100">
                <p className="text-purple-800 font-medium">{message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EncouragementMessage;
