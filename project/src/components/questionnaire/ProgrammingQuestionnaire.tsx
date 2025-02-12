import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../CodeEditor/CodeEditor';

interface Question {
  text: string;
  answers: {
    yes: string;
    no: string;
  };
}

interface ProgrammingQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions: Question[] = [
  {
    text: "Do you install PyCharm?",
    answers: { yes: "Great!", no: "You can download it from jetbrains.com." }
  },
  {
    text: "If not, here are the steps to install: ...",
    answers: { yes: "Proceed to the next step.", no: "Visit the official website for installation guide." }
  },
  {
    text: "Do you use Python 3?",
    answers: { yes: "Awesome!", no: "Consider upgrading to Python 3." }
  },
  {
    text: "Do you need help with virtual environments?",
    answers: { yes: "Good!", no: "You can learn about virtual environments on Python docs." }
  },
  {
    text: "Do you prefer dark mode in PyCharm?",
    answers: { yes: "Dark mode is great!", no: "You can switch to dark mode in settings." }
  },
  {
    text: "Do you use Git integration in PyCharm?",
    answers: { yes: "Git is essential!", no: "Consider learning Git for version control." }
  },
  {
    text: "Would you like to learn debugging in PyCharm?",
    answers: { yes: "Debugging is crucial!", no: "You can learn debugging in PyCharm documentation." }
  },
  {
    text: "Do you need shortcuts for PyCharm?",
    answers: { yes: "Shortcuts enhance productivity!", no: "You can check shortcut documentation." }
  },
  {
    text: "Do you want to install additional plugins?",
    answers: { yes: "Plugins enhance functionality!", no: "You can explore plugins in settings." }
  },
  {
    text: "Do you need help with PyCharm settings?",
    answers: { yes: "Great!", no: "Check PyCharm documentation for settings help." }
  }
];

const ProgrammingQuestionnaire: React.FC<ProgrammingQuestionnaireProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    setFeedback(answer ? questions[currentQuestionIndex].answers.yes : questions[currentQuestionIndex].answers.no);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        handleNext();
      } else {
        // Show code editor after the last question
        setShowCodeEditor(true);
      }
    }, 1500);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setFeedback(null);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
    }
  };

  if (showCodeEditor) {
    return (
      <div className="fixed inset-0 bg-[#0F1117] z-50">
        <div className="h-full p-8">
          <CodeEditor />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#1a1a2e] rounded-2xl p-6 shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-400 text-center">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6 text-center">
                {questions[currentQuestionIndex].text}
              </h3>

              {/* Answer Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  No
                </motion.button>
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center text-gray-300 mb-8"
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgrammingQuestionnaire;
