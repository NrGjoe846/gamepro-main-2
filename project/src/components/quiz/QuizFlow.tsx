import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Trophy, Timer } from 'lucide-react';

interface QuizFlowProps {
  questions: any[];
  flashcards: any[];
  onComplete: (score: number) => void;
  moduleTitle: string;
}

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards: FlashCard[];
}

// Separate FlashCards component
const FlashCards: React.FC<FlashCardsProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Review Flashcards</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      <div className="relative perspective-1000 h-96">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              x: direction > 0 ? 300 : -300,
              opacity: 0,
              rotateY: isFlipped ? 180 : 0
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              rotateY: isFlipped ? 180 : 0
            }}
            exit={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 preserve-3d cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Question</h3>
                  <p className="text-xl">{cards[currentIndex].front}</p>
                  <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col justify-center h-full text-center">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Answer</h3>
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {cards[currentIndex].back}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Next Card
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

// Main QuizFlow component
const QuizFlow: React.FC<QuizFlowProps> = ({ questions, flashcards, onComplete, moduleTitle }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'flashcards' | 'quiz' | 'complete'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setCurrentStep('flashcards');
  };

  const handleStartFlashcards = () => {
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestionIndex].answer;
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      } else {
        setCurrentStep('complete');
        onComplete(Math.round((score / questions.length) * 100));
      }
    }, 1500);
  };

  if (currentStep === 'intro') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">{moduleTitle}</h2>
        <p className="text-gray-400 mb-6">
          Get ready to test your knowledge! Start with flashcards to review the concepts,
          then take the quiz to earn XP.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartQuiz}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Start Learning
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  if (currentStep === 'flashcards') {
    return (
      <div className="p-8">
        <FlashCards cards={flashcards} />
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartFlashcards}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            Start Quiz
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  if (currentStep === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="p-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h3>
              <p className="text-sm text-gray-400">Score: {score}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
          {currentQuestion.code && (
            <pre className="bg-black/30 p-4 rounded-lg mb-4 overflow-x-auto">
              <code>{currentQuestion.code}</code>
            </pre>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option: string, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-lg border text-left transition-all duration-300 ${
                selectedAnswer === null
                  ? 'bg-white/10 border-white/20 hover:bg-white/20'
                  : selectedAnswer === index
                  ? isAnswerCorrect
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-red-500/20 border-red-500'
                  : index === currentQuestion.answer && isAnswerCorrect === false
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default QuizFlow;
