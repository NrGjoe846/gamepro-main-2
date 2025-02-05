import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, HelpCircle, Check, AlertTriangle } from 'lucide-react';
import { useWindowSize } from 'react-use';

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  moduleTitle: string;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { width, height } = useWindowSize();

  // Load questions from JSON
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/quizzes/pythonBasics.json');
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const validateAnswer = (answer: string): boolean => {
    if (!currentQuestion) return false;

    switch (currentQuestion.type) {
      case 'fill-blank':
        return answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
      case 'multiple-choice':
        return parseInt(answer) === currentQuestion.answer;
      case 'true-false':
        return answer.toLowerCase() === currentQuestion.answer.toString();
      case 'code-correction':
        return parseInt(answer) === currentQuestion.answer;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !userAnswer) return;
    
    setIsValidating(true);
    const correct = validateAnswer(userAnswer);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 100);
      setFeedback("Correct! " + currentQuestion.explanation);
    } else {
      setFeedback("Incorrect. " + currentQuestion.explanation);
    }
    
    setShowExplanation(true);
    setIsValidating(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setFeedback(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setUserAnswer('');
      setIsCorrect(null);
      setFeedback(null);
      setShowExplanation(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 m-4"
          >
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-center">{moduleTitle}</h2>
              <div className="w-6" />
            </div>

            {/* Question Content */}
            {currentQuestion && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
                  {currentQuestion.code && (
                    <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{currentQuestion.code}</code>
                    </pre>
                  )}
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setUserAnswer(index.toString())}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                        userAnswer === index.toString()
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      {option}
                    </button>
                  ))}

                  {currentQuestion.type === 'true-false' && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setUserAnswer('true')}
                        className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                          userAnswer === 'true'
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } border`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => setUserAnswer('false')}
                        className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                          userAnswer === 'false'
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } border`}
                      >
                        False
                      </button>
                    </div>
                  )}

                  {(currentQuestion.type === 'fill-blank' || currentQuestion.type === 'code-correction') && (
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                      placeholder="Enter your answer..."
                    />
                  )}
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <p>{feedback}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <button
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {showExplanation ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer || isValidating}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidating ? 'Checking...' : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizPopup;
