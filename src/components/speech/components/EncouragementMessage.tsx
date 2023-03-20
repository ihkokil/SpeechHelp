
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
    // Define when to show messages - show every 2 questions or at halfway point
    const shouldShowMessage = () => {
      return currentQuestionIndex > 0 && 
        (currentQuestionIndex % 2 === 0 || 
         currentQuestionIndex === Math.floor(totalQuestions / 2));
    };
    
    if (shouldShowMessage()) {
      // Pick a random message from the array
      const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
      setMessage(encouragingMessages[randomIndex]);
      
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
  }, [currentQuestionIndex, totalQuestions, encouragingMessages]);

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
