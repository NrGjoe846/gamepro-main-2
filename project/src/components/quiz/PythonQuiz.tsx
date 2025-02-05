import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizCard from './QuizCard';
import { Trophy, Star } from 'lucide-react';
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
  },
  {
    "type": "word-scramble",
    "question": "Unscramble the words to create a Python statement that prints 'Hello, World!'.",
    "options": ["World!", "Hello", "(\"", "print", "\")"],
    "answer": "print(\"Hello, World!\")",
    "explanation": "Rearranging the words correctly forms a valid Python print statement."
  },
  {
    "type": "multiple-choice",
    "question": "What will the following Python code output?",
    "code": "print(\"Welcome to Python!\")",
    "options": [
      "Welcome",
      "to Python",
      "Welcome to Python!"
    ],
    "answer": 2,
    "explanation": "The print function outputs exactly what is inside the quotes."
  },
  {
    "type": "match-the-output",
    "question": "Match the code with its output:",
    "code": {
      "1": "print(\"Hello\")",
      "2": "print(\"Hi!\")"
    },
    "options": {
      "a": "Hi!",
      "b": "Hello"
    },
    "answer": {"1": "b", "2": "a"},
    "explanation": "Each print statement outputs its respective text."
  },
  {
    "type": "multiple-selection",
    "question": "Which of the following are valid Python print() statements?",
    "options": [
      "print(\"Hello, World!\")",
      "print(\"Goodbye)",
      "print(Hello)"
    ],
    "answer": [0],
    "explanation": "Only the first option is correct; the others have syntax errors."
  },
  {
    "type": "ordering",
    "question": "Arrange the steps in the correct order to run a Python program:",
    "options": [
      "Open Python interpreter or IDE",
      "Type print(\"Hello, World!\")",
      "Press Enter/Run"
    ],
    "answer": [0, 1, 2],
    "explanation": "The steps should be followed in this order to run a Python program."
  },
  {
    "type": "code-correction",
    "question": "What is wrong with this Python code?",
    "code": "print(Hello, World)",
    "options": [
      "The string is not enclosed in quotes",
      "The print function needs to be lowercase",
      "The parentheses are incorrect"
    ],
    "answer": 0,
    "explanation": "String literals in Python must be enclosed in quotes."
  },
  {
    "type": "fill-blank",
    "question": "Complete the code to display: Python is fun!",
    "code": "print(___)",
    "answer": "\"Python is fun!\"",
    "explanation": "Strings must be enclosed in quotes inside print()."
  }
];

const PythonQuiz = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { width, height } = useWindowSize();

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < pythonQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const score = calculateScore();
      setShowResults(true);
      onComplete(score);
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
  const isCorrect = currentAnswer === currentQuestion.answer;

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
    </div>
  );
};

export default PythonQuiz;
