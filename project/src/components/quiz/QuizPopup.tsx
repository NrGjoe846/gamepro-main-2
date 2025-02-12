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
import questionsData from "../../data/quizzes/pythonBasics.json";


const componentMap = {
  'DragDropQuestion': DragDropQuestion,
  'MatchQuestion': MatchQuestion,
  'FillQuestion': FillQuestion,
  'OrderQuestion': OrderQuestion,
  'MultipleChoiceQuestion': MultipleChoiceQuestion,
  'TrueFalseQuestion': TrueFalseQuestion,
  'TranslateCodeQuestion': TranslateCodeQuestion,
  'MultipleSelectionQuestion': MultipleSelectionQuestion,
  'CodeCorrectionQuestion': CodeCorrectionQuestion,
  'FillInTheBlank': FillInTheBlank
};

const QuizPopup = ({ isOpen, onClose, onComplete }) => {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const { width, height } = useWindowSize();
  const questions = questionsData.questionsData;

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [isOpen]);

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
  const QuestionComponent = componentMap[currentQuestion.component];

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
          ) : <div className="text-center">Quiz Completed! Your score: {score}%</div>}
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default QuizPopup;
