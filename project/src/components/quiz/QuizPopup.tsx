import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, HelpCircle, Check, AlertTriangle, Trophy, Star } from 'lucide-react';
import Confetti from 'react-confetti';
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/quizzes/pythonBasics.json');
        const data = await response.json();
        const filteredQuestions = data.questions.filter(q => 
          q.subtopic.toLowerCase() === moduleTitle.toLowerCase()
        );
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen, moduleTitle]);

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
        return answer.trim() === currentQuestion.answer.trim();
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
      setScore(prev => prev + currentQuestion.points);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
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
      setQuizCompleted(true);
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

  const renderQuizComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-8"
    >
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Quiz Completed! 🎉</h2>
      <p className="text-xl mb-4">Your Score: {score} points</p>
      <div className="flex justify-center gap-4 mb-8">
        <div className="text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Questions: {questions.length}</p>
        </div>
        <div className="text-center">
          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Correct: {score / 100}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Complete Quiz
      </motion.button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          {showConfetti && <Confetti width={width} height={height} />}
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 m-4 overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>

            {quizCompleted ? renderQuizComplete() : (
              <>
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">{moduleTitle}</h2>
                    <p className="text-sm text-gray-400">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Question Content */}
                {currentQuestion && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-white/5 rounded-lg p-6"
                    >
                      <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
                      {currentQuestion.code && (
                        <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm font-mono">{currentQuestion.code}</code>
                        </pre>
                      )}
                    </motion.div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                        <motion.button
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setUserAnswer(index.toString())}
                          className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                            userAnswer === index.toString()
                              ? 'bg-blue-500/20 border-blue-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          } border group relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="relative z-10">{option}</span>
                        </motion.button>
                      ))}

                      {currentQuestion.type === 'true-false' && (
                        <div className="flex gap-4">
                          {['true', 'false'].map((value) => (
                            <motion.button
                              key={value}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setUserAnswer(value)}
                              className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                                userAnswer === value
                                  ? 'bg-blue-500/20 border-blue-500/50'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              } border capitalize`}
                            >
                              {value}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {(currentQuestion.type === 'fill-blank' || currentQuestion.type === 'code-correction') && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                        >
                          <textarea
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 font-mono text-sm"
                            placeholder="Enter your answer..."
                            rows={6}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence mode="wait">
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`p-4 rounded-lg ${
                            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            )}
                            <p>{feedback}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </motion.button>
                      
                      {showExplanation ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNext}
                          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmit}
                          disabled={!userAnswer || isValidating}
                          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isValidating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              Submit
                              <Check className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizPopup;
