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
    title: 'Phase 1: Java Basics and Core Concepts',
    description: 'Master the fundamentals of Java programming language and build a strong foundation.',
    icon: '☕',
    topics: [
      {
        id: 'intro',
        title: '1. Introduction to Java Programming',
        description: 'Get started with Java programming language basics',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'jdk-setup', title: 'Installing Java (JDK, JRE)', completed: false },
          { id: 'ide-setup', title: 'Setting up the IDE (IntelliJ IDEA, Eclipse, or VS Code)', completed: false },
          { id: 'first-program', title: 'Writing your first Java program: Hello, World!', completed: false },
          { id: 'syntax', title: 'Java syntax, keywords, and comments', completed: false },
          { id: 'jvm', title: 'Understanding the Java Virtual Machine (JVM)', completed: false }
        ]
      },
      {
        id: 'data-types',
        title: '2. Basic Data Types and Variables',
        description: 'Learn about Java data types and variable declarations',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'primitive-types', title: 'Primitive data types: int, double, char, boolean', completed: false },
          { id: 'variables', title: 'Variables and constants (final keyword)', completed: false },
          { id: 'type-casting', title: 'Type casting: implicit and explicit', completed: false },
          { id: 'naming', title: 'Variable naming conventions', completed: false }
        ]
      },
   {
        id: 'operators',
        title: '3. Operators and Expressions',
        description: 'Master Java operators and expressions',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'arithmetic', title: 'Arithmetic operators: +, -, *, /, %', completed: false },
          { id: 'comparison', title: 'Comparison operators: ==, !=, >, <, >=, <=', completed: false },
          { id: 'logical', title: 'Logical operators: &&, ||, !', completed: false },
          { id: 'assignment', title: 'Assignment operators: =, +=, -=, *=, /=', completed: false },
          { id: 'ternary', title: 'Ternary operator: ? :', completed: false }
        ]
      },
      {
        id: 'control-flow',
        title: '4. Control Flow: Conditionals and Loops',
        description: 'Understanding control structures in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'conditionals', title: 'Conditionals: if, else if, else', completed: false },
          { id: 'switch', title: 'Switch-case statements', completed: false },
          { id: 'for-loops', title: 'for loops', completed: false },
          { id: 'while-loops', title: 'while and do-while loops', completed: false },
          { id: 'loop-control', title: 'Loop control statements: break, continue', completed: false }
        ]
      },
      {
        id: 'methods',
        title: '5. Functions (Methods)',
        description: 'Working with methods in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'method-basics', title: 'Defining methods using public, private, static', completed: false },
          { id: 'parameters', title: 'Method parameters and return values', completed: false },
          { id: 'overloading', title: 'Method overloading', completed: false },
          { id: 'recursion', title: 'Recursion (optional for beginners)', completed: false }
        ]
      },
      {
        id: 'io',
        title: '6. Basic Input and Output',
        description: 'Working with input and output operations in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'scanner', title: 'User input using Scanner class', completed: false },
          { id: 'output', title: 'Output using System.out.println()', completed: false },
          { id: 'formatting', title: 'Formatting output with printf()', completed: false }
        ]
      }
  ]
      },
  {
    id: 'phase-2',
    title: 'Phase 2: Object-Oriented Programming',
    description: 'Master object-oriented programming concepts in Java',
    icon: '🎯',
    topics: [
      {
        id: 'intro-oop',
        title: '7. Introduction to OOP',
        description: 'Understanding fundamental OOP concepts',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'classes-objects', title: 'Classes and objects', completed: false },
          { id: 'instance-vars', title: 'Instance variables and methods', completed: false },
          { id: 'constructors', title: 'Constructors: default and parameterized', completed: false },
          { id: 'this-keyword', title: 'this keyword', completed: false }
        ]
      },
      {
        id: 'encapsulation',
        title: '8. Encapsulation and Access Modifiers',
        description: 'Understanding encapsulation and access control',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'access-modifiers', title: 'Private vs public access modifiers', completed: false },
          { id: 'getters-setters', title: 'Getters and setters', completed: false },
          { id: 'encapsulation-principles', title: 'Encapsulation principles', completed: false }
        ]
      },
      {
        id: 'inheritance',
        title: '9. Inheritance',
        description: 'Understanding inheritance and class extensions',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'extends', title: 'Extending classes using extends', completed: false },
          { id: 'method-overriding', title: 'Method overriding', completed: false },
          { id: 'super-keyword', title: 'super keyword', completed: false },
          { id: 'inheritance-types', title: 'Types of inheritance: single, multilevel, hierarchical', completed: false }
        ]
      },
      {
        id: 'polymorphism',
        title: '10. Polymorphism',
        description: 'Understanding polymorphism in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'method-overloading', title: 'Method overloading (compile-time polymorphism)', completed: false },
          { id: 'method-overriding-runtime', title: 'Method overriding (runtime polymorphism)', completed: false },
          { id: 'dynamic-dispatch', title: 'Dynamic method dispatch', completed: false }
        ]
      },
      {
        id: 'abstraction',
        title: '11. Abstraction and Interfaces',
        description: 'Understanding abstraction and interfaces',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'abstract-classes', title: 'Abstract classes and methods', completed: false },
          { id: 'interfaces', title: 'Interfaces and their implementation', completed: false },
          { id: 'multiple-inheritance', title: 'Multiple inheritance using interfaces', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Data Structures and Collections',
    description: 'Master Java data structures and collections framework',
    icon: '📚',
    topics: [
      {
        id: 'arrays',
        title: '12. Arrays',
        description: 'Working with arrays in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'array-basics', title: 'Single-dimensional and multi-dimensional arrays', completed: false },
          { id: 'array-manipulation', title: 'Array manipulation: sorting, searching', completed: false },
          { id: 'enhanced-for', title: 'Enhanced for loop', completed: false }
        ]
      },
      {
        id: 'collections',
        title: '13. Collections Framework',
        description: 'Understanding Java Collections Framework',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'lists', title: 'Lists: ArrayList, LinkedList', completed: false },
          { id: 'sets', title: 'Sets: HashSet, TreeSet', completed: false },
          { id: 'maps', title: 'Maps: HashMap, TreeMap', completed: false },
          { id: 'iterators', title: 'Iterators and for-each loop', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Exception Handling and File I/O',
    description: 'Master error handling and file operations in Java',
    icon: '🔧',
    topics: [
      {
        id: 'exceptions',
        title: '14. Exception Handling',
        description: 'Understanding Java exception handling',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'try-catch', title: 'Try-catch blocks', completed: false },
          { id: 'multiple-catch', title: 'Multiple catch blocks', completed: false },
          { id: 'finally', title: 'Finally block', completed: false },
          { id: 'custom-exceptions', title: 'Custom exceptions', completed: false }
        ]
      },
          {
        id: 'file-io',
        title: '15. File Handling',
        description: 'Working with files in Java',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'file-rw', title: 'Reading from and writing to files using FileReader, FileWriter', completed: false },
          { id: 'buffered-rw', title: 'Using BufferedReader and BufferedWriter', completed: false },
          { id: 'file-exceptions', title: 'Handling file exceptions', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Advanced Java Concepts',
    description: 'Master advanced Java concepts including multithreading and generics',
    icon: '🚀',
    topics: [
      {
        id: 'multithreading',
        title: '16. Multithreading',
        description: 'Learn Java multithreading and concurrency',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'thread-creation', title: 'Creating threads using Thread class and Runnable interface', completed: false },
          { id: 'thread-sync', title: 'Thread synchronization', completed: false },
          { id: 'thread-lifecycle', title: 'Thread lifecycle', completed: false }
        ]
      },
      {
        id: 'generics',
        title: '17. Generics',
        description: 'Understanding Java generics and type parameters',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'generic-classes', title: 'Generic classes and methods', completed: false },
          { id: 'type-params', title: 'Type parameters', completed: false },
          { id: 'bounded-types', title: 'Bounded types', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'Phase 6: Working with Libraries and APIs',
    description: 'Learn to work with Java libraries and interact with APIs',
    icon: '📚',
    topics: [
      {
        id: 'standard-library',
        title: '18. Java Standard Library',
        description: 'Working with Java standard libraries',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'java-util', title: 'Working with java.util, java.io, java.math', completed: false },
          { id: 'string-builders', title: 'Using StringBuilder and StringBuffer', completed: false },
          { id: 'date-time', title: 'Date and time API (java.time)', completed: false }
        ]
      },
      {
        id: 'apis',
        title: '19. Working with APIs',
        description: 'Learn to interact with external APIs',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'http-requests', title: 'Sending HTTP requests using HttpURLConnection', completed: false },
          { id: 'json-parsing', title: 'Parsing JSON data using libraries like Gson or Jackson', completed: false }
        ]
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Phase 7: Project Development and Continuous Learning',
    description: 'Apply your knowledge through projects and explore advanced topics',
    icon: '🏗️',
    topics: [
      {
        id: 'version-control',
        title: '20. Version Control with Git',
        description: 'Learn Git basics and GitHub workflow',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'git-basics', title: 'Basic Git commands: git init, add, commit, push', completed: false },
          { id: 'branching', title: 'Branching and merging', completed: false },
          { id: 'github', title: 'Working with GitHub', completed: false }
        ]
      },
      {
        id: 'projects',
        title: '21. Building Projects',
        description: 'Build real-world Java applications',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'banking-system', title: 'Project 1: Simple Banking System', completed: false },
          { id: 'student-management', title: 'Project 2: Student Management System', completed: false },
          { id: 'quiz-app', title: 'Project 3: Online Quiz Application', completed: false }
        ]
      },
      {
        id: 'advanced-topics',
        title: '22. Exploring Advanced Topics',
        description: 'Explore advanced Java frameworks and testing',
        completed: false,
        locked: false,
        subtopics: [
          { id: 'javafx', title: 'JavaFX for GUI development', completed: false },
          { id: 'spring-boot', title: 'Spring Boot for web development', completed: false },
          { id: 'unit-testing', title: 'Unit Testing with JUnit', completed: false }
        ]
      }
    ]
  }
];
     

const JavaProgramming = () => {
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

export default JavaProgramming;
