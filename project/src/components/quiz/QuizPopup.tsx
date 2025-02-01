import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Check, X, ChevronRight, Award, Star } from 'lucide-react';
import { useWindowSize } from 'react-use';

interface QuizQuestion {
  type: 'fill-blank' | 'multiple-choice' | 'true-false' | 'word-scramble' | 'code-correction';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  code?: string;
}

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  moduleTitle: string;
}

const questions: QuizQuestion[] = [
  {
    type: 'fill-blank',
    question: 'Fill in the blank to print "Hello, World!" in Python.',
    code: 'print(___)',
    answer: '("Hello, World!")',
    explanation: 'In Python, we use print() function with text in quotes to display output.'
  },
  {
    type: 'multiple-choice',
    question: 'Which of the following will print Hello, World! in Python?',
    options: [
      'echo "Hello, World!"',
      'print("Hello, World!")',
      'println("Hello, World!")'
    ],
    answer: 'print("Hello, World!")',
    explanation: 'print() is the correct Python function for displaying output.'
  },
  {
    type: 'true-false',
    question: 'In Python, the print() function can be used to display text on the screen.',
    options: ['True', 'False'],
    answer: 'True',
    explanation: 'print() is indeed used to display text output in Python.'
  },
  {
    type: 'code-correction',
    question: 'What is wrong with this Python code?',
    code: 'print(Hello, World)',
    options: [
      'The string is not enclosed in quotes',
      'The print function needs to be lowercase',
      'The parentheses are incorrect'
    ],
    answer: 'The string is not enclosed in quotes',
    explanation: 'String literals in Python must be enclosed in quotes.'
  }
];

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const { width, height } = useWindowSize();

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (completedQuestions.length === questions.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [completedQuestions]);

  const handleAnswer = () => {
    const correct = userAnswer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setStreak(prev => prev + 1);
      setScore(prev => prev + (100 * (streak + 1)));
      
      setTimeout(() => {
        setCompletedQuestions(prev => [...prev, currentQuestionIndex]);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
        setUserAnswer('');
        setIsCorrect(null);
        setShowExplanation(false);
      }, 1500);
    } else {
      setStreak(0);
      setTimeout(() => {
        setUserAnswer('');
        setIsCorrect(null);
        setShowExplanation(false);
      }, 1500);
    }
  };

  const cardVariants = {
    initial: { x: 0, opacity: 0, scale: 0.8 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: (isCorrect: boolean) => ({
      x: isCorrect ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5 }
    })
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
            className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 m-4"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center">{moduleTitle}</h2>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold">{score}</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">
                    Streak: {streak}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={isCorrect}
                className={`relative backdrop-blur-xl bg-white/10 rounded-xl p-6 border ${
                  isCorrect === null
                    ? 'border-white/20'
                    : isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
                } transition-colors duration-300`}
              >
                {/* Question */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                  {currentQuestion.code && (
                    <pre className="bg-black/30 p-4 rounded-lg mb-4 font-mono text-sm">
                      {currentQuestion.code}
                    </pre>
                  )}
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options ? (
                    currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUserAnswer(option)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                          userAnswer === option
                            ? 'bg-blue-500/30 border-blue-500'
                            : 'bg-white/5 hover:bg-white/10 border-transparent'
                        } border`}
                      >
                        {option}
                      </motion.button>
                    ))
                  ) : (
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnswer}
                  disabled={!userAnswer}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Submit Answer
                </motion.button>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className={`mt-6 p-4 rounded-lg ${
                        isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">
                          {isCorrect ? 'Correct!' : 'Incorrect!'}
                        </span>
                      </div>
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="mt-8 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedQuestions.length / questions.length) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Quiz Complete */}
            <AnimatePresence>
              {completedQuestions.length === questions.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 backdrop-blur-xl bg-black/90 rounded-2xl flex flex-col items-center justify-center"
                >
                  <Award className="w-16 h-16 text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
                  <p className="text-gray-400 mb-6">You've completed the quiz!</p>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{score}</div>
                      <div className="text-sm text-gray-400">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        {Math.round((completedQuestions.length / questions.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold"
                  >
                    Continue Learning
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizPopup;
