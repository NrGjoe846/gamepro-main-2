import React, { useState } from 'react';
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
    topics: [] // Topics will be added later
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Control Flow',
    description: 'Learn how to control program flow with conditions and loops',
    topics: []
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Functions',
    description: 'Learn to write reusable code with functions',
    topics: []
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Data Structures',
    description: 'Master Python data structures',
    topics: []
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Object-Oriented Programming',
    description: 'Learn object-oriented programming in Python',
    topics: []
  }
];

const PythonFundamentals = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
    }
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < coursePhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    }
  };

  const handlePhaseClick = (phaseId: string) => {
    const clickedPhaseIndex = coursePhases.findIndex(phase => phase.id === phaseId);
    if (clickedPhaseIndex === currentPhaseIndex) {
      setSelectedPhase(selectedPhase === phaseId ? null : phaseId);
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
        <div className="relative mb-12">
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

            <div className="flex gap-6 transition-transform duration-500 ease-out px-16">
              {coursePhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{
                    scale: index === currentPhaseIndex ? 1 : 0.8,
                    opacity: index === currentPhaseIndex ? 1 : 0.6,
                  }}
                  whileHover={{ scale: index === currentPhaseIndex ? 1.05 : 0.8 }}
                  className={`relative w-64 h-96 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer 
                    ${index === currentPhaseIndex ? 'ring-2 ring-blue-500' : 'filter grayscale'}`}
                  onClick={() => handlePhaseClick(phase.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                    ${index === currentPhaseIndex ? 'animate-pulse' : ''} rounded-xl blur-xl transition-opacity duration-300`} />
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-sm text-gray-300">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={handleNextPhase}
              disabled={currentPhaseIndex === coursePhases.length - 1}
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
            <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-4">{coursePhases[currentPhaseIndex].title}</h2>
              <p className="text-gray-400">{coursePhases[currentPhaseIndex].description}</p>
              <div className="mt-4 text-sm text-blue-400">
                Content for this phase will be updated soon
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PythonFundamentals;
