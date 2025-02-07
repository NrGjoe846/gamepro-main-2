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
    { type: 'fill', question: "Python is an example of a __________ language.", answer: "interpreted" },
    { type: 'multiple-choice', question: "Which is true about Python?", options: ["Compiled", "Interpreted"], answer: "Interpreted" },
    { type: 'true-false', question: "Python is compiled.", options: ["True", "False"], answer: "False" },
    { type: 'unscramble', question: "Unscramble the words:", options: ['line-by-line', 'executed', 'Python', 'is', 'code', 'by', 'an', 'interpreter'], answer: ['Python', 'code', 'is', 'executed', 'line-by-line', 'by', 'an', 'interpreter'] },
    { type: 'multiple-choice', question: "What does Python require to run?", options: ["Compiler", "Interpreter"], answer: "Interpreter" },
    { type: 'match', question: "Match the languages with execution type:", options: [{ term: "Python", match: "Interpreter" }, { term: "C++", match: "Compiler" }] },
    { type: 'multiple-selection', question: "Which are advantages of Python?", options: ["Easy debugging", "Faster execution", "Portability"], answer: ["Easy debugging", "Portability"] },
    { type: 'order', question: "Arrange the Python execution steps:", options: ["Write code", "Interpreter runs", "Output displayed"], answer: ["Write code", "Interpreter runs", "Output displayed"] },
    { type: 'code-correction', question: "Fix the syntax error in the following code:", options: ["print 'Hello World'", "print('Hello World')"], answer: "print('Hello World')" },
    { type: 'translate', question: "Translate this Python print statement to Java:", options: ["System.out.println('Hello');", "console.log('Hello');"], answer: "System.out.println('Hello');" }
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
          {!showResults ? (
            <div className="space-y-6">
              {currentQuestion.type === 'multiple-choice' ? (
                <MultipleChoiceQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'true-false' ? (
                <TrueFalseQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'translate' ? (
                <TranslateCodeQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'multiple-selection' ? (
                <MultipleSelectionQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'code-correction' ? (
                <CodeCorrectionQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'match' ? (
                <MatchQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'fill' ? (
                <FillQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'unscramble' ? (
                <DragDropQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'order' ? (
                <OrderQuestion question={currentQuestion} onAnswer={handleAnswer} />
              ) : (
                <p className="text-lg font-semibold">{currentQuestion.question}</p>
              )}
              <button onClick={handleNext} className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300">
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Trophy className="mx-auto w-12 h-12 text-yellow-400" />
              <p className="text-lg font-semibold">Quiz Completed!</p>
              <p className="text-2xl font-bold">{score}%</p>
              <button onClick={onClose} className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300">
                Close
              </button>
            </div>
          )}
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default QuizPopup;
