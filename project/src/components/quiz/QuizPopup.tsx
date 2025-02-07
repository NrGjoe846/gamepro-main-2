import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import FlashCards from './FlashCards';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropQuestion from './DragDropQuestion';
import { useState, useEffect } from 'react';

const QuizPopup = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!isOpen) {
      setShowQuiz(false);
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [isOpen]);

  const questions = [
    { type: 'unscramble', question: "Unscramble the words to form a correct statement:", options: ['Python', 'is', 'executed', 'line-by-line', 'by', 'an', 'interpreter'], answer: ['Python', 'is', 'executed', 'line-by-line', 'by', 'an', 'interpreter'] },
    { type: 'multiple-choice', question: "Which of the following is true about Python?", options: ["Compiled language", "Interpreted language"], answer: "Interpreted language" },
    { type: 'match', question: "Match the execution method:", options: [{ term: "Python", match: "Interpreter" }, { term: "C++", match: "Compiler" }] },
    { type: 'true-false', question: "Python is a compiled language.", options: ["True", "False"], answer: "False" },
    { type: 'fill-in-the-blank', question: "_____ is used to define a function in Python.", answer: "def" },
    { type: 'odd-one-out', question: "Select the odd one out:", options: ["list", "tuple", "dictionary", "integer"], answer: "integer" },
    { type: 'debug-the-code', question: "Fix the error in the given code snippet:", code: "print('Hello World" },
    { type: 'code-correction', question: "Correct the syntax of the given Python statement:", code: "for i in range(5) print(i)" },
    { type: 'short-answer', question: "What is the output of print(2**3)?", answer: "8" },
    { type: 'multi-select', question: "Select all mutable data types in Python:", options: ["List", "Tuple", "Set", "Dictionary"], answer: ["List", "Set", "Dictionary"] },
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

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    setShowConfetti(true);
    onComplete(finalScore);
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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

          {!showQuiz && !showResults && (
            <FlashCards onComplete={() => setShowQuiz(true)} />
          )}

          {showQuiz && !showResults && questions[currentQuestionIndex] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
                <div className="text-sm text-gray-400">
                  Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </div>
              </div>

              {['unscramble', 'match', 'debug-the-code', 'code-correction'].includes(questions[currentQuestionIndex].type) ? (
                <DragDropQuestion 
                  question={questions[currentQuestionIndex]} 
                  onAnswer={handleAnswer}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-lg">{questions[currentQuestionIndex].question}</p>
                  <div className="space-y-2">
                    {questions[currentQuestionIndex].options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                          answers[currentQuestionIndex] === option 
                            ? 'bg-blue-500/20 border-blue-500' 
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}

          {showResults && (
            <div className="text-center space-y-6">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
              <h2 className="text-2xl font-bold">Quiz Complete!</h2>
              <p className="text-xl">Your Score: {score}%</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
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

export default QuizPopup;
