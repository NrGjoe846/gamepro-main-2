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
interface Phase {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  expanded?: boolean;
  icon: string;
  backgroundImage: string;
}


const coursePhases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Introduction and Basic Concepts',
    description: 'Master the fundamentals of C programming language and build a strong foundation.',
    icon: '🎯',
    topics: [
      {
        id: 'intro',
        title: '1. Introduction to C Programming',
        description: 'Understanding C programming fundamentals',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'what-is-c', title: 'What is C?', completed: false },
          { id: 'setup', title: 'Setting up the C Environment (GCC, Code::Blocks, VS Code)', completed: false },
          { id: 'write-run', title: 'Writing and Running a C Program', completed: false },
          { id: 'structure', title: 'Structure of a C Program', completed: false }
        ]
      },
      {
        id: 'data-types',
        title: '2. Basic Data Types and Variables',
        description: 'Learn about C data types and variable declarations',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'data-types', title: 'Data Types (int, float, char, double)', completed: false },
          { id: 'variables', title: 'Declaring and Initializing Variables', completed: false },
          { id: 'constants', title: 'Constants and #define', completed: false }
        ]
      },
      {
        id: 'operators',
        title: '3. Operators in C',
        description: 'Understanding operators in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'basic-operators', title: 'Arithmetic, Relational, Logical, Bitwise, and Assignment Operators', completed: false },
          { id: 'inc-dec', title: 'Increment (++), Decrement (--)', completed: false }
        ]
      },
      {
        id: 'io',
        title: '4. Basic Input and Output',
        description: 'Working with input and output in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'printf-scanf', title: 'printf() and scanf()', completed: false },
          { id: 'char-io', title: 'getchar(), putchar(), gets(), puts()', completed: false }
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
        id: 'conditional-statements',
        title: '1. Conditional Statements',
        description: 'Understanding control structures in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'if-else', title: 'if, if-else statements', completed: false },
          { id: 'nested-if', title: 'nested if-else statements', completed: false },
          { id: 'switch-case', title: 'switch-case statements', completed: false }
        ]
      },
      {
        id: 'loops',
        title: '2. Loops and Iterations',
        description: 'Working with loops in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'for-loop', title: 'for loop', completed: false },
          { id: 'while-loop', title: 'while loop', completed: false },
          { id: 'do-while', title: 'do-while loop', completed: false },
          { id: 'break-continue', title: 'break and continue statements', completed: false }
        ]
      },
      {
        id: 'functions',
        title: '3. Functions and Modular Programming',
        description: 'Understanding functions in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'function-basics', title: 'Function Declaration, Definition, and Calling', completed: false },
          { id: 'function-args', title: 'Function Arguments and Return Values', completed: false },
          { id: 'recursion', title: 'Recursion', completed: false }
        ]
      },
      {
        id: 'storage-classes',
        title: '4. Storage Classes in C',
        description: 'Understanding storage classes in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'auto', title: 'auto storage class', completed: false },
          { id: 'static', title: 'static storage class', completed: false },
          { id: 'extern', title: 'extern storage class', completed: false },
          { id: 'register', title: 'register storage class', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Arrays, Strings, and Pointers',
    description: 'Master arrays, strings, and pointer manipulation in C',
    icon: '📚',
    topics: [
      {
        id: 'arrays',
        title: '1. Arrays',
        description: 'Working with arrays in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'one-dim', title: 'One-Dimensional and Two-Dimensional Arrays', completed: false },
          { id: 'multi-dim', title: 'Multi-Dimensional Arrays', completed: false }
        ]
      },
      {
        id: 'strings',
        title: '2. Strings in C',
        description: 'Understanding strings and string manipulation',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'string-funcs', title: 'String Functions (strlen(), strcpy(), strcat(), strcmp())', completed: false },
          { id: 'char-arrays', title: 'Character Arrays and String Manipulation', completed: false }
        ]
      },
      {
        id: 'pointers',
        title: '3. Pointers',
        description: 'Understanding pointers in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'pointer-basics', title: 'Pointer Basics (* and & Operators)', completed: false },
          { id: 'pointer-arithmetic', title: 'Pointer Arithmetic', completed: false },
          { id: 'pointers-arrays', title: 'Pointers and Arrays', completed: false }
        ]
      },
      {
        id: 'dynamic-memory',
        title: '4. Dynamic Memory Allocation',
        description: 'Managing memory dynamically in C',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'memory-funcs', title: 'malloc(), calloc(), realloc(), free()', completed: false }
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
      "id": "structures-unions",
      "title": "1. Structures and Unions",
      "description": "Defining and using structures, arrays of structures, nested structures, typedef, and unions.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "defining-structures", "title": "Defining and Using Structures", "completed": false },
        { "id": "arrays-of-structures", "title": "Arrays of Structure", "completed": false },
        { "id": "nested-structures", "title": "Nested Structures", "completed": false },
        { "id": "typedef-unions", "title": "typedef and Unions", "completed": false }
      ]
    },
    {
      "id": "file-handling",
      "title": "2. File Handling in C",
      "description": "Working with file operations like open, read, write, and close.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "file-operations", "title": "File Operations: Open, Read, Write, Close", "completed": false },
        { "id": "file-functions", "title": "File Handling Functions (fopen(), fclose(), fscanf(), fprintf())", "completed": false }
      ]
    },
    {
      "id": "preprocessor-macros",
      "title": "3. Preprocessor Directives and Macros",
      "description": "Understanding #define, #include, #ifdef, and #ifndef.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "define-include", "title": "#define, #include", "completed": false },
        { "id": "ifdef-ifndef", "title": "#ifdef, #ifndef", "completed": false }
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
      "id": "intro-data-structures",
      "title": "1. Introduction to Data Structures",
      "description": "Understanding Data Structures and Abstract Data Types (ADTs).",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "understanding-ds", "title": "Understanding Data Structures", "completed": false },
        { "id": "adt", "title": "Abstract Data Types (ADTs)", "completed": false }
      ]
    },
    {
      "id": "linked-lists",
      "title": "2. Linked Lists",
      "description": "Learn about different types of linked lists.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "singly-linked-list", "title": "Singly Linked List", "completed": false },
        { "id": "doubly-linked-list", "title": "Doubly Linked List", "completed": false },
        { "id": "circular-linked-list", "title": "Circular Linked List", "completed": false }
      ]
    },
    {
      "id": "stacks-queues",
      "title": "3. Stacks and Queues",
      "description": "Learn about stack and queue operations.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "stack-operations", "title": "Stack Operations (Push, Pop)", "completed": false },
        { "id": "queue-operations", "title": "Queue Operations (Enqueue, Dequeue)", "completed": false }
      ]
    },
    {
      "id": "sorting-algorithms",
      "title": "4. Sorting Algorithms",
      "description": "Understand different sorting techniques.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "bubble-sort", "title": "Bubble Sort", "completed": false },
        { "id": "selection-sort", "title": "Selection Sort", "completed": false },
        { "id": "insertion-sort", "title": "Insertion Sort", "completed": false },
        { "id": "merge-sort", "title": "Merge Sort", "completed": false },
        { "id": "quick-sort", "title": "Quick Sort", "completed": false }
      ]
    },
    {
      "id": "searching-algorithms",
      "title": "5. Searching Algorithms",
      "description": "Learn how to search efficiently in data structures.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "linear-search", "title": "Linear Search", "completed": false },
        { "id": "binary-search", "title": "Binary Search", "completed": false }
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
      "id": "bitwise-operations",
      "title": "1. Bitwise Operations",
      "description": "Learn about bitwise manipulation in C.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "bitwise-and-or-xor", "title": "AND, OR, XOR, NOT", "completed": false },
        { "id": "bitwise-shifts", "title": "Left Shift, Right Shift", "completed": false }
      ]
    },
    {
      "id": "command-line-arguments",
      "title": "2. Command-Line Arguments",
      "description": "Understand how to work with command-line arguments in C.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "argc-argv", "title": "Understanding argc and argv[]", "completed": false }
      ]
    },
    {
      "id": "multi-file-programming",
      "title": "3. Multi-File Programming",
      "description": "Learn how to organize C programs into multiple files.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "modular-code", "title": "Writing Modular Code with Multiple Source Files", "completed": false },
        { "id": "extern-keyword", "title": "Using extern for Global Variables", "completed": false }
      ]
    },
    {
      "id": "debugging-techniques",
      "title": "4. Debugging Techniques",
      "description": "Explore debugging strategies to find and fix errors.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "using-gdb", "title": "Using gdb for Debugging", "completed": false },
        { "id": "segfault-memory-leaks", "title": "Understanding Segmentation Faults and Memory Leaks", "completed": false }
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
      "id": "optimizing-c-programs",
      "title": "1. Optimizing C Programs",
      "description": "Learn how to write efficient and optimized C code.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "performance-techniques", "title": "Performance Improvement Techniques", "completed": false },
        { "id": "avoiding-mistakes", "title": "Avoiding Common Mistakes", "completed": false }
      ]
    },
    {
      "id": "building-small-projects",
      "title": "2. Building Small C Projects",
      "description": "Work on hands-on projects to apply your knowledge.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "mini-calculator", "title": "Mini Calculator", "completed": false },
        { "id": "file-management-system", "title": "File Management System", "completed": false },
        { "id": "student-record-system", "title": "Student Record System", "completed": false }
      ]
    },
    {
      "id": "real-world-applications",
      "title": "3. Real-World Applications of C",
      "description": "Explore the practical applications of C programming.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "system-programming", "title": "System Programming", "completed": false },
        { "id": "embedded-systems", "title": "Embedded Systems", "completed": false },
        { "id": "game-development", "title": "Game Development", "completed": false }
      ]
    },
    {
      "id": "keeping-up-with-c",
      "title": "4. Keeping Up with C Programming",
      "description": "Learn about advanced C topics and open-source projects.",
      "completed": false,
      "locked": false,
      "subtopics": [
        { "id": "advanced-topics", "title": "Learning Advanced Topics (Multithreading, Networking in C)", "completed": false },
        { "id": "open-source", "title": "Understanding Open-Source C Projects", "completed": false }
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
                  <div className="absolute inset-0 backface-hidden">
  <div 
    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl"
    style={{
      backgroundImage: `url(${phase.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.15
    }}
  />
  {/* Rest of the card content */}
</div>

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
