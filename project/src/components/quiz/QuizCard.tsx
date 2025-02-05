import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, HelpCircle } from 'lucide-react';

interface QuizCardProps {
  question: {
    type: 'fill-blank' | 'multiple-choice' | 'true-false' | 'word-scramble' | 'code-output' | 'match-output' | 'multiple-selection' | 'ordering' | 'code-correction';
    question: string;
    options?: string[];
    code?: string;
    answer: string | number | boolean | number[];
    explanation: string;
  };
  currentAnswer: any;
  onAnswer: (answer: any) => void;
  isAnswered: boolean;
  isCorrect?: boolean;
  onNext: () => void;
  isLast: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentAnswer,
  onAnswer,
  isAnswered,
  isCorrect,
  onNext,
  isLast
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'fill-blank':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type your answer..."
              value={currentAnswer || ''}
              onChange={(e) => onAnswer(e.target.value)}
              disabled={isAnswered}
              className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
            />
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => !isAnswered && onAnswer(index)}
                className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                  isAnswered
                    ? index === question.answer
                      ? 'bg-green-500/20 border-green-500'
                      : index === currentAnswer
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-white/10 border-white/20'
                    : currentAnswer === index
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="flex gap-4">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => !isAnswered && onAnswer(option === 'True')}
                className={`flex-1 p-3 rounded-lg border transition-all duration-300 ${
                  isAnswered
                    ? option === String(question.answer)
                      ? 'bg-green-500/20 border-green-500'
                      : option === String(currentAnswer)
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-white/10 border-white/20'
                    : String(currentAnswer) === option
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
        );

      // Add more question types as needed...

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
    >
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">{question.question}</h3>
        {question.code && (
          <pre className="bg-black/30 p-4 rounded-lg mb-4 overflow-x-auto">
            <code>{question.code}</code>
          </pre>
        )}
      </div>

      {/* Answer Options */}
      {renderQuestion()}

      {/* Result & Next Button */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6"
          >
            <div className={`p-4 rounded-lg mb-4 ${
              isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
                <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
              </div>
              <p className="text-sm mt-2">{question.explanation}</p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLast ? 'Complete Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Button */}
      {!isAnswered && (
        <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          <span>Need a hint?</span>
        </button>
      )}
    </motion.div>
  );
};

export default QuizCard;
