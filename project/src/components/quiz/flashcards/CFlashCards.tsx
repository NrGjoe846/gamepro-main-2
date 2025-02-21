import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const cFlashCards = [
  {
    front: "What is C's execution model?",
    back: "C is a compiled language where source code is converted directly to machine code by a compiler. The resulting executable runs natively on the target platform."
  },
  {
    front: "How does C differ from interpreted languages?",
    back: "C code must be compiled before execution, creating platform-specific machine code. This results in faster execution but requires recompilation for different platforms."
  },
  {
    front: "What are the key features of C?",
    back: "• Low-level memory access\n• Direct hardware manipulation\n• High performance\n• Minimal runtime overhead\n• Structured programming\n• Portability of source code"
  },
  {
    front: "Explain C's compilation process",
    back: "1. Preprocessing (.c → expanded source)\n2. Compilation (source → assembly)\n3. Assembly (assembly → object code)\n4. Linking (object code → executable)"
  },
  {
    front: "Why is C called a 'middle-level' language?",
    back: "C combines low-level features (direct memory access, hardware control) with high-level abstractions (functions, structured programming), making it suitable for both system and application programming."
  }
];

interface CFlashCardsProps {
  onComplete: () => void;
}

const CFlashCards: React.FC<CFlashCardsProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < cFlashCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">C Programming Fundamentals</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {cFlashCards.length}
        </div>
      </div>

      <div className="relative perspective-1000 h-96 mb-8">
        <motion.div
          className="absolute inset-0 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Question</h3>
                <p className="text-xl">{cFlashCards[currentIndex].front}</p>
                <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col justify-center h-full text-center">
                <h3 className="text-xl font-bold text-green-400 mb-4">Answer</h3>
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {cFlashCards[currentIndex].back}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          {currentIndex === cFlashCards.length - 1 ? 'Start Quiz' : 'Next Card'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default CFlashCards;