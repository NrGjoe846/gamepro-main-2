import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards?: FlashCard[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ cards = defaultCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

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

  return (
    <div className="relative max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Python Basics Flashcards</h2>
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
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Question</h3>
                  <p className="text-xl">{cards[currentIndex].front}</p>
                  <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
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

      <div className="flex items-center justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Go to Next
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

// Default cards with Python information
const defaultCards: FlashCard[] = [
  {
    front: "What is the purpose of the print() function?",
    back: "The print() function outputs text to the console."
  },
  {
    front: "What is the correct syntax for print()?",
    back: 'Use parentheses and quotes:\n\nprint("Hello, World!")\n\nMake sure to:\n• Use parentheses ()\n• Enclose text in quotes " "'
  },
  {
    front: "What is the key concept of print()?",
    back: "print() is a built-in function used to display information."
  },
  {
    front: "What are common mistakes when using print()?",
    back: "Common mistakes include:\n• Forgetting parentheses: print 'Hello'\n• Missing quotes: print(Hello)\n• Using wrong quotes: print('Hello\")\n\nCorrect way: print(\"Hello\")"
  },
  {
    front: "Why is print() typically the first thing you learn in Python?",
    back: "print() is taught first because:\n• It confirms your Python setup works\n• It's easy to understand\n• It provides immediate visual feedback\n• It's essential for learning other concepts"
  }
];

export default FlashCards;import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards?: FlashCard[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ cards = defaultCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

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

  return (
    <div className="relative max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Python Basics Flashcards</h2>
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
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Question</h3>
                  <p className="text-xl">{cards[currentIndex].front}</p>
                  <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
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

      <div className="flex items-center justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Go to Next
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

// Default cards with Python information
const defaultCards: FlashCard[] = [
  {
    front: "What is the purpose of the print() function?",
    back: "The print() function outputs text to the console."
  },
  {
    front: "What is the correct syntax for print()?",
    back: 'Use parentheses and quotes:\n\nprint("Hello, World!")\n\nMake sure to:\n• Use parentheses ()\n• Enclose text in quotes " "'
  },
  {
    front: "What is the key concept of print()?",
    back: "print() is a built-in function used to display information."
  },
  {
    front: "What are common mistakes when using print()?",
    back: "Common mistakes include:\n• Forgetting parentheses: print 'Hello'\n• Missing quotes: print(Hello)\n• Using wrong quotes: print('Hello\")\n\nCorrect way: print(\"Hello\")"
  },
  {
    front: "Why is print() typically the first thing you learn in Python?",
    back: "print() is taught first because:\n• It confirms your Python setup works\n• It's easy to understand\n• It provides immediate visual feedback\n• It's essential for learning other concepts"
  }
];

export default FlashCards;
