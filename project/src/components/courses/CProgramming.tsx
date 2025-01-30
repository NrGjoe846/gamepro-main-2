import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, Code, Play, CheckCircle, Lock, ChevronDown, ChevronUp, 
  AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import GlowingButton from '../ui/GlowingButton';

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

const coursePhases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: C Basics and Core Concepts',
    description: 'Master the fundamentals of C programming language and build a strong foundation.',
    icon: '🎯',
    topics: [
      {
        id: 'intro',
        title: '1. Introduction to C Programming',
        description: 'Get started with C programming language basics',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'setup', title: 'Installing GCC and setting up the environment', completed: false },
          { id: 'first-program', title: 'Writing your first C program', completed: false },
          { id: 'compilation', title: 'Understanding compilation process', completed: false },
          { id: 'syntax', title: 'C syntax and basic structure', completed: false }
        ]
      },
      {
        id: 'data-types',
        title: '2. Data Types and Variables',
        description: 'Learn about C data types and variable declarations',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'primitive-types', title: 'Basic data types in C', completed: false },
          { id: 'variables', title: 'Variable declaration and initialization', completed: false },
          { id: 'type-modifiers', title: 'Type modifiers (signed, unsigned, long, short)', completed: false },
          { id: 'constants', title: 'Constants and literals', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Control Flow and Functions',
    description: 'Master control structures and function usage in C',
    icon: '⚡',
    topics: [
      {
        id: 'control-flow',
        title: '3. Control Flow',
        description: 'Understanding control structures in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'if-else', title: 'Conditional statements (if-else)', completed: false },
          { id: 'loops', title: 'Loops (for, while, do-while)', completed: false },
          { id: 'switch', title: 'Switch statements', completed: false },
          { id: 'break-continue', title: 'Break and continue statements', completed: false }
        ]
      },
      {
        id: 'functions',
        title: '4. Functions',
        description: 'Working with functions in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'function-basics', title: 'Function declaration and definition', completed: false },
          { id: 'parameters', title: 'Parameters and return values', completed: false },
          { id: 'recursion', title: 'Recursive functions', completed: false },
          { id: 'scope', title: 'Variable scope and lifetime', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Arrays and Pointers',
    description: 'Master arrays and pointer manipulation in C',
    icon: '📚',
    topics: [
      {
        id: 'arrays',
        title: '5. Arrays',
        description: 'Working with arrays in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'array-basics', title: 'Array declaration and initialization', completed: false },
          { id: 'multi-dimensional', title: 'Multi-dimensional arrays', completed: false },
          { id: 'array-functions', title: 'Array manipulation functions', completed: false },
          { id: 'strings', title: 'Character arrays and strings', completed: false }
        ]
      },
      {
        id: 'pointers',
        title: '6. Pointers',
        description: 'Understanding pointers in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'pointer-basics', title: 'Pointer declaration and initialization', completed: false },
          { id: 'pointer-arithmetic', title: 'Pointer arithmetic', completed: false },
          { id: 'pointer-arrays', title: 'Pointers and arrays', completed: false },
          { id: 'function-pointers', title: 'Function pointers', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Memory Management',
    description: 'Learn dynamic memory allocation and management',
    icon: '💾',
    topics: [
      {
        id: 'memory',
        title: '7. Dynamic Memory',
        description: 'Dynamic memory allocation in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'malloc', title: 'malloc() and free()', completed: false },
          { id: 'calloc', title: 'calloc() and realloc()', completed: false },
          { id: 'memory-leaks', title: 'Memory leaks and debugging', completed: false },
          { id: 'memory-layout', title: 'Memory layout of C programs', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Structures and Unions',
    description: 'Master user-defined data types in C',
    icon: '🔧',
    topics: [
      {
        id: 'structures',
        title: '8. Structures',
        description: 'Working with structures in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'struct-basics', title: 'Structure declaration and initialization', completed: false },
          { id: 'nested-structs', title: 'Nested structures', completed: false },
          { id: 'struct-functions', title: 'Structures with functions', completed: false },
          { id: 'unions', title: 'Unions and bit fields', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'Phase 6: File Handling',
    description: 'Learn file input/output operations in C',
    icon: '📁',
    topics: [
      {
        id: 'files',
        title: '9. File Operations',
        description: 'File handling in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'file-basics', title: 'File opening and closing', completed: false },
          { id: 'file-io', title: 'File reading and writing', completed: false },
          { id: 'binary-files', title: 'Binary file operations', completed: false },
          { id: 'error-handling', title: 'Error handling in file operations', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Phase 7: Advanced Topics',
    description: 'Explore advanced C programming concepts',
    icon: '🚀',
    topics: [
      {
        id: 'advanced',
        title: '10. Advanced C Concepts',
        description: 'Master advanced C programming topics',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'preprocessor', title: 'Preprocessor directives', completed: false },
          { id: 'macros', title: 'Macro definitions and expansion', completed: false },
          { id: 'command-line', title: 'Command line arguments', completed: false },
          { id: 'libraries', title: 'Creating and using libraries', completed: false }
        ]
      }
    ]
  }
];

const CProgramming = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [flippedPhase, setFlippedPhase] = useState<string | null>(null);
  const [sparklePhase, setSparklePhase] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ phaseId: string; topicId: string } | null>(null);
  const phasesContainerRef = useRef<HTMLDivElement>(null);
  const subtopicsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragThreshold = 5;
  const [dragDistance, setDragDistance] = useState(0);

  useEffect(() => {
    scrollToCurrentPhase();
  }, [currentPhaseIndex]);

  const scrollToCurrentPhase = () => {
    if (phasesContainerRef.current) {
      const container = phasesContainerRef.current;
      const phaseElement = container.children[currentPhaseIndex] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const phaseWidth = phaseElement.offsetWidth;
      const newScrollLeft = phaseElement.offsetLeft - (containerWidth / 2) + (phaseWidth / 2);
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!phasesContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - phasesContainerRef.current.offsetLeft);
    setScrollLeft(phasesContainerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !phasesContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - phasesContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    phasesContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUp = () => {
    if (!isDragging || !phasesContainerRef.current) return;
    setIsDragging(false);
    
    if (dragDistance > dragThreshold) {
      const container = phasesContainerRef.current;
      const phaseWidth = container.children[0].clientWidth;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / phaseWidth);
      setCurrentPhaseIndex(Math.max(0, Math.min(newIndex, coursePhases.length - 1)));
    }
  };

  const handlePrevPhase = () => {
    setCurrentPhaseIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPhase = () => {
    setCurrentPhaseIndex(prev => Math.min(coursePhases.length - 1, prev + 1));
  };

  const handlePhaseClick = (index: number) => {
    if (dragDistance <= dragThreshold) {
      setCurrentPhaseIndex(index);
      setSelectedTopic(null);
      setExpandedTopic(null);
    }
  };

  const handlePhaseStart = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSparklePhase(phaseId);
    
    const sparkles = Array.from({ length: 8 }).map((_, i) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute w-2 h-2 bg-blue-400 rounded-full';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
      sparkle.style.animation = `sparkle ${Math.random() * 0.5 + 0.5}s ease-in-out ${i * 0.1}s`;
      return sparkle;
    });

    const target = e.currentTarget as HTMLElement;
    sparkles.forEach(sparkle => target.appendChild(sparkle));

    setTimeout(() => {
      sparkles.forEach(sparkle => sparkle.remove());
    }, 1000);

    setTimeout(() => setSparklePhase(null), 500);
    
    if (flippedPhase !== phaseId) {
      setFlippedPhase(phaseId);
    }
  };

  const handleFlipBack = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedPhase(null);
  };

  const handleTopicStart = (phaseId: string, topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedTopic?.topicId === topicId) {
      setExpandedTopic(null);
      setSelectedTopic(null);
    } else {
      setExpandedTopic(topicId);
      setSelectedTopic({ phaseId, topicId });

      setTimeout(() => {
        subtopicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const selectedPhaseAndTopic = selectedTopic ? {
    phase: coursePhases.find(p => p.id === selectedTopic.phaseId),
    topic: coursePhases
      .find(p => p.id === selectedTopic.phaseId)
      ?.topics.find(t => t.id === selectedTopic.topicId)
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <style>
        {`
          @keyframes sparkle {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: scale(1.5) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: scale(0) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      
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

        <div className="relative mb-12">
          <button
            onClick={handlePrevPhase}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm transition-opacity duration-300 ${
              currentPhaseIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70'
            }`}
            disabled={currentPhaseIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextPhase}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm transition-opacity duration-300 ${
              currentPhaseIndex === coursePhases.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70'
            }`}
            disabled={currentPhaseIndex === coursePhases.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={phasesContainerRef}
            className="flex gap-6 overflow-x-auto px-4 py-2 no-scrollbar touch-pan-x"
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {coursePhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{
                  scale: index === currentPhaseIndex ? 1 : 0.8,
                  opacity: index === currentPhaseIndex ? 1 : 0.6,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
                    duration: 0.2,
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
                          className="mt-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 group select-none relative overflow-hidden"
                        >
                          {sparklePhase === phase.id ? (
                            <AlertCircle className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '0.5s' }} />
                          ) : (
                            <div className="relative">
                              <Play className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-150" />
                              <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-sm transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
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
                            <GlowingButton
                              onClick={(e) => handleTopicStart(phase.id, topic.id, e)}
                              className="text-sm font-medium"
                            >
                              <Play className="w-4 h-4" />
                              <span>Start</span>
                            </GlowingButton>
                          </div>
                        </motion.div>
                      ))}
                      <motion.button
                        onClick={(e) => handleFlipBack(phase.id, e)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">Flip back</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {coursePhases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhaseIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPhaseIndex 
                    ? 'w-8 bg-blue-500' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedPhaseAndTopic && selectedPhaseAndTopic.topic && (
            <motion.div
              ref={subtopicsRef}
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

export default CProgramming;
