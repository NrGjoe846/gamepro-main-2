import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
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
import PythonFlashCards from './flashcards/PythonFlashCards';

// Import Python questions data
import pythonQuestionsData from '../../data/quizzes/pythonBasics.json';

// Map of question types to their respective components
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
  'FillInTheBlank': FillInTheBlank,
};

interface PythonQuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const PythonQuizPopup: React.FC<PythonQuizPopupProps> = ({ isOpen, onClose, onComplete }) => {
  const [showFlashCards, setShowFlashCards] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowFlashCards(true);
    }
  }, [isOpen]);

  // Find all questions across all phases, topics, and subtopics
  const findAllQuestions = () => {
    const allQuestions: any[] = [];
    pythonQuestionsData.forEach(phaseData => {
      phaseData.topics.forEach(topicData => {
        topicData.subtopics.forEach(subtopicData => {
          if (subtopicData.questionsData) {
            allQuestions.push(...subtopicData.questionsData);
          }
        });
      });
    });
    return allQuestions;
  };

  const questions = findAllQuestions();

  const handleFlashCardsComplete = () => {
    setShowFlashCards(false);
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

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
        const isCorrect =
          Array.isArray(userAnswer) &&
          userAnswer.length === q.answer.length &&
          userAnswer.every((ans: any, i: number) => ans === q.answer[i]);
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

  if (!isOpen) return null;

  if (showFlashCards) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-4xl w-full m-4">
          <PythonFlashCards onComplete={handleFlashCardsComplete} />
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const QuestionComponent = componentMap[currentQuestion?.component];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          {!showResults ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold">Python Quiz</h2>
                <p className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              {QuestionComponent && (
                <QuestionComponent question={currentQuestion} onAnswer={handleAnswer} />
              )}
              <button
                onClick={handleNext}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors w-full"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-xl mb-6">Your score: {score}%</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default PythonQuizPopup;