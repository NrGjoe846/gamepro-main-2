import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import QuizCard from './QuizCard';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const pythonQuestions = [
  {
    "type": "fill-blank",
    "question": "Fill in the blank to complete the statement about Python's execution process: Python is an example of a __________ language, meaning it is executed line-by-line by an interpreter.",
    "code": "Python is an example of a ___ language, meaning it is executed line-by-line by an interpreter.",
    "answer": "interpreted",
    "explanation": "Python is an interpreted language, meaning the code is executed line-by-line by an interpreter."
  },
  {
    "type": "multiple-choice",
    "question": "Which of the following is true about Python compared to compiled languages?",
    "options": [
      "a) Python code is translated into machine code before execution.",
      "b) Python code is executed line-by-line by an interpreter.",
      "c) Python requires a separate compilation step to run."
    ],
    "answer": 1,
    "explanation": "Python code is executed line-by-line by an interpreter, unlike compiled languages that require a separate compilation step."
  },
  {
    "type": "true-false",
    "question": "Python is a compiled language, meaning the entire program is converted into machine code before execution.",
    "answer": false,
    "explanation": "Python is an interpreted language, not a compiled one. The code is executed line-by-line."
  },
  {
    "type": "word-scramble",
    "question": "Unscramble the words to form a correct statement about Python's execution: `line-by-line`, `executed`, `Python`, `is`, `code`, `by`, `an`, `interpreter`.",
    "answer": "Python code is executed line-by-line by an interpreter.",
    "explanation": "This is the correct order of the words to form the statement that describes Python's execution method."
  },
  {
    "type": "multiple-choice",
    "question": "What is the main difference between Python and a compiled language like C++?",
    "options": [
      "a) Python requires an interpreter to run.",
      "b) Python requires a compiler to run.",
      "c) Python does not need any translation step."
    ],
    "answer": 0,
    "explanation": "Python requires an interpreter to run, while C++ requires a compiler."
  },
  {
    "type": "match-output",
    "question": "Match the language to whether it uses an interpreter or a compiler for execution:",
    "pairs": [
      { "language": "Python", "executionMethod": "Interpreter" },
      { "language": "C++", "executionMethod": "Compiler" }
    ],
    "answer": [
      { "language": "Python", "executionMethod": "Interpreter" },
      { "language": "C++", "executionMethod": "Compiler" }
    ],
    "explanation": "Python uses an interpreter for execution, while C++ is a compiled language."
  },
  {
    "type": "multiple-selection",
    "question": "Which of the following are advantages of interpreted languages like Python? (Select all that apply)",
    "options": [
      "a) Easier to debug",
      "b) Faster execution",
      "c) Portability across different platforms"
    ],
    "answer": [0, 2],
    "explanation": "Interpreted languages like Python tend to be easier to debug and more portable across different platforms."
  },
  {
    "type": "ordering",
    "question": "Arrange the steps in the correct order for Python execution:",
    "steps": [
      "1. Python code is written and saved in a .py file.",
      "2. The interpreter reads and executes the code line-by-line.",
      "3. The output is displayed on the screen."
    ],
    "answer": [0, 1, 2],
    "explanation": "This is the correct sequence of events in Python code execution."
  },
  {
    "type": "code-correction",
    "question": "What is wrong with this statement about Python?",
    "code": "Python code is compiled into machine code before execution.",
    "options": [
      "a) Python code is not compiled.",
      "b) Python code is compiled into bytecode.",
      "c) Python code is executed by an interpreter."
    ],
    "answer": 0,
    "explanation": "Python is an interpreted language, meaning it is not compiled into machine code but executed directly by an interpreter."
  },
  {
    "type": "fill-blank",
    "question": "Complete the code to demonstrate Python's execution process. Output: 'Python is an interpreted language!'",
    "code": "print(___)",
    "answer": "\"Python is an interpreted language!\"",
    "explanation": "In Python, the print() function is used to output text to the screen."
  },
  {
    "type": "multiple-choice",
    "question": "What is the correct way to declare a variable in Python?",
    "options": [
      "var x = 5",
      "x = 5",
      "dim x = 5"
    ],
    "answer": 1,
    "explanation": "In Python, variables are declared by simply assigning a value using the = operator."
  },
  {
    "type": "fill-blank",
    "question": "Fill in the blank: To create a list in Python, we use _____ brackets.",
    "code": "my_list = ___ 1, 2, 3 ___",
    "answer": "[]",
    "explanation": "Square brackets [] are used to create lists in Python."
  },
  {
    "type": "true-false",
    "question": "In Python, indentation is optional and doesn't affect the code structure.",
    "answer": false,
    "explanation": "Indentation is crucial in Python as it defines code blocks and structure. Incorrect indentation will result in errors."
  },
  {
    "type": "multiple-choice",
    "question": "Which of the following is the correct way to write a comment in Python?",
    "options": [
      "// This is a comment",
      "/* This is a comment */",
      "# This is a comment"
    ],
    "answer": 2,
    "explanation": "In Python, single-line comments start with the # symbol."
  },
  {
    "type": "code-correction",
    "question": "What is wrong with this Python code?",
    "code": "if x = 5:\n    print(x)",
    "options": [
      "The indentation is incorrect",
      "The comparison operator should be == not =",
      "The print statement is wrong"
    ],
    "answer": 1,
    "explanation": "In Python, = is the assignment operator. For comparison, we use ==."
  },
  {
    "type": "multiple-choice",
    "question": "What is the output of this code: print(type(5.0))?",
    "options": [
      "<class 'int'>",
      "<class 'float'>",
      "<class 'number'>"
    ],
    "answer": 1,
    "explanation": "5.0 is a floating-point number, so type(5.0) returns <class 'float'>."
  },
  {
    "type": "fill-blank",
    "question": "To convert a string to an integer in Python, we use the _____ function.",
    "code": "num = _____(\"5\")",
    "answer": "int",
    "explanation": "The int() function converts a string representation of a number to an integer."
  },
  {
    "type": "multiple-choice",
    "question": "Which method is used to add an item to the end of a list in Python?",
    "options": [
      "list.add(item)",
      "list.append(item)",
      "list.insert(item)"
    ],
    "answer": 1,
    "explanation": "The append() method is used to add an item to the end of a list in Python."
  },
  {
    "type": "true-false",
    "question": "In Python, strings are immutable data types.",
    "answer": true,
    "explanation": "Strings in Python are immutable, meaning once created, their contents cannot be changed."
  },
  {
    "type": "multiple-choice",
    "question": "What is the result of 3 ** 2 in Python?",
    "options": [
      "6",
      "9",
      "5"
    ],
    "answer": 1,
    "explanation": "The ** operator in Python represents exponentiation. 3 ** 2 equals 3 squared, which is 9."
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
          <motion.div 
            className="h-full bg-blue-500" 
            initial={{ width: 0 }} 
            animate={{ width: `${((currentQuestionIndex + 1) / pythonQuestions.length) * 100}%` }} 
          />
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
