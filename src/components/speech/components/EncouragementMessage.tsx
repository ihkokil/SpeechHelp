
import React, { useEffect, useState, useRef } from 'react';
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
  const [showMessage, setShowMessage] = useState(false);
  const [lastShownIndex, setLastShownIndex] = useState(-1);
  const [usedMessageIndices, setUsedMessageIndices] = useState<number[]>([]);
  const [appearanceCount, setAppearanceCount] = useState(0);
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
    // Define when to show messages - with a cap of 3 total appearances
    const shouldShowMessage = () => {
      // Don't show more than 3 messages total
      if (appearanceCount >= 3) return false;
      
      // Don't show on the first question
      if (currentQuestionIndex <= 0) return false;
      
      // Don't show a message if we recently showed one (wait at least 3 questions)
      if (lastShownIndex >= 0 && currentQuestionIndex - lastShownIndex < 3) return false;
      
      // Calculate progress percentage
      const progress = currentQuestionIndex / totalQuestions;
      
      // Determine potential show points based on total appearances allowed
      let showPoints = [];
      
      // If we have 0 appearances so far, show around 20% through
      if (appearanceCount === 0) {
        showPoints = [Math.floor(totalQuestions * 0.2)];
      } 
      // If we have 1 appearance so far, show around 50% through
      else if (appearanceCount === 1) {
        showPoints = [Math.floor(totalQuestions * 0.5)];
      } 
      // If we have 2 appearances so far, show around 80% through
      else if (appearanceCount === 2) {
        showPoints = [Math.floor(totalQuestions * 0.8)];
      }
      
      // Add some randomness - 20% chance of showing if we're at a good point in the progress
      return showPoints.includes(currentQuestionIndex) || 
             (progress > 0.3 && progress < 0.9 && Math.random() < 0.2);
    };
    
    if (shouldShowMessage()) {
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
      
      // Remember this question index
      setLastShownIndex(currentQuestionIndex);
      
      // Increment appearance count
      setAppearanceCount(prev => prev + 1);
      
      // Show the message
      setShowMessage(true);
      
      // Hide the message after delay
      const messageTimer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Show message for 5 seconds
      
      return () => {
        clearTimeout(messageTimer);
      };
    }
  }, [currentQuestionIndex, totalQuestions, encouragingMessages, lastShownIndex, usedMessageIndices, appearanceCount]);

  // Only render if there's a message to show
  if (!showMessage) return null;

  return (
    <div className="flex justify-center w-full mt-6 mb-2">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            {/* Star shape wrapper */}
            <div className="relative flex items-center justify-center">
              {/* Star shape background with points */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[280px] h-[280px]">
                  {/* Star points - 8 points surrounding the message */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-t from-yellow-200 to-yellow-100 rotate-45 rounded-[40%]"></div>
                  <div className="absolute top-1/4 right-0 transform translate-x-1/3 -translate-y-1/4 w-20 h-20 bg-gradient-to-tr from-yellow-200 to-yellow-100 rotate-[25deg] rounded-[40%]"></div>
                  <div className="absolute top-3/4 right-0 transform translate-x-1/3 -translate-y-3/4 w-16 h-16 bg-gradient-to-r from-yellow-200 to-yellow-100 rotate-[65deg] rounded-[40%]"></div>
                  <div className="absolute bottom-0 right-1/4 transform translate-x-1/4 translate-y-1/3 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-100 rotate-[25deg] rounded-[40%]"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-16 h-16 bg-gradient-to-b from-yellow-200 to-yellow-100 rotate-45 rounded-[40%]"></div>
                  <div className="absolute bottom-0 left-1/4 transform -translate-x-1/4 translate-y-1/3 w-20 h-20 bg-gradient-to-bl from-yellow-200 to-yellow-100 rotate-[25deg] rounded-[40%]"></div>
                  <div className="absolute top-3/4 left-0 transform -translate-x-1/3 -translate-y-3/4 w-16 h-16 bg-gradient-to-l from-yellow-200 to-yellow-100 rotate-[65deg] rounded-[40%]"></div>
                  <div className="absolute top-1/4 left-0 transform -translate-x-1/3 -translate-y-1/4 w-20 h-20 bg-gradient-to-tl from-yellow-200 to-yellow-100 rotate-[25deg] rounded-[40%]"></div>
                </div>
              </div>

              {/* Center circle with message */}
              <div className="relative z-10 w-56 h-56 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full shadow-lg flex items-center justify-center p-8 border border-yellow-100">
                <div className="text-center">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Star className="text-yellow-400 w-8 h-8 fill-yellow-400" />
                  </div>
                  <p className="text-purple-800 font-medium">{message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncouragementMessage;
