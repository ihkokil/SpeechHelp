
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  const encouragingMessages = [
    "Your insights are the secret ingredient to a brilliant speech!",
    "Every detail you share paints a richer picture. Keep it coming!",
    "You're doing great! Each answer brings us closer to perfection.",
    "The more we learn, the better your speech will be. Keep going!",
    "Your thoughts matter! Every bit helps us craft a masterpiece.",
    "Keep sharing! Your input is invaluable for a personalized speech.",
    "You're on a roll! Each answer adds more depth to your speech.",
    "Great job! Your information is turning into a memorable story.",
    "Your input is a treasure trove for us to create something special.",
    "Thank you for sharing! Your answers shape every part of your speech."
  ];

  useEffect(() => {
    // Pick a message based on current question index to ensure consistency
    const messageIndex = currentQuestionIndex % encouragingMessages.length;
    setMessage(encouragingMessages[messageIndex]);
  }, [currentQuestionIndex]);

  return (
    <motion.div
      key={`encouragement-${currentQuestionIndex}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0
      }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 150,
        damping: 20
      }}
      className="w-full max-w-md mx-auto"
    >
      {/* Message bubble */}
      <div className="flex items-center justify-center">
        <div className="w-52 h-52 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full shadow-lg flex items-center justify-center p-4 border border-purple-200">
          <div className="text-center">
            <Star className="h-6 w-6 text-purple-600 mb-1 mx-auto" fill="#E5DEFF" strokeWidth={2} />
            <h4 className="font-bold text-purple-900 mb-2 uppercase text-sm">Speech Writing Tip</h4>
            <p className="text-purple-800 font-medium text-sm">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EncouragementMessage;
