import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, HelpCircle } from 'lucide-react';
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
import CVideo from './CVideo'; // Added import
import questionsData from "../../data/quizzes/cBasics.json";

const componentMap = {
  DragDropQuestion,
  MatchQuestion,
  FillQuestion,
  OrderQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  TranslateCodeQuestion,
  MultipleSelectionQuestion,
  CodeCorrectionQuestion,
  FillInTheBlank
};

interface CQuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  moduleTitle: string;
}

const CQuizPopup: React.FC<CQuizPopupProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showVideo, setShowVideo] = useState(false); // Added state for video
  const { width, height } = useWindowSize();

  const findQuestionsForModule = () => {
    if (!questionsData || !Array.isArray(questionsData)) {
      console.error("Error: questionsData is undefined or not an array.", questionsData);
      return [];
    }

    console.log("Finding questions for moduleTitle:", moduleTitle);

    for (const phase of questionsData) {
      for (const topic of phase.topics) {
        for (const subtopic of topic.subtopics) {
          console.log("Checking subtopic:", subtopic.subtopic);
          if (subtopic.subtopic === moduleTitle && subtopic.questionsData && subtopic.questionsData.length > 0) {
            console.log("Found matching subtopic:", subtopic.subtopic);
            return subtopic.questionsData;
          }
        }
      }
    }

    console.warn("No questions found for module:", moduleTitle);
    return [];
  };

  const questions = findQuestionsForModule();
  const currentQuestion = questions[currentQuestionIndex] || {};
  const QuestionComponent = componentMap[currentQuestion.component] || null;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const isVideoException = 
    moduleTitle === "What is C?" || 
    moduleTitle === "Setting up the C Environment (GCC, Code::Blocks, VS Code)";

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowVideo(false);
    } else if (isVideoException) {
      setShowVideo(true);
    }
  }, [isOpen, isVideoException]);

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
      if (q.answer && Array.isArray(q.answer)) {
        const userAnswer = answers[index];
        const isCorrect = Array.isArray(userAnswer) &&
          userAnswer.length === q.answer.length &&
          userAnswer.every((ans, i) => ans === q.answer[i]);
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

  const handleAnswer = (answer: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleHint = () => {
    // Add hint functionality here later
  };

  const handleVideoClose = () => {
    setShowVideo(false);
    onClose();
  };

  const handleVideoComplete = () => {
    setShowVideo(false);
    onComplete(100); // Assume 100% score for video completion, adjust as needed
  };

  if (!isOpen) return null;

  if (!questions || questions.length === 0) {
    return (
      <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full m-4 text-center">
          <p className="text-xl mb-4 text-white">No questions available for this module yet.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {!showResults && !showVideo ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{moduleTitle}</h2>
                <p className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {QuestionComponent && <QuestionComponent question={currentQuestion} onAnswer={handleAnswer} />}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleHint}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-5 h-5" /> Hint
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          ) : showResults ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-white">Quiz Completed!</h2>
              <p className="text-xl mb-6 text-white">Your score: {score}%</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : null}
        </motion.div>

        <CVideo
          isOpen={showVideo}
          onClose={handleVideoClose}
          onComplete={handleVideoComplete}
          moduleTitle={moduleTitle}
        />
      </DndProvider>
    </motion.div>
  );
};

export default CQuizPopup;
