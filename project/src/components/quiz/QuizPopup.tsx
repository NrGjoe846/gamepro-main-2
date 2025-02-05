import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Timer, Gift, Sparkles } from 'lucide-react';
import QuizFlow from './QuizFlow';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  moduleTitle: string;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [questions, setQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const { width, height } = useWindowSize();
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/quizzes/pythonBasics.json');
        const data = await response.json();
        setQuestions(data.questions);
        setFlashcards(data.flashcards);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen]);

  const handleQuizComplete = (score: number) => {
    setShowConfetti(true);
    const xp = Math.floor(score * 10);
    setXpGained(xp);
    
    setTimeout(() => {
      setShowConfetti(false);
      onComplete(score);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          {showConfetti && <Confetti width={width} height={height} />}
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Quiz Header */}
            <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold">{xpGained} XP</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <QuizFlow
              flashcards={flashcards}
              questions={questions}
              onComplete={handleQuizComplete}
              moduleTitle={moduleTitle}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizPopup;
