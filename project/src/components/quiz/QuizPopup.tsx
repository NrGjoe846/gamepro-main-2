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
    { type: 'fill', question: "Python is an example of a __________ language.", answer: "interpreted", component: FillInTheBlank },
    { type: 'multiple-choice', question: "Which is true about Python?", options: ["Python code is translated into machine code before execution.", "Python code is executed line-by-line by an interpreter.","Python requires a separate compilation step to run"], answer: "Interpreted", component: MultipleChoiceQuestion },
    { type: 'true-false', question: "Python is compiled.", options: ["True", "False"], answer: "False", component: TrueFalseQuestion },
    { type: 'unscramble', question: "Unscramble the words:", options: ['line-by-line', 'executed', 'Python', 'is', 'code', 'by', 'an', 'interpreter'], answer: ['Python', 'code', 'is', 'executed', 'line-by-line', 'by', 'an', 'interpreter'], component: DragDropQuestion },
    { type: 'multiple-choice', question: "What does Python require to run?", options: ["Compiler", "Interpreter"], answer: "Interpreter", component: MultipleChoiceQuestion },
    { type: 'match', question: "Match the languages with execution type:", options: [{ term: "Python", match: "Interpreter" }, { term: "C++", match: "Compiler" }], component: MatchQuestion },
    { type: 'multiple-selection', question: "Which are advantages of Python?", options: ["Easy debugging", "Faster execution", "Portability"], answer: ["Easy debugging", "Portability"], component: MultipleSelectionQuestion },
    { type: 'order', question: "Arrange the Python execution steps:", options: ["Write code", "Interpreter runs", "Output displayed"], answer: ["Write code", "Interpreter runs", "Output displayed"], component: OrderQuestion },
    { type: 'code-correction', question: "Fix the syntax error in the following code:", options: ["print 'Hello World'", "print('Hello World')"], answer: "print('Hello World')", component: CodeCorrectionQuestion },
    { type: 'translate', question: "Translate this Python print statement to Java:", options: ["System.out.println('Hello');", "console.log('Hello');"], answer: "System.out.println('Hello');", component: TranslateCodeQuestion }
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
