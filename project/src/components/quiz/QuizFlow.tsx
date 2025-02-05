import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Trophy, Timer } from 'lucide-react';
import FlashCards from './FlashCards';
import { 
  FillBlank, MultipleChoice, TrueFalse, WordScramble,
  MatchOutput, MultipleSelection, Ordering, CodeCorrection 
} from './QuizTypes';

interface QuizFlowProps {
  flashcards: Array<{ front: string; back: string }>;
  questions: Array<any>;
  onComplete: (score: number) => void;
  moduleTitle: string;
}

const QuizFlow: React.FC<QuizFlowProps> = ({ flashcards, questions, onComplete, moduleTitle }) => {
  const [showFlashcards, setShowFlashcards] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleStartQuiz = () => {
    setShowFlashcards(false);
  };

  const handleAnswer = (answer: any) => {
    const question = questions[currentQuestionIndex];
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(prev => prev + 100);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsCorrect(null);
        setShowExplanation(false);
      } else {
        onComplete(score);
      }
    }, 2000);
  };

  const renderQuestion = (question: any) => {
    const props = {
      ...question,
      onAnswer: handleAnswer,
      isCorrect,
      showExplanation
    };

    switch (question.type) {
      case 'fill-blank':
        return <FillBlank {...props} />;
      case 'multiple-choice':
        return <MultipleChoice {...props} />;
      case 'true-false':
        return <TrueFalse {...props} />;
      case 'word-scramble':
        return <WordScramble {...props} />;
      case 'match-output':
        return <MatchOutput {...props} />;
      case 'multiple-selection':
        return <MultipleSelection {...props} />;
      case 'ordering':
        return <Ordering {...props} />;
      case 'code-correction':
        return <CodeCorrection {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[600px] max-h-[80vh] overflow-y-auto">
      <div className="sticky top-0 bg-[#1a1a2e] p-4 border-b border-white/10 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{moduleTitle}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{score} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-400" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {showFlashcards ? (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FlashCards cards={flashcards} />
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Quiz
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {renderQuestion(questions[currentQuestionIndex])}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  <p className="text-gray-300">
                    {questions[currentQuestionIndex].explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizFlow;
