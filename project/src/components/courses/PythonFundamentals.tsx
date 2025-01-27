import React, { useState, useEffect } from 'react';
import { Book, Code, Play, CheckCircle, Lock, ChevronDown, ChevronUp, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';

interface Topic {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  locked: boolean;
  subtopics?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface Phase {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  expanded?: boolean;
}

const coursePhases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Python Basics',
    description: 'Master the fundamentals of Python programming',
    topics: [
      {
        id: 'intro',
        title: '1. Introduction to Python',
        description: 'Learn Python installation, IDE setup, and write your first program.',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'setup', title: 'Installing Python and setting up the environment', completed: false },
          { id: 'first-program', title: 'Writing your first Python program', completed: false },
          { id: 'syntax', title: 'Python syntax basics', completed: false }
        ]
      },
      {
        id: 'data-types',
        title: '2. Data Types and Variables',
        description: 'Understanding Python data types and variables',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'numbers', title: 'Numbers (integers, floats)', completed: false },
          { id: 'strings', title: 'Strings and string operations', completed: false },
          { id: 'variables', title: 'Variables and assignments', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Control Flow',
    description: 'Learn how to control program flow with conditions and loops',
    topics: [
      {
        id: 'conditions',
        title: '3. Conditional Statements',
        description: 'Master if-else statements and logical operations',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'if-else', title: 'If-else statements', completed: false },
          { id: 'logical-ops', title: 'Logical operators', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Functions',
    description: 'Learn to write reusable code with functions',
    topics: [
      {
        id: 'functions',
        title: '4. Functions Basics',
        description: 'Understanding function definition and parameters',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'def-func', title: 'Defining functions', completed: false },
          { id: 'params', title: 'Parameters and return values', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Data Structures',
    description: 'Master Python data structures',
    topics: [
      {
        id: 'lists',
        title: '5. Lists and Tuples',
        description: 'Working with sequences in Python',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'lists-intro', title: 'Introduction to lists', completed: false },
          { id: 'tuples', title: 'Working with tuples', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Object-Oriented Programming',
    description: 'Learn object-oriented programming in Python',
    topics: [
      {
        id: 'classes',
        title: '6. Classes and Objects',
        description: 'Understanding OOP concepts',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'class-def', title: 'Defining classes', completed: false },
          { id: 'objects', title: 'Creating and using objects', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'Phase 6: File Handling',
    description: 'Learn to work with files in Python',
    topics: [
      {
        id: 'files',
        title: '7. File Operations',
        description: 'Reading and writing files',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'file-read', title: 'Reading files', completed: false },
          { id: 'file-write', title: 'Writing to files', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Phase 7: Advanced Topics',
    description: 'Explore advanced Python concepts',
    topics: [
      {
        id: 'advanced',
        title: '8. Advanced Python',
        description: 'Advanced programming concepts',
        completed: false,
        locked: true,
        subtopics: [
          { id: 'decorators', title: 'Decorators', completed: false },
          { id: 'generators', title: 'Generators', completed: false }
        ]
      }
    ]
  }
];

const PythonFundamentals = () => {
  const [phases, setPhases] = useState(coursePhases.map(phase => ({ ...phase, expanded: false })));
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    if (selectedPhase === phaseId) {
      setSelectedPhase(null);
    } else {
      setSelectedPhase(phaseId);
    }
    setPhases(prevPhases =>
      prevPhases.map(phase => ({
        ...phase,
        expanded: phase.id === phaseId ? !phase.expanded : phase.expanded
      }))
    );
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
    }
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Python Fundamentals</h1>
            <p className="text-gray-400">
              A comprehensive course covering Python programming from basics to advanced concepts
            </p>
          </div>
        </div>

        {/* Phase Slider */}
        <div className="relative mb-12 overflow-hidden">
          <div className="flex items-center justify-center">
            <motion.button
              onClick={handlePrevPhase}
              disabled={currentPhaseIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex gap-6 transition-transform duration-500 ease-out px-16" 
                 style={{ transform: `translateX(${-currentPhaseIndex * 280}px)` }}>
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{
                    scale: index === currentPhaseIndex ? 1 : 0.8,
                    opacity: index === currentPhaseIndex ? 1 : 0.6,
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative w-64 h-96 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer 
                    ${index > currentPhaseIndex ? 'filter grayscale' : ''}`}
                  onClick={() => setCurrentPhaseIndex(index)}
                >
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded-xl blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-sm text-gray-300">{phase.description}</p>
                    {index > currentPhaseIndex && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <Lock className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={handleNextPhase}
              disabled={currentPhaseIndex === phases.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Current Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhaseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {phases[currentPhaseIndex].topics.map((topic) => (
              <motion.div
                key={topic.id}
                className="group relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                  <button
                    onClick={() => togglePhase(phases[currentPhaseIndex].id)}
                    className="w-full p-6 text-left hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          topic.locked ? 'bg-gray-700/50' : 'bg-blue-500/20'
                        }`}>
                          {topic.locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Code className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{topic.title}</h4>
                          {topic.description && (
                            <p className="text-sm text-gray-400">{topic.description}</p>
                          )}
                        </div>
                      </div>
                      {!topic.locked && (
                        <Link
                          to="/compiler"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </Link>
                      )}
                    </div>
                  </button>

                  {/* Subtopics - Only show when phase is selected and expanded */}
                  {topic.subtopics && selectedPhase === phases[currentPhaseIndex].id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 space-y-3">
                        {topic.subtopics.map((subtopic) => (
                          <motion.div
                            key={subtopic.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {subtopic.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-500" />
                              )}
                              <span className="text-sm">{subtopic.title}</span>
                            </div>
                            {!topic.locked && !subtopic.completed && (
                              <Link
                                to="/compiler"
                                className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300"
                              >
                                Start
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PythonFundamentals;
