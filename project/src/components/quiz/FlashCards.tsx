import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import PythonQuiz from './PythonQuiz';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards?: FlashCard[];
  title?: string;
  questions?: any[]; // Add questions prop
}

const FlashCards: React.FC<FlashCardsProps> = ({ 
  cards = [], 
  title = "Python Basics Flashcards",
  questions = [] // Default to empty array
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Reset state when cards change
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
  }, [cards]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    // You can add additional logic here for handling quiz completion
  };

  if (showQuiz) {
    return <PythonQuiz questions={questions} onComplete={handleQuizComplete} />;
  }

  if (!cards.length) {
    return <div>No flashcards available.</div>;
  }

  return (
    <div className="relative max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      <div className="relative perspective-1000 h-96">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              x: direction > 0 ? 300 : -300,
              opacity: 0,
              rotateY: 0
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              rotateY: isFlipped ? 180 : 0
            }}
            exit={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 preserve-3d cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front of Card */}
            <div 
              className={`absolute inset-0 backface-hidden transition-opacity duration-300 ${
                isFlipped ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Question</h3>
                  <p className="text-xl">{cards[currentIndex].front}</p>
                  <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className={`absolute inset-0 backface-hidden rotate-y-180 transition-opacity duration-300 ${
                isFlipped ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col justify-center h-full text-center">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Answer</h3>
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {cards[currentIndex].back}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Next Card
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {currentIndex === cards.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
          >
            Start Quiz
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default FlashCards;
