import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import ScoreCard from '../aptitude/ScoreCard';

// Import JSON files for all courses
import pythonQuestionsData from '../../data/quizzes/pythonBasics.json';
import javaQuestionsData from '../../data/quizzes/javaBasics.json';
import cQuestionsData from '../../data/quizzes/cBasics.json';

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

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  language: 'python' | 'java' | 'c';
  currentTopic?: string;
  currentSubtopic?: string;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  language,
  currentTopic,
  currentSubtopic 
}) => {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (isOpen) {
      const questionsData = getQuestionsData();
      const relevantQuestions = findRelevantQuestions(questionsData);
      // Shuffle questions randomly
      const shuffledQuestions = relevantQuestions.sort(() => Math.random() - 0.5);
      // Take first 5 questions or all if less than 5
      setQuestions(shuffledQuestions.slice(0, 5));
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
      setScore(0);
      setCorrectAnswers(0);
    }
  }, [isOpen, language, currentTopic, currentSubtopic]);

  const getQuestionsData = () => {
    switch (language) {
      case 'python':
        return pythonQuestionsData;
      case 'java':
        return javaQuestionsData;
      case 'c':
        return cQuestionsData;
      default:
        return [];
    }
  };

  const findRelevantQuestions = (questionsData: any[]): any[] => {
    if (!currentTopic || !currentSubtopic) return [];

    for (const phaseData of questionsData) {
      for (const topicData of phaseData.topics) {
        if (topicData.topic.includes(currentTopic)) {
          for (const subtopicData of topicData.subtopics) {
            if (subtopicData.subtopic.includes(currentSubtopic) && subtopicData.questionsData) {
              // Add topic and subtopic context to each question
              return subtopicData.questionsData.map(question => ({
                ...question,
                topic: topicData.topic,
                subtopic: subtopicData.subtopic
              }));
            }
          }
        }
      }
    }
    return [];
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (Array.isArray(q.answer)) {
        const userAnswer = answers[index];
        const isCorrect =
          Array.isArray(userAnswer) &&
          userAnswer.length === q.answer.length &&
          userAnswer.every((ans: any, i: number) => ans === q.answer[i]);
        if (isCorrect) correct++;
      } else {
        if (answers[index] === q.answer) correct++;
      }
    });
    setCorrectAnswers(correct);
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore);
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleCloseScoreCard = () => {
    onClose();
  };

  if (!isOpen) return null;

  if (!questions || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full m-4">
          <div className="text-center">
            <p className="text-xl mb-4">No questions available for this topic yet.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    return (
      <ScoreCard
        totalQuestions={questions.length}
        correctAnswers={correctAnswers}
        onClose={handleCloseScoreCard}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const QuestionComponent = componentMap[currentQuestion.component];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <DndProvider backend={HTML5Backend}>
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-bold">{currentTopic}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {currentSubtopic}
            </p>
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
        </motion.div>
      </DndProvider>
    </motion.div>
  );
};

export default QuizPopup;
