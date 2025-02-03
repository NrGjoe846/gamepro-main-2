import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FlashCards from './FlashCards';
import { 
  FillBlank, MultipleChoice, TrueFalse, WordScramble,
  MatchOutput, MultipleSelection, Ordering, CodeCorrection 
} from './QuizTypes';

interface QuizFlowProps {
  flashcards: Array<{ front: string; back: string }>;
  questions: Array<any>; // Replace with proper type from your JSON
  onComplete: (score: number) => void;
}

const QuizFlow: React.FC<QuizFlowProps> = ({ flashcards, questions, onComplete }) => {
  const [showFlashcards, setShowFlashcards] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleStartQuiz = () => {
    setShowFlashcards(false);
  };

  const handleAnswer = (answer: any) => {
    const question = questions[currentQuestionIndex];
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(prev => prev + 100);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsCorrect(null);
        setShowExplanation(false);
      } else {
        onComplete(score);
      }
    }, 2000);
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'fill-blank':
        return (
          <FillBlank
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoice
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'true-false':
        return (
          <TrueFalse
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'word-scramble':
        return (
          <WordScramble
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'match-output':
        return (
          <MatchOutput
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'multiple-selection':
        return (
          <MultipleSelection
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'ordering':
        return (
          <Ordering
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      case 'code-correction':
        return (
          <CodeCorrection
            {...question}
            onAnswer={handleAnswer}
            isCorrect={isCorrect}
            showExplanation={showExplanation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <AnimatePresence mode="wait">
        {showFlashcards ? (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FlashCards cards={flashcards} />
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Quiz
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Python Quiz</h2>
                <div className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-4">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {renderQuestion(questions[currentQuestionIndex])}

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white/10 rounded-lg"
              >
                <p className="text-gray-300">{questions[currentQuestionIndex].explanation}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizFlow;
