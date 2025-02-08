import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';

import DragDropQuestion from './DragDropQuestion';
import MatchQuestion from './MatchQuestion';
import FillQuestion from './FillQuestion';
import OrderQuestion from './OrderQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import TranslateCodeQuestion from './TranslateCodeQuestion';
import MultipleSelectionQuestion from './MultipleSelectionQuestion';
import CodeCorrectionQuestion from './CodeCorrectionQuestion';
import FillInTheBlank from './FillInTheBlank';

const QuizPopup = ({ isOpen, onClose, onComplete }) => {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [isOpen]);

const questions = [
  { 
    type: 'fill', 
    question: "Python is an example of a __________ language, meaning it is executed line-by-line by an interpreter.", 
    answer: "interpreted", 
    component: FillInTheBlank 
  },
  { 
    type: 'multiple-choice', 
    question: "Which of the following is true about Python compared to compiled languages?", 
    options: [
      "Python code is translated into machine code before execution.", 
      "Python code is executed line-by-line by an interpreter.", 
      "Python requires a separate compilation step to run."
    ], 
    answer: "Python code is executed line-by-line by an interpreter.", 
    component: MultipleChoiceQuestion 
  },
  { 
    type: 'true-false', 
    question: "Python is a compiled language, meaning the entire program is converted into machine code before execution.", 
    answer: "False", 
    component: TrueFalseQuestion 
  },
 { 
  type: 'unscramble', 
  question: "Unscramble the words to form a correct statement about Python's execution:", 
  options: ['line-by-line', 'executed', 'Python', 'is', 'code', 'by', 'an', 'interpreter'], 
  answer: ['Python', 'code', 'is', 'executed', 'line-by-line', 'by', 'an', 'interpreter'], 
  component: DragDropQuestion 
},

  { 
    type: 'multiple-choice', 
    question: "What is the main difference between Python and a compiled language like C++?", 
    options: [
      "Python requires an interpreter to run.", 
      "Python requires a compiler to run.", 
      "Python does not need any translation step."
    ], 
    answer: "Python requires an interpreter to run.", 
    component: MultipleChoiceQuestion 
  },
  { 
    type: 'match', 
    question: "Match the language to whether it uses an interpreter or a compiler for execution:", 
    options: [
      { term: "Python", match: "Interpreter" }, 
      { term: "C++", match: "Compiler" }
    ], 
    component: MatchQuestion 
  },
  { 
    type: 'multiple-selection', 
    question: "Which of the following are advantages of interpreted languages like Python? (Select all that apply)", 
    options: [
      "Easier to debug", 
      "Faster execution", 
      "Portability across different platforms"
    ], 
    answer: ["Easier to debug", "Portability across different platforms"], 
    component: MultipleSelectionQuestion 
  },
  { 
    type: 'order', 
    question: "Arrange the steps in the correct order for Python execution:", 
    options: [
      "Python code is written and saved in a .py file.", 
      "The interpreter reads and executes the code line-by-line.", 
      "The output is displayed on the screen."
    ], 
    correctOrder: [
      "Python code is written and saved in a .py file.", 
      "The interpreter reads and executes the code line-by-line.", 
      "The output is displayed on the screen."
    ], 
    component: OrderQuestion 
  },
  { 
    type: 'code-correction', 
    question: "What is wrong with this statement about Python?\n\n\nPython code is compiled into machine code before execution.", 
    options: [
      "Python code is not compiled.", 
      "Python code is compiled into bytecode.", 
      "Python code is executed by an interpreter."
    ], 
    answer: "Python code is not compiled.", 
    component: CodeCorrectionQuestion 
  },
  { 
    type: 'fill', 
    question: "Complete the code to demonstrate Python's execution process.\n\nOutput: `Python is an interpreted language!`", 
    answer: "print(\"Python is an interpreted language!\")", 
    component: FillInTheBlank 
  }
];



  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (Array.isArray(q.answer)) {
        const userAnswer = answers[index];
        const isCorrect = Array.isArray(userAnswer) && userAnswer.every((ans, i) => ans === q.answer[i]);
        if (isCorrect) correctAnswers++;
      } else {
        if (answers[index] === q.answer) correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    onComplete(finalScore);
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  if (!isOpen) return null;
  const currentQuestion = questions[currentQuestionIndex] || {};
  const QuestionComponent = currentQuestion.component;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
          {!showResults ? (
            <>
              <QuestionComponent question={currentQuestion} onAnswer={handleAnswer} />
              <button onClick={handleNext} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Next</button>
            </>
          ) : <div className="text-center">Quiz Completed!</div>}
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default QuizPopup;
