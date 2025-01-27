import React, { useState } from 'react';
import { Book, Code, Play, ChevronLeft, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';

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

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
      setExpandedPhase(null);
    }
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < coursePhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setExpandedPhase(null);
    }
  };

  const handlePhaseStart = (phaseId: string) => {
    setSparklePhase(phaseId);
    setTimeout(() => setSparklePhase(null), 1000);
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] bg-gradient-to-b from-[#0A1628] to-[#1A2B44] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        {/* AI Avatar */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-32 h-32"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-blue-400/50 flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-blue-500/30">
              <span className="text-5xl">{coursePhases[currentPhaseIndex].icon}</span>
            </div>
          </motion.div>
        </div>

        {/* Phase Navigation */}
        <div className="relative mb-12">
          <div className="flex items-center justify-center">
            <motion.button
              onClick={handlePrevPhase}
              disabled={currentPhaseIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 z-10 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex gap-6 transition-transform duration-500 ease-out px-16">
              {coursePhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{
                    scale: index === currentPhaseIndex ? 1 : 0.8,
                    opacity: index === currentPhaseIndex ? 1 : 0.6,
                  }}
                  whileHover={{ scale: index === currentPhaseIndex ? 1.05 : 0.85 }}
                  drag={index === currentPhaseIndex ? true : false}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  className={`relative w-64 h-96 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer 
                    ${index === currentPhaseIndex ? 'ring-2 ring-blue-500/50' : 'filter grayscale'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl" />
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  
                  <div className="relative h-full p-6 flex flex-col">
                    <div className="text-4xl mb-4">{phase.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{phase.description}</p>
                    
                    {index === currentPhaseIndex && (
                      <motion.button
                        onClick={() => handlePhaseStart(phase.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 group"
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

            <motion.button
              onClick={handleNextPhase}
              disabled={currentPhaseIndex === coursePhases.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 z-10 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Topics Section */}
        <AnimatePresence mode="wait">
          {expandedPhase && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {coursePhases[currentPhaseIndex].topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-blue-500/10 rounded-xl p-6 border border-blue-500/20"
                >
                  <div className="flex items-center justify-between">
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
