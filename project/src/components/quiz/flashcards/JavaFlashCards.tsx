import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const javaFlashCards = [
  {
    front: "What is Java's execution model?",
    back: "Java uses a two-step execution process: First, the source code is compiled to bytecode, then the bytecode is executed by the Java Virtual Machine (JVM)."
  },
  {
    front: "What is the JVM?",
    back: "The Java Virtual Machine (JVM) is a virtual machine that provides a runtime environment for executing Java bytecode. It enables Java's 'Write Once, Run Anywhere' capability."
  },
  {
    front: "What are the key features of Java?",
    back: "• Object-Oriented\n• Platform Independent\n• Secure\n• Robust\n• Multi-threaded\n• High Performance"
  },
  {
    front: "Explain Java's compilation process",
    back: "1. Java source code (.java) is written\n2. Compiler (javac) converts it to bytecode (.class)\n3. JVM loads and executes the bytecode\n4. Program runs on the target platform"
  },
  {
    front: "What makes Java platform independent?",
    back: "Java achieves platform independence through its bytecode and JVM architecture. The bytecode can run on any platform that has a JVM installed, regardless of the underlying hardware or operating system."
  }
];

interface JavaFlashCardsProps {
  onComplete: () => void;
}

const JavaFlashCards: React.FC<JavaFlashCardsProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < javaFlashCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Java Fundamentals</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {javaFlashCards.length}
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative perspective-1000 h-96 mb-8">
        <motion.div
          className="absolute inset-0 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Question</h3>
                <p className="text-xl">{javaFlashCards[currentIndex].front}</p>
                <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col justify-center h-full text-center">
                <h3 className="text-xl font-bold text-green-400 mb-4">Answer</h3>
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {javaFlashCards[currentIndex].back}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          {currentIndex === javaFlashCards.length - 1 ? 'Start Quiz' : 'Next Card'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default JavaFlashCards;
