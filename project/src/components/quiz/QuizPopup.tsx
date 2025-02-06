import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Timer } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import FlashCards from './FlashCards';

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  moduleTitle: string;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleFlashCardsComplete = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (quizScore: number) => {
    setScore(quizScore);
    setShowResults(true);
    setShowConfetti(true);
    onComplete(quizScore);
  };

  if (!isOpen) return null;

  return (
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
        className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {!showQuiz && !showResults && (
          <FlashCards onComplete={handleFlashCardsComplete} />
        )}

        {showQuiz && !showResults && (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Question 1/10</h2>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Time remaining: 30s</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '10%' }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg">
                Fill in the blank to complete the statement about Python's execution process: 
                Python is an example of a __________ language, meaning it is executed line-by-line 
                by an interpreter.
              </p>

              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Type your answer..."
              />

              <button
                onClick={() => handleQuizComplete(100)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-6">Your Score: {score}%</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuizPopup;
