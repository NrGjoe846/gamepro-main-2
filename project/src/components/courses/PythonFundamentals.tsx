import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronDown, ChevronUp, Target, AlertCircle, CheckCircle } from 'lucide-react';
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
  icon: string;
}

const pythonSubtopics = {
  'intro': [
    { id: 'python-install', title: 'Installing Python (Anaconda, PyCharm, or basic Python)', completed: false },
    { id: 'ide-setup', title: 'Setting up the IDE', completed: false },
    { id: 'first-program', title: 'Writing your first Python program: print("Hello, World!")', completed: false },
    { id: 'syntax', title: 'Python syntax, keywords, and comments', completed: false },
    { id: 'interpreter', title: "Python's interpreter vs. compiled languages", completed: false }
  ],
  'data-types': [
    { id: 'numbers', title: 'Numbers (integers, floats, complex)', completed: false },
    { id: 'strings', title: 'Strings', completed: false },
    { id: 'booleans', title: 'Booleans', completed: false },
    { id: 'type-conversion', title: 'Type conversion (int to float, string to int, etc.)', completed: false },
    { id: 'variables', title: 'Variable naming conventions and dynamic typing', completed: false }
  ],
  'operators': [
    { id: 'arithmetic', title: 'Arithmetic operators: +, -, /, //, %, *', completed: false },
    { id: 'comparison', title: 'Comparison operators: ==, !=, >, <, >=, <=', completed: false },
    { id: 'logical', title: 'Logical operators: and, or, not', completed: false },
    { id: 'assignment', title: 'Assignment operators: =, +=, -=', completed: false },
    { id: 'bitwise', title: 'Bitwise operators (optional for beginners)', completed: false }
  ],
  'control-flow': [
    { id: 'conditionals', title: 'Conditionals: if, elif, else', completed: false },
    { id: 'for-loops', title: 'for loops (with range and iterables)', completed: false },
    { id: 'while-loops', title: 'while loops', completed: false },
    { id: 'loop-control', title: 'Loop control statements: break, continue, pass', completed: false },
    { id: 'nested', title: 'Nested loops and conditionals', completed: false }
  ],
  'functions': [
    { id: 'def-functions', title: 'Defining functions using def', completed: false },
    { id: 'parameters', title: 'Function parameters and return values', completed: false },
    { id: 'scope', title: 'Function scope: local vs global variables', completed: false },
    { id: 'default-params', title: 'Default parameters and keyword arguments', completed: false },
    { id: 'lambda', title: 'Lambda functions (anonymous functions)', completed: false },
    { id: 'recursion', title: 'Understanding recursion (optional for beginners)', completed: false }
  ],
  'io': [
    { id: 'input', title: 'User input using input()', completed: false },
    { id: 'output', title: 'Output formatting using print()', completed: false },
    { id: 'string-format', title: 'String interpolation (f-strings, % formatting, .format())', completed: false }
  ]
};

const coursePhases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Python Basics and Core Concepts',
    description: 'Understanding Python syntax, data types, and fundamental programming concepts',
    icon: '🚀',
    topics: [
      {
        id: 'intro',
        title: '1. Introduction to Python Programming',
        description: 'Get started with Python programming language basics',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics.intro
      },
      {
        id: 'data-types',
        title: '2. Basic Data Types and Variables',
        description: 'Learn about Python data types and variable declarations',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics['data-types']
      },
      {
        id: 'operators',
        title: '3. Operators and Expressions',
        description: 'Master Python operators and expressions',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics.operators
      },
      {
        id: 'control-flow',
        title: '4. Control Flow: Conditionals and Loops',
        description: 'Understanding if statements, loops, and control structures',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics['control-flow']
      },
      {
        id: 'functions',
        title: '5. Functions and Modular Code',
        description: 'Creating and using functions for modular programming',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics.functions
      },
      {
        id: 'io',
        title: '6. Basic Input and Output',
        description: 'Working with input and output operations in Python',
        completed: false,
        locked: false,
        subtopics: pythonSubtopics.io
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Data Structures and Collections',
    description: 'Storing and manipulating data efficiently',
    icon: '📚',
    topics: [
      {
        id: 'lists',
        title: '7. Lists',
        description: 'Working with Python lists and array operations',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'tuples',
        title: '8. Tuples',
        description: 'Understanding immutable sequences in Python',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'dictionaries',
        title: '9. Dictionaries',
        description: 'Using key-value pair data structures',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'sets',
        title: '10. Sets',
        description: 'Working with unique collections',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'strings',
        title: '11. String Manipulation',
        description: 'Advanced string operations and manipulation',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Intermediate Topics',
    description: 'File handling, exception handling, and Object-Oriented Programming',
    icon: '⚡',
    topics: [
      {
        id: 'file-handling',
        title: '12. File Handling',
        description: 'Reading and writing files in Python',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'exceptions',
        title: '13. Error and Exception Handling',
        description: 'Managing errors and exceptions in Python',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'oop-basics',
        title: '14. Object-Oriented Programming (OOP) Basics',
        description: 'Introduction to classes and objects',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'modules',
        title: '15. Modules and Packages',
        description: 'Creating and using Python modules and packages',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'libraries',
        title: '16. Working with Libraries',
        description: 'Using Python standard library and external packages',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Working with Data and Basic Algorithms',
    description: 'Understanding algorithms, data structures, and computational efficiency',
    icon: '🎯',
    topics: [
      {
        id: 'data-structures',
        title: '17. Data Structures: Stacks, Queues, and Linked Lists',
        description: 'Implementation of basic data structures',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'algorithms',
        title: '18. Sorting and Searching Algorithms',
        description: 'Basic algorithm implementation and analysis',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'Advanced Beginner Topics',
    description: 'Debugging, testing, and regular expressions',
    icon: '🔍',
    topics: [
      {
        id: 'regex',
        title: '19. Basic Regular Expressions',
        description: 'Pattern matching and text processing',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'testing',
        title: '20. Debugging and Testing',
        description: 'Writing tests and debugging Python code',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'databases',
        title: '21. Introduction to Databases (Optional)',
        description: 'Basic database operations with Python',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'Project Development and Version Control',
    description: 'Applying knowledge to real-world projects and version control',
    icon: '🛠️',
    topics: [
      {
        id: 'git',
        title: '22. Version Control with Git and GitHub',
        description: 'Basic Git operations and GitHub workflow',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'projects',
        title: '23. Building Small Projects',
        description: 'Applying Python concepts to real projects',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Continuous Learning and Practice',
    description: 'Enhancing problem-solving skills through projects and challenges',
    icon: '🎓',
    topics: [
      {
        id: 'project-learning',
        title: '24. Project-Based Learning',
        description: 'Building comprehensive projects and solving real-world challenges',
        completed: false,
        locked: false,
        subtopics: []
      },
      {
        id: 'specialized-libraries',
        title: '25. Explore Specialized Libraries and Fields',
        description: 'Introduction to data science (NumPy, Pandas), web development (Django, Flask), automation (Selenium, PyAutoGUI), and functional programming (lambda, map, filter, reduce)',
        completed: false,
        locked: false,
        subtopics: []
      }
    ]
  }
];

const PythonFundamentals = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [flippedPhase, setFlippedPhase] = useState<string | null>(null);
  const [sparklePhase, setSparklePhase] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ phaseId: string; topicId: string } | null>(null);
  const phasesContainerRef = useRef<HTMLDivElement>(null);

  const handlePhaseStart = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSparklePhase(phaseId);
    setTimeout(() => setSparklePhase(null), 500);
    setFlippedPhase(flippedPhase === phaseId ? null : phaseId);
    // Reset selected topic when changing phases
    setSelectedTopic(null);
    setExpandedTopic(null);
  };

  // Modified to only handle start button click
  const handleTopicStart = (phaseId: string, topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
    setSelectedTopic({ phaseId, topicId });
  };

  const handlePhaseClick = (index: number) => {
    setCurrentPhaseIndex(index);
    // Reset selected topic when changing phases
    setSelectedTopic(null);
    setExpandedTopic(null);
    
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

  const selectedPhaseAndTopic = selectedTopic ? {
    phase: coursePhases.find(p => p.id === selectedTopic.phaseId),
    topic: coursePhases
      .find(p => p.id === selectedTopic.phaseId)
      ?.topics.find(t => t.id === selectedTopic.topicId)
  } : null;

  return (
    <div className="min-h-screen bg-[#0A1628] bg-gradient-to-b from-[#0A1628] to-[#1A2B44] text-white p-4 md:p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

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
                transition={{ duration: 0.2, ease: "easeOut" }}
                whileHover={{ 
                  scale: index === currentPhaseIndex ? 1.02 : 0.85,
                  transition: { duration: 0.15 }
                }}
                whileTap={{ 
                  scale: index === currentPhaseIndex ? 0.98 : 0.8,
                  transition: { duration: 0.1 }
                }}
                className={`relative min-w-[300px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer select-none
                  ${index === currentPhaseIndex ? 'ring-2 ring-blue-500/50' : 'filter grayscale'}`}
                onClick={() => handlePhaseClick(index)}
                style={{ scrollSnapAlign: 'center' }}
              >
                <motion.div
                  className="relative w-full h-full transition-all preserve-3d"
                  animate={{ 
                    rotateY: flippedPhase === phase.id ? 180 : 0 
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="absolute inset-0 backface-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    
                    <div className="relative h-full p-6 flex flex-col">
                      <div className="text-4xl mb-4 select-none">{phase.icon}</div>
                      <h3 className="text-xl font-bold mb-2 select-none">{phase.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 select-none">{phase.description}</p>
                      
                      {index === currentPhaseIndex && (
                        <motion.button
                          onClick={(e) => handlePhaseStart(phase.id, e)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 group select-none"
                        >
                          {sparklePhase === phase.id ? (
                            <Target className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '0.5s' }} />
                          ) : (
                            <Play className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-150" />
                          )}
                          Flip to see topics
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl overflow-y-auto">
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold mb-4">{phase.title} Topics</h3>
                      {phase.topics.map((topic) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold mb-1">{topic.title}</h4>
                              <p className="text-sm text-gray-400">{topic.description}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => handleTopicStart(phase.id, topic.id, e)}
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              <span>Start</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handlePhaseStart(phase.id, e)}
                        className="w-full mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2"
                      >
                        Flip back
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedPhaseAndTopic && selectedPhaseAndTopic.topic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 mt-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedPhaseAndTopic.topic.title} Subtopics</h3>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="flex items-center gap-2"
                >
                  {expandedTopic === selectedPhaseAndTopic.topic.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {expandedTopic === selectedPhaseAndTopic.topic.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {selectedPhaseAndTopic.topic.subtopics?.map((subtopic) => (
                      <motion.div
                        key={subtopic.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-xl border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          {subtopic.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-500" />
                          )}
                          <span className="text-sm">{subtopic.title}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <Play className="w-3 h-3" />
                          Start
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PythonFundamentals;
