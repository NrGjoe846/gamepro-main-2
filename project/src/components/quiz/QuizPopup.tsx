import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropQuestion from './DragDropQuestion';
import MatchQuestion from './MatchQuestion';
import { useState, useEffect } from 'react';

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
    { type: 'unscramble', question: "Unscramble the words:", options: ['Python', 'is', 'executed', 'line-by-line'], answer: ['Python', 'is', 'executed', 'line-by-line'] },
    { type: 'multiple-choice', question: "What is Python?", options: ["Compiled", "Interpreted"], answer: "Interpreted" },
    { type: 'match', question: "Match terms:", options: [{ term: "Python", match: "Interpreter" }, { term: "C++", match: "Compiler" }] },
    { type: 'true-false', question: "Python is compiled.", options: ["True", "False"], answer: "False" },
    { type: 'unscramble', question: "Unscramble the statement:", options: ['JavaScript', 'is', 'event-driven'], answer: ['JavaScript', 'is', 'event-driven'] },
    { type: 'multiple-choice', question: "Which language is used for AI?", options: ["Python", "HTML"], answer: "Python" },
    { type: 'match', question: "Match the paradigms:", options: [{ term: "OOP", match: "Java" }, { term: "Functional", match: "Haskell" }] },
    { type: 'true-false', question: "C is an object-oriented language.", options: ["True", "False"], answer: "False" },
    { type: 'match', question: "Match database types:", options: [{ term: "SQL", match: "Relational" }, { term: "MongoDB", match: "NoSQL" }] },
    { type: 'unscramble', question: "Unscramble the term:", options: ['Machine', 'Learning', 'is', 'powerful'], answer: ['Machine', 'Learning', 'is', 'powerful'] },
  ];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (Array.isArray(q.answer)) {
        const userAnswer = answers[index];
        const isCorrect = Array.isArray(userAnswer) &&
          userAnswer.length === q.answer.length &&
          userAnswer.every((ans, i) => ans === q.answer[i]);
        if (isCorrect) correctAnswers++;
      } else {
        if (answers[index] === q.answer) correctAnswers++;
      }
    });

    setScore(Math.round((correctAnswers / questions.length) * 100));
    setShowResults(true);
    setShowConfetti(true);
    onComplete(score);
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex] || {};
  console.log("Current Question:", currentQuestion);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>

          {!showResults && (
            <div className="space-y-6">
              {currentQuestion.type === 'match' ? (
                <MatchQuestion key={currentQuestionIndex} question={currentQuestion} onAnswer={handleAnswer} />
              ) : (
                <DragDropQuestion key={currentQuestionIndex} question={currentQuestion} onAnswer={handleAnswer} />
              )}

              <button onClick={handleNext} className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300">
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default QuizPopup;
