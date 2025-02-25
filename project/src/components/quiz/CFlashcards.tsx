import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCcw, Play } from 'lucide-react';
import flashcardsData from '../../data/quizzes/cFlashcards.json';

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface CFlashcardsProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: () => void;
  moduleTitle: string;
}

const CFlashcards: React.FC<CFlashcardsProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  moduleTitle
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<FlashCard[]>([]);

  useEffect(() => {
    const findFlashcardsForModule = () => {
      for (const phase of flashcardsData) {
        for (const topic of phase.topics) {
          for (const subtopic of topic.subtopics) {
            if (subtopic.subtopic === moduleTitle && subtopic.flashcards) {
              return subtopic.flashcards;
            }
          }
        }
      }
      return [];
    };

    setCards(findFlashcardsForModule());
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [moduleTitle]);

  if (!isOpen) return null;

  if (cards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full m-4 text-center">
          <h2 className="text-xl font-bold mb-4">No Flashcards Available</h2>
          <p className="text-gray-400 mb-6">Would you like to start the quiz instead?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentCard = cards[currentCardIndex];

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">{moduleTitle}</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Card {currentCardIndex + 1} of {cards.length}</span>
            <span>{Math.round(((currentCardIndex + 1) / cards.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative perspective-1000 h-96 mb-8">
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 backface-hidden p-8 flex items-center justify-center text-center 
                backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 cursor-pointer
                ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
              onClick={handleFlip}
            >
              <div className="text-xl">{currentCard.front}</div>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 backface-hidden p-8 flex items-center justify-center text-center 
                backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 cursor-pointer
                [transform:rotateY(180deg)]
                ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
              onClick={handleFlip}
            >
              <div className="text-xl whitespace-pre-line">{currentCard.back}</div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="p-2 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {currentCardIndex === cards.length - 1 ? (
            <button
              onClick={onStartQuiz}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              className="p-2 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CFlashcards;
