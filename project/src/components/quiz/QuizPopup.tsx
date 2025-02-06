import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Timer } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface QuizQuestion {
  type: string;
  question: string;
  options?: string[];
  answer: string | string[] | { [key: string]: string } | string[][];
  pairs?: { language: string; executionMethod: string }[];
  steps?: string[];
  code?: string;
  output?: string;
}

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const questions: QuizQuestion[] = [
    {
      type: "Fill in the Blank",
      question: "Fill in the blank to complete the statement about Python's execution process: Python is an example of a __________ language, meaning it is executed line-by-line by an interpreter.",
      answer: "interpreted"
    },
    {
      type: "Multiple Choice",
      question: "Which of the following is true about Python compared to compiled languages?",
      options: [
        "a) Python code is translated into machine code before execution.",
        "b) Python code is executed line-by-line by an interpreter.",
        "c) Python requires a separate compilation step to run."
      ],
      answer: "b) Python code is executed line-by-line by an interpreter."
    },
    {
      type: "True or False",
      question: "Python is a compiled language, meaning the entire program is converted into machine code before execution.",
      options: ["True", "False"],
      answer: "False"
    },
    {
      type: "Word Scramble",
      question: "Unscramble the words to form a correct statement about Python's execution: line-by-line, executed, Python, is, code, by, an, interpreter.",
      answer: "Python code is executed line-by-line by an interpreter."
    },
    {
      type: "Translate the Code",
      question: "What is the main difference between Python and a compiled language like C++?",
      options: [
        "a) Python requires an interpreter to run.",
        "b) Python requires a compiler to run.",
        "c) Python does not need any translation step."
      ],
      answer: "a) Python requires an interpreter to run."
    },
    {
      type: "Match the Output",
      question: "Match the language to whether it uses an interpreter or a compiler for execution:",
      pairs: [
        {
          language: "Python",
          executionMethod: "a) Interpreter"
        },
        {
          language: "C++",
          executionMethod: "b) Compiler"
        }
      ],
      answer: ["1 -> a) Interpreter", "2 -> b) Compiler"]
    },
    {
      type: "Multiple Selection",
      question: "Which of the following are advantages of interpreted languages like Python? (Select all that apply)",
      options: [
        "a) Easier to debug",
        "b) Faster execution",
        "c) Portability across different platforms"
      ],
      answer: [
        "a) Easier to debug",
        "c) Portability across different platforms"
      ]
    },
    {
      type: "Ordering",
      question: "Arrange the steps in the correct order for Python execution:",
      steps: [
        "1. Python code is written and saved in a .py file.",
        "2. The interpreter reads and executes the code line-by-line.",
        "3. The output is displayed on the screen."
      ],
      answer: ["1 -> 2 -> 3"]
    },
    {
      type: "Code Correction",
      question: "What is wrong with this statement about Python?",
      code: "Python code is compiled into machine code before execution.",
      options: [
        "a) Python code is not compiled.",
        "b) Python code is compiled into bytecode.",
        "c) Python code is executed by an interpreter."
      ],
      answer: "a) Python code is not compiled."
    },
    {
      type: "Fill in the Blank (Code Execution)",
      question: "Complete the code to demonstrate Python's execution process.",
      output: "Python is an interpreted language!",
      code: "print(___)",
      answer: "Python is an interpreted language!"
    }
  ];

  const handleAnswer = (answer: string | string[]) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      Array.isArray(currentQuestion.answer)
        ? selectedAnswer.every((answer: string) => currentQuestion.answer.includes(answer))
        : selectedAnswer[0] === currentQuestion.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer([]);
    } else {
      setShowResults(true);
      setShowConfetti(true);
      const finalScore = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
      onComplete(finalScore);
    }
  };

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'Multiple Choice':
      case 'Translate the Code':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer([option])}
                className={`w-full p-3 text-left rounded-lg transition-all duration-300 ${
                  selectedAnswer.includes(option)
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } border`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'Fill in the Blank':
      case 'Fill in the Blank (Code Execution)':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={selectedAnswer[0] || ''}
              onChange={(e) => handleAnswer([e.target.value])}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Type your answer..."
            />
            {question.code && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <code className="text-sm font-mono">{question.code}</code>
              </div>
            )}
          </div>
        );

      case 'True or False':
        return (
          <div className="space-y-2">
            {["True", "False"].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer([option])}
                className={`w-full p-3 text-left rounded-lg transition-all duration-300 ${
                  selectedAnswer.includes(option)
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } border`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'Multiple Selection':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const newAnswer = selectedAnswer.includes(option)
                    ? selectedAnswer.filter(a => a !== option)
                    : [...selectedAnswer, option];
                  handleAnswer(newAnswer);
                }}
                className={`w-full p-3 text-left rounded-lg transition-all duration-300 ${
                  selectedAnswer.includes(option)
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } border`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'Word Scramble':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={selectedAnswer[0] || ''}
              onChange={(e) => handleAnswer([e.target.value])}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Type your answer..."
            />
          </div>
        );

      case 'Match the Output':
        return (
          <div className="space-y-4">
            {question.pairs?.map((pair, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="flex-1">{pair.language}</span>
                <select
                  value={selectedAnswer[index] || ''}
                  onChange={(e) => {
                    const newAnswer = [...selectedAnswer];
                    newAnswer[index] = e.target.value;
                    handleAnswer(newAnswer);
                  }}
                  className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="a) Interpreter">Interpreter</option>
                  <option value="b) Compiler">Compiler</option>
                </select>
              </div>
            ))}
          </div>
        );

      case 'Ordering':
        return (
          <div className="space-y-4">
            {question.steps?.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{index + 1}.</span>
                <select
                  value={selectedAnswer[index] || ''}
                  onChange={(e) => {
                    const newAnswer = [...selectedAnswer];
                    newAnswer[index] = e.target.value;
                    handleAnswer(newAnswer);
                  }}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select step...</option>
                  {question.steps?.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
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
        className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {!showResults ? (
          <>
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

            <div className="mb-8">
              <p className="text-lg mb-6">{questions[currentQuestionIndex].question}</p>
              {renderQuestion(questions[currentQuestionIndex])}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswer.length === 0}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 rounded-lg transition-all duration-300"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-6">Your Score: {Math.round((score / questions.length) * 100)}%</p>
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
