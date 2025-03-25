
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
    // Define when to show messages - show for certain question indexes
    const shouldShowMessage = () => {
      // Show a message after every 2 questions or when halfway through
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
      }, 4000); // Show message for 4 seconds
      
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
          <confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={50}
            recycle={false}
            gravity={0.2}
          />
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
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-full shadow-lg max-w-md text-center"
            >
              <p className="text-white font-medium">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EncouragementMessage;
