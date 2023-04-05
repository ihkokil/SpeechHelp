
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface EncouragementMessageProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const EncouragementMessage: React.FC<EncouragementMessageProps> = ({ 
  currentQuestionIndex, 
  totalQuestions 
}) => {
  const [message, setMessage] = useState<string>('');
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
    // Pick a random message that hasn't been used yet
    let randomIndex;
    
    // Reset used indices if we've used all messages
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
  }, [currentQuestionIndex, encouragingMessages.length, usedMessageIndices]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotate: [0, 5, -5, 3, -3, 0] 
        }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ 
          duration: 0.7,
          type: "spring",
          stiffness: 260,
          damping: 20,
          rotate: { duration: 1, ease: "easeInOut" }
        }}
        className="relative w-full max-w-md mx-auto"
      >
        {/* Message bubble */}
        <div className="relative flex items-center justify-center">
          <div className="w-52 h-52 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full shadow-lg flex items-center justify-center p-4 border border-purple-200">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Star className="h-6 w-6 text-purple-600 mb-1 mx-auto animate-pulse-subtle" fill="#E5DEFF" strokeWidth={2} />
              <h4 className="font-bold text-purple-900 mb-2 uppercase text-sm">Speech Writing Tip</h4>
              <p className="text-purple-800 font-medium text-sm">{message}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EncouragementMessage;
