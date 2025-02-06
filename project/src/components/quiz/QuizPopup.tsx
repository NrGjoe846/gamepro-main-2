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

  const questions =[
  {
    "question": "Fill in the blank to complete the statement about Python's execution process: Python is an example of a __________ language, meaning it is executed line-by-line by an interpreter.",
    "answer": "interpreted",
    "options": ["compiled", "interpreted", "assembled", "translated"]
  },
  {
    "question": "Which of the following is true about Python compared to compiled languages?",
    "answer": "Python code is executed line-by-line by an interpreter.",
    "options": [
      "Python code is translated into machine code before execution.",
      "Python code is executed line-by-line by an interpreter.",
      "Python requires a separate compilation step to run.",
      "Python does not need an interpreter."
    ]
  },
  {
    "question": "Python is a compiled language, meaning the entire program is converted into machine code before execution.",
    "answer": "False",
    "options": ["True", "False"]
  },
  {
    "question": "Unscramble the words to form a correct statement about Python's execution:\n\n'line-by-line', 'executed', 'Python', 'is', 'code', 'by', 'an', 'interpreter'.",
    "answer": "Python code is executed line-by-line by an interpreter.",
    "options": [
      "Python code is executed line-by-line by an interpreter.",
      "An interpreter executes Python code line-by-line.",
      "Executed line-by-line is Python code by an interpreter."
    ]
  },
  {
    "question": "What is the main difference between Python and a compiled language like C++?",
    "answer": "Python requires an interpreter to run.",
    "options": [
      "Python requires an interpreter to run.",
      "Python requires a compiler to run.",
      "Python does not need any translation step."
    ]
  },
  {
    "question": "Match the language to whether it uses an interpreter or a compiler for execution.\n\n1. Python\n2. C++\n\nExecution Method:\nA) Interpreter\nB) Compiler",
    "answer": "1 → A) Interpreter, 2 → B) Compiler",
    "options": [
      "1 → A) Interpreter, 2 → B) Compiler",
      "1 → B) Compiler, 2 → A) Interpreter"
    ]
  },
  {
    "question": "Which of the following are advantages of interpreted languages like Python? (Select all that apply)",
    "answer": ["Easier to debug", "Portability across different platforms"],
    "options": ["Easier to debug", "Faster execution", "Portability across different platforms"]
  },
  {
    "question": "Arrange the steps in the correct order for Python execution:\n\n1. Python code is written and saved in a .py file.\n2. The interpreter reads and executes the code line-by-line.\n3. The output is displayed on the screen.",
    "answer": "1 → 2 → 3",
    "options": [
      "1 → 2 → 3",
      "2 → 3 → 1",
      "3 → 1 → 2"
    ]
  },
  {
    "question": "What is wrong with this statement about Python?\n\nStatement: Python code is compiled into machine code before execution.",
    "answer": "Python code is not compiled.",
    "options": [
      "Python code is not compiled.",
      "Python code is compiled into bytecode.",
      "Python code is executed by an interpreter."
    ]
  },
  {
    "question": "Complete the code to demonstrate Python's execution process.\n\nOutput: 'Python is an interpreted language!'\n\nprint(___)",
    "answer": "print(\"Python is an interpreted language!\")",
    "options": [
      "print(\"Python is an interpreted language!\")",
      "echo \"Python is an interpreted language!\"",
      "console.log(\"Python is an interpreted language!\")"
    ]
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
