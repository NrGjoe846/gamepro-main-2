import React, { useState, useRef } from 'react';
import { Book, Code, Play, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import { useSpring, animated } from 'react-spring';

interface Topic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  icon: string;
}

const coursePhases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Python Basics',
    description: 'Master the fundamentals of Python programming',
    icon: '🚀',
    topics: [
      {
        id: 'variables',
        title: 'Variables and Data Types',
        description: 'Learn about Python variables and basic data types',
        completed: false
      },
      {
        id: 'operators',
        title: 'Operators and Expressions',
        description: 'Understanding Python operators and expressions',
        completed: false
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Control Flow',
    description: 'Learn how to control program flow with conditions and loops',
    icon: '🔄',
    topics: [
      {
        id: 'conditionals',
        title: 'Conditional Statements',
        description: 'Master if, elif, and else statements',
        completed: false
      },
      {
        id: 'loops',
        title: 'Loops and Iterations',
        description: 'Understanding for and while loops',
        completed: false
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Functions',
    description: 'Learn to write reusable code with functions',
    icon: '⚡',
    topics: [
      {
        id: 'functions-basics',
        title: 'Function Basics',
        description: 'Creating and calling functions',
        completed: false
      },
      {
        id: 'advanced-functions',
        title: 'Advanced Functions',
        description: 'Lambda functions and decorators',
        completed: false
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Data Structures',
    description: 'Master Python data structures',
    icon: '📊',
    topics: [
      {
        id: 'lists',
        title: 'Lists and Tuples',
        description: 'Working with sequences in Python',
        completed: false
      },
      {
        id: 'dictionaries',
        title: 'Dictionaries and Sets',
        description: 'Hash-based collections in Python',
        completed: false
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'OOP Concepts',
    description: 'Learn object-oriented programming in Python',
    icon: '🎯',
    topics: [
      {
        id: 'classes',
        title: 'Classes and Objects',
        description: 'Creating classes and objects',
        completed: false
      },
      {
        id: 'inheritance',
        title: 'Inheritance and Polymorphism',
        description: 'OOP inheritance concepts',
        completed: false
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'File Handling',
    description: 'Master file operations and error handling',
    icon: '📁',
    topics: [
      {
        id: 'file-ops',
        title: 'File Operations',
        description: 'Reading and writing files',
        completed: false
      },
      {
        id: 'error-handling',
        title: 'Error Handling',
        description: 'Try-except blocks and exceptions',
        completed: false
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Advanced Python',
    description: 'Explore advanced Python features',
    icon: '🎓',
    topics: [
      {
        id: 'generators',
        title: 'Generators and Iterators',
        description: 'Advanced iteration concepts',
        completed: false
      },
      {
        id: 'async',
        title: 'Asynchronous Programming',
        description: 'Async/await and coroutines',
        completed: false
      }
    ]
  }
];

const PythonFundamentals = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [sparklePhase, setSparklePhase] = useState<string | null>(null);
  const phasesContainerRef = useRef<HTMLDivElement>(null);

  const handlePhaseStart = (phaseId: string) => {
    setSparklePhase(phaseId);
    setTimeout(() => setSparklePhase(null), 1000);
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const handlePhaseClick = (index: number) => {
    setCurrentPhaseIndex(index);
    
    // Scroll the clicked phase to the center
    if (phasesContainerRef.current) {
      const container = phasesContainerRef.current;
      const phaseElement = container.children[index] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const phaseWidth = phaseElement.offsetWidth;
      const scrollLeft = phaseElement.offsetLeft - (containerWidth / 2) + (phaseWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] bg-gradient-to-b from-[#0A1628] to-[#1A2B44] text-white p-4 md:p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        {/* AI Avatar */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-24 h-24 md:w-32 md:h-32"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-blue-400/50 flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-blue-500/30">
              <span className="text-4xl md:text-5xl select-none">{coursePhases[currentPhaseIndex].icon}</span>
            </div>
          </motion.div>
        </div>

        {/* Phase Cards */}
        <div className="relative mb-12 overflow-hidden">
          <div 
            ref={phasesContainerRef}
            className="flex gap-6 overflow-x-auto px-4 py-2 no-scrollbar touch-pan-x"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {coursePhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{
                  scale: index === currentPhaseIndex ? 1 : 0.8,
                  opacity: index === currentPhaseIndex ? 1 : 0.6,
                }}
                whileHover={{ scale: index === currentPhaseIndex ? 1.05 : 0.85 }}
                whileTap={{ scale: index === currentPhaseIndex ? 0.95 : 0.8 }}
                className={`relative min-w-[300px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer select-none
                  ${index === currentPhaseIndex ? 'ring-2 ring-blue-500/50' : 'filter grayscale'}`}
                onClick={() => handlePhaseClick(index)}
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                
                <div className="relative h-full p-6 flex flex-col">
                  <div className="text-4xl mb-4 select-none">{phase.icon}</div>
                  <h3 className="text-xl font-bold mb-2 select-none">{phase.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 select-none">{phase.description}</p>
                  
                  {index === currentPhaseIndex && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhaseStart(phase.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 group select-none"
                    >
                      {sparklePhase === phase.id ? (
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                      )}
                      Start Phase
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Topics Section */}
        <AnimatePresence mode="wait">
          {expandedPhase && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 px-4"
            >
              {coursePhases[currentPhaseIndex].topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-blue-500/10 rounded-xl p-6 border border-blue-500/20"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-lg font-bold mb-2">{topic.title}</h4>
                      <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PythonFundamentals;
