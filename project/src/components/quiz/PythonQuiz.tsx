import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import QuizCard from './QuizCard';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const pythonQuestions = [
  {
    "type": "fill-blank",
    "question": "Fill in the blank to print 'Hello, World!' in Python.",
    "code": "print(___)",
    "answer": "\"Hello, World!\"",
    "explanation": "In Python, we use print() with text in quotes to display output."
  },
  {
    "type": "multiple-choice",
    "question": "Which of the following will print Hello, World! in Python?",
    "options": [
      "echo 'Hello, World!'",
      "print('Hello, World!')",
      "println('Hello, World!')"
    ],
    "answer": 1,
    "explanation": "print() is the correct Python function for displaying output."
  },
  {
    "type": "true-false",
    "question": "In Python, the print() function can be used to display text on the screen.",
    "answer": true,
    "explanation": "The print() function is indeed used to display text output in Python."
  }
];

const PythonQuiz = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const { width, height } = useWindowSize();

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
    setIsAnswerChecked(false);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsAnswerChecked(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < pythonQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerChecked(false);
    } else {
      const score = calculateScore();
      setShowResults(true);
      onComplete(score);
    }
  };

  const handleCheckAnswer = () => {
    if (answers[currentQuestionIndex] !== undefined) {
      setIsAnswerChecked(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === pythonQuestions[index].answer) {
        correct++;
      }
    });
    return Math.round((correct / pythonQuestions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <>
        {score >= 70 && <Confetti width={width} height={height} />}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mb-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl">Your Score: {score}%</p>
          </div>
          <div className="flex justify-center gap-4">
            <div className="p-4 bg-white/10 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-sm">XP Earned</p>
              <p className="text-xl font-bold">{score * 10}</p>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  const currentQuestion = pythonQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswerChecked && currentAnswer === currentQuestion.answer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {pythonQuestions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / pythonQuestions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / pythonQuestions.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <QuizCard
          key={currentQuestionIndex}
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          onNext={handleNext}
          isLast={currentQuestionIndex === pythonQuestions.length - 1}
        />
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckAnswer}
          disabled={!isAnswered || isAnswerChecked}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Check Answer
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default PythonQuiz;
