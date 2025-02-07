import { motion } from 'framer-motion';
import { X, Trophy, Book, ChevronRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropQuestion from './DragDropQuestion';
import MatchQuestion from './MatchQuestion';
import FillQuestion from './FillQuestion';
import { useState, useEffect } from 'react';

const QuizPopup = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFlashInfo, setShowFlashInfo] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      setScore(0);
      setShowConfetti(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowFlashInfo(true);
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
    { type: 'fill', question: "What is the capital of France?", answer: "Paris" },
  ];

  const flashInfo = {
    title: "Before You Begin",
    description: "Let's review some key concepts before starting the quiz:",
    points: [
      "Python is an interpreted language",
      "Code is executed line by line",
      "No compilation step is needed",
      "Immediate feedback during development",
      "Great for rapid prototyping and testing"
    ],
    tips: [
      "Read each question carefully",
      "Take your time to understand the concepts",
      "Use the provided hints when needed",
      "Practice makes perfect!"
    ]
  };

  const handleStartQuiz = () => {
    setShowFlashInfo(false);
  };

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

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    onComplete(finalScore);
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex] || {};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <DndProvider backend={HTML5Backend}>
        {showConfetti && <Confetti width={width} height={height} />}
        <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>

          {showFlashInfo ? (
            <div className="space-y-6">
              <div className="text-center">
                <Book className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{flashInfo.title}</h2>
                <p className="text-gray-400">{flashInfo.description}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Key Concepts:</h3>
                  <ul className="space-y-2">
                    {flashInfo.points.map((point, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Tips for Success:</h3>
                  <ul className="space-y-2">
                    {flashInfo.tips.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Quiz
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : !showResults ? (
            <div className="space-y-6">
              {currentQuestion.type === 'match' ? (
                <MatchQuestion key={currentQuestionIndex} question={currentQuestion} onAnswer={handleAnswer} />
              ) : currentQuestion.type === 'fill' ? (
                <FillQuestion key={currentQuestionIndex} question={currentQuestion} onAnswer={handleAnswer} />
              ) : (
                <DragDropQuestion key={currentQuestionIndex} question={currentQuestion} onAnswer={handleAnswer} />
              )}

              <button onClick={handleNext} className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300">
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Trophy className="mx-auto w-12 h-12 text-yellow-400" />
              <p className="text-lg font-semibold">Quiz Completed!</p>
              <p className="text-2xl font-bold">{score}%</p>
              <button onClick={onClose} className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300">
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
