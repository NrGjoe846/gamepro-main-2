import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const { width, height } = useWindowSize();

  const questions = [
    {
      question: "Fill in the blank to complete the statement about Python's execution process: Python is an example of a __________ language, meaning it is executed line-by-line by an interpreter.",
      answer: "interpreted",
      options: ["compiled", "interpreted", "assembled", "translated"]
    },
    {
      question: "What is the primary purpose of Python's interpreter?",
      answer: "Execute code line by line",
      options: ["Execute code line by line", "Convert code to machine language", "Debug code", "Format code"]
    },
    {
      question: "Which statement best describes Python's execution model?",
      answer: "Code is executed directly by the interpreter",
      options: ["Code is compiled before execution", "Code is executed directly by the interpreter", "Code is converted to assembly", "Code is translated to C++"]
    }
  ];

  const handleFlashCardsComplete = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (quizScore: number) => {
    setScore(quizScore);
    setShowResults(true);
    setShowConfetti(true);
    onComplete(quizScore);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete(calculateScore());
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].answer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
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
                <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Time remaining: 30s</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg">
                {questions[currentQuestionIndex].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-3 text-left rounded-lg transition-all ${
                      answers[currentQuestionIndex] === option
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    } border`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentQuestionIndex === 0
                      ? 'bg-white/5 text-white/50 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
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
