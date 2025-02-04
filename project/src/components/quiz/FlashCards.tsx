import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards: FlashCard[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  // If no cards are provided, show a placeholder
  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">No flashcards available for this module.</p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      <div className="relative perspective-1000 h-80">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              x: direction > 0 ? 300 : -300,
              opacity: 0,
              rotateY: isFlipped ? 180 : 0
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
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 flex items-center justify-center text-center">
                <p className="text-xl">{cards[currentIndex].front}</p>
              </div>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 flex items-center justify-center text-center">
                <p className="text-xl">{cards[currentIndex].back}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 bg-white/10 rounded-full disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFlip}
          className="p-2 bg-white/10 rounded-full"
        >
          <RotateCw className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="p-2 bg-white/10 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default FlashCards;
