import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, Code, Play, CheckCircle, Lock, ChevronDown, ChevronUp, 
  AlertCircle, ChevronLeft, ChevronRight, Star, Trophy, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import GlowingButton from '../ui/GlowingButton';
import QuizPopup from '../quiz/QuizPopup';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

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
    id: "phase-1",
    title: "Phase 1: Python Basics and Core Concepts",
    description: "This phase is focused on understanding Python syntax, basic operations, and foundational topics. It sets up the building blocks for becoming proficient in Python.",
    icon: "🐍",
    topics: [
      {
        id: "intro",
        title: "1. Introduction to Python Programming",
        description: "Get started with Python programming language basics",
        completed: false,
        locked: false,
        subtopics: [
          { id: "installing-python", title: "Installing Python (Anaconda, PyCharm, or basic Python)", completed: false },
          { id: "ide-setup", title: "Setting up the IDE", completed: false },
          { id: "first-program", title: "Writing your first Python program: print(\"Hello, World!\")", completed: false },
          { id: "syntax", title: "Python syntax, keywords, and comments", completed: false },
          { id: "interpreter", title: "Python's interpreter vs. compiled languages", completed: false }
        ]
      },
      {
        id: "data-types",
        title: "2. Basic Data Types and Variables",
        description: "Learn about Python data types and variable declarations",
        completed: false,
        locked: false,
        subtopics: [
          { id: "numbers", title: "Numbers (integers, floats, complex)", completed: false },
          { id: "strings", title: "Strings", completed: false },
          { id: "booleans", title: "Booleans", completed: false },
          { id: "type-conversion", title: "Type conversion (int to float, string to int, etc.)", completed: false },
          { id: "naming-conventions", title: "Variable naming conventions and dynamic typing", completed: false }
        ]
      },
      {
        id: "operators",
        title: "3. Operators and Expressions",
        description: "Master Python operators and expressions",
        completed: false,
        locked: false,
        subtopics: [
          { id: "arithmetic", title: "Arithmetic operators: +, -, *, /, //, %, *", completed: false },
          { id: "comparison", title: "Comparison operators: ==, !=, >, <, >=, <=", completed: false },
          { id: "logical", title: "Logical operators: and, or, not", completed: false },
          { id: "assignment", title: "Assignment operators: =, +=", completed: false },
          { id: "bitwise", title: "Bitwise operators (optional for beginners)", completed: false }
        ]
      },
      {
        id: "control-flow",
        title: "4. Control Flow: Conditionals and Loops",
        description: "Understanding control structures in Python",
        completed: false,
        locked: false,
        subtopics: [
          { id: "conditionals", title: "Conditionals: if, elif, else", completed: false },
          { id: "for-loops", title: "for loops (with range and iterables)", completed: false },
          { id: "while-loops", title: "while loops", completed: false },
          { id: "loop-control", title: "Loop control statements: break, continue, pass", completed: false },
          { id: "nested-loops", title: "Nested loops and conditionals", completed: false }
        ]
      },
      {
        id: "functions",
        title: "5. Functions and Modular Code",
        description: "Working with functions in Python",
        completed: false,
        locked: false,
        subtopics: [
          { id: "defining-functions", title: "Defining functions using def", completed: false },
          { id: "parameters", title: "Function parameters and return values", completed: false },
          { id: "scope", title: "Function scope: local vs global variables", completed: false },
          { id: "default-params", title: "Default parameters and keyword arguments", completed: false },
          { id: "lambda-functions", title: "Lambda functions (anonymous functions)", completed: false },
          { id: "recursion", title: "Understanding recursion (optional for beginners)", completed: false }
        ]
      },
      {
        id: "io",
        title: "6. Basic Input and Output",
        description: "Working with input and output operations in Python",
        completed: false,
        locked: false,
        subtopics: [
          { id: "user-input", title: "User input using input()", completed: false },
          { id: "output-formatting", title: "Output formatting using print()", completed: false },
          { id: "string-interpolation", title: "String interpolation (f-strings, % formatting, .format())", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2: Data Structures and Collections",
    description: "In this phase, you'll learn how to store and manipulate collections of data, which is essential for almost every programming task.",
    icon: "📦",
    topics: [
      {
        id: "lists",
        title: "7. Lists",
        description: "Learn how to create and manipulate lists in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "creating-modifying-lists", title: "Creating and modifying lists", completed: false },
          { id: "dictionary-creation", title: "Creating dictionaries", completed: false },
          { id: "access-modify-delete", title: "Accessing, modifying, and deleting key-value pairs", completed: false },
          { id: "dictionary-methods", title: "Dictionary methods: keys(), values(), items()", completed: false },
          { id: "dictionary-comprehensions", title: "Dictionary comprehensions", completed: false }
        ]
      },
      {
        id: "tuples",
        title: "8. Tuples",
        description: "Understand tuples and their properties.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "creating-tuples", title: "Creating tuples and understanding immutability", completed: false },
          { id: "packing-unpacking", title: "Tuple packing and unpacking", completed: false },
          { id: "tuples-as-keys", title: "Using tuples as dictionary keys", completed: false }
        ]
      },
      {
        id: "dictionaries",
        title: "9. Dictionaries",
        description: "Learn how to work with dictionaries in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "creating-dictionaries", title: "Creating dictionaries", completed: false },
          { id: "access-modify-delete-dict", title: "Accessing, modifying, and deleting key-value pairs", completed: false },
          { id: "dict-methods", title: "Dictionary methods: keys(), values(), items()", completed: false },
          { id: "dict-comprehensions", title: "Dictionary comprehensions", completed: false }
        ]
      },
      {
        id: "sets",
        title: "10. Sets",
        description: "Learn about sets and their operations.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "creating-using-sets", title: "Creating and using sets", completed: false },
          { id: "set-operations", title: "Set operations: union, intersection, difference, symmetric difference", completed: false },
          { id: "set-methods", title: "Set methods: add(), remove(), discard()", completed: false }
        ]
      },
      {
        id: "string-manipulation",
        title: "11. String Manipulation",
        description: "Explore string manipulation techniques in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "string-slicing-indexing", title: "String slicing and indexing", completed: false },
          { id: "string-methods", title: "String methods: split(), join(), replace(), strip(), etc.", completed: false },
          { id: "string-formatting", title: "String formatting with f-strings and .format()", completed: false },
          { id: "multi-line-strings", title: "Working with multi-line strings", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3: Intermediate Topics",
    description: "In this phase, you'll explore deeper into Python features that are crucial for writing cleaner, more efficient, and more reliable code.",
    icon: "🔍",
    topics: [
      {
        id: "file-handling",
        title: "12. File Handling",
        description: "Learn how to read from and write to files in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "reading-writing", title: "Reading from and writing to text files", completed: false },
          { id: "file-modes", title: "File modes: r, w, a, x", completed: false },
          { id: "context-managers", title: "Context managers with with open() for safe file handling", completed: false },
          { id: "csv-handling", title: "Handling CSV files (optional)", completed: false }
        ]
      },
      {
        id: "error-exception-handling",
        title: "13. Error and Exception Handling",
        description: "Understand how to handle errors and exceptions in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "try-except", title: "Try-except blocks for catching exceptions", completed: false },
          { id: "raising-exceptions", title: "Raising exceptions with raise", completed: false },
          { id: "finally", title: "Using finally for clean-up actions", completed: false },
          { id: "custom-exceptions", title: "Custom exceptions (optional)", completed: false }
        ]
      },
      {
        id: "oop-basics",
        title: "14. Object-Oriented Programming (OOP) Basics",
        description: "Learn the fundamentals of OOP in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "defining-classes", title: "Defining and using classes", completed: false },
          { id: "creating-objects", title: "Creating objects (instances)", completed: false },
          { id: "instance-variables", title: "Instance variables and methods", completed: false },
          { id: "constructor", title: "Constructor: __init__()", completed: false },
          { id: "class-variables", title: "Class variables and methods", completed: false },
          { id: "inheritance", title: "Inheritance and method overriding", completed: false },
          { id: "self-super", title: "Understanding self and super()", completed: false },
          { id: "encapsulation", title: "Encapsulation and private members (using _ and __)", completed: false }
        ]
      },
      {
        id: "modules-packages",
        title: "15. Modules and Packages",
        description: "Learn how to work with modules and packages in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "importing-modules", title: "Importing standard Python modules: math, os, random, etc.", completed: false },
          { id: "custom-modules", title: "Writing and importing custom modules", completed: false },
          { id: "using-packages", title: "Using packages: understanding the __init__.py file", completed: false },
          { id: "installing-packages", title: "Installing external packages using pip", completed: false }
        ]
      },
      {
        id: "working-with-libraries",
        title: "16. Working with Libraries",
        description: "Explore essential libraries in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "math-library", title: "Math Library: Basic mathematical functions like sqrt(), pow(), sin()", completed: false },
          { id: "random-library", title: "Random Library: Generating random numbers, selecting random elements", completed: false },
          { id: "os-library", title: "OS Library: Working with file systems, directories, and environment variables", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-4",
    title: "Phase 4: Working with Data and Basic Algorithms",
    description: "Once you have a good grasp of Python’s core syntax, it’s important to learn how to work with data and create algorithms.",
    icon: "📊",
    topics: [
      {
        id: "data-structures",
        title: "17. Data Structures: Stacks, Queues, and Linked Lists (optional but useful)",
        description: "Learn about essential data structures and their implementations.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "stacks", title: "Implementing stacks using lists", completed: false },
          { id: "queues", title: "Implementing queues with deque from the collections module", completed: false },
          { id: "linked-lists", title: "Simple linked lists (for understanding)", completed: false }
        ]
      },
      {
        id: "sorting-searching",
        title: "18. Sorting and Searching Algorithms (optional for beginners)",
        description: "Understand and implement basic sorting and searching algorithms.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "sorting-algorithms", title: "Understanding basic sorting algorithms: Bubble sort, Insertion sort, Merge sort", completed: false },
          { id: "searching-algorithms", title: "Searching algorithms: Linear search, Binary search", completed: false },
          { id: "built-in-functions", title: "Built-in functions: sorted(), min(), max(), sum()", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-5",
    title: "Phase 5: Advanced Beginner Topics",
    description: "These topics bridge the gap between beginner and intermediate levels, giving you practical skills in real-world programming.",
    icon: "🚀",
    topics: [
      {
        id: "regular-expressions",
        title: "19. Basic Regular Expressions",
        description: "Learn to use regular expressions for pattern matching.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "re-module", title: "Using the re module for pattern matching", completed: false },
          { id: "common-patterns", title: "Common regex patterns for matching text, digits, and special characters", completed: false },
          { id: "search-replace", title: "Searching and replacing text with sub()", completed: false }
        ]
      },
      {
        id: "debugging-testing",
        title: "20. Debugging and Testing",
        description: "Understand debugging techniques and testing in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "print-debugging", title: "Print debugging: Using print statements to understand code flow", completed: false },
          { id: "logging", title: "Logging: Using the logging module for structured log messages", completed: false },
          { id: "unit-testing", title: "Basic Unit Testing: Writing unit tests using Python’s unittest module", completed: false },
          { id: "running-tests", title: "Running tests and interpreting results", completed: false }
        ]
      },
      {
        id: "databases",
        title: "21. Basic Introduction to Databases (Optional)",
        description: "Introduction to working with SQL databases in Python.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "sqlite3", title: "Introduction to working with SQL databases in Python using sqlite3", completed: false },
          { id: "crud-operations", title: "Performing basic CRUD operations (Create, Read, Update, Delete)", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-6",
    title: "Phase 6: Project Development and Version Control",
    description: "This phase focuses on applying your knowledge by building projects and understanding version control.",
    icon: "🛠️",
    topics: [
      {
        id: "version-control",
        title: "22. Version Control with Git and GitHub",
        description: "Learn the basics of version control using Git and GitHub.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "git-commands", title: "Basic Git commands: git init, git add, git commit, git push", completed: false },
          { id: "branching", title: "Understanding branching: git branch, git checkout", completed: false },
          { id: "github-repositories", title: "Working with GitHub repositories: pushing and pulling code", completed: false }
        ]
      },
      {
        id: "small-projects",
        title: "23. Building Small Projects",
        description: "Apply your skills by building small projects.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "calculator-app", title: "Simple calculator app", completed: false },
          { id: "todo-list", title: "To-do list manager (using file I/O)", completed: false },
          { id: "number-guessing", title: "Number guessing game", completed: false },
          { id: "web-scraper", title: "Basic web scraper (using requests and BeautifulSoup)", completed: false }
        ]
      }
    ]
  },
  {
    id: "phase-7",
    title: "Phase 7: Continuous Learning and Practice",
    description: "The final phase is about practicing and refining your skills. Work on more projects and dive into areas that interest you, like web development, data science, or automation.",
    icon: "📚",
    topics: [
      {
        id: "project-based-learning",
        title: "24. Project-Based Learning",
        description: "Engage in practical projects to enhance your skills.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "coding-challenges", title: "Participate in coding challenges (e.g., HackerRank, LeetCode)", completed: false },
          { id: "larger-projects", title: "Build larger projects:", completed: false },
          { id: "api-interaction", title: "Basic API interaction (fetching data from an API)", completed: false },
          { id: "web-app", title: "Simple web app with Flask or Django (optional)", completed: false }
        ]
      },
      {
        id: "specialized-libraries",
        title: "25. Explore Specialized Libraries and Fields",
        description: "Learn about various libraries and fields to expand your knowledge.",
        completed: false,
        locked: false,
        subtopics: [
          { id: "web-development", title: "Web Development: Flask, Django", completed: false },
          { id: "data-science", title: "Data Science: NumPy, Pandas, Matplotlib", completed: false },
          { id: "automation", title: "Automation: selenium, pyautogui", completed: false }
        ]
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizTopic, setCurrentQuizTopic] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('pythonProgress');
    return saved ? JSON.parse(saved) : {
      completedTopics: [],
      completedSubtopics: {},
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletedDate: null
    };
  });

  const phasesContainerRef = useRef<HTMLDivElement>(null);
  const subtopicsRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragThreshold = 5;
  const [dragDistance, setDragDistance] = useState(0);

  useEffect(() => {
    scrollToCurrentPhase();
  }, [currentPhaseIndex]);

  useEffect(() => {
    localStorage.setItem('pythonProgress', JSON.stringify(userProgress));
  }, [userProgress]);

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

      if (phaseId === 'phase-1' && topicId === 'intro') {
        setCurrentQuizTopic('Introduction to Python Programming');
        setShowQuiz(true);
      }

      setTimeout(() => {
        subtopicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSubtopicStart = (topicTitle: string, subtopicTitle: string) => {
    setCurrentQuizTopic(subtopicTitle);
    setShowQuiz(true);
  };

  const calculateXP = (difficulty: string): number => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 50;
      case 'intermediate': return 100;
      case 'advanced': return 200;
      default: return 50;
    }
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    setShowConfetti(true);

    if (selectedTopic) {
      const phase = coursePhases.find(p => p.id === selectedTopic.phaseId);
      const topic = phase?.topics.find(t => t.id === selectedTopic.topicId);
      
      if (topic && topic.subtopics) {
        const subtopic = topic.subtopics.find(s => s.title === currentQuizTopic);
        if (subtopic) {
          const newCompletedSubtopics = {
            ...userProgress.completedSubtopics,
            [selectedTopic.topicId]: [
              ...(userProgress.completedSubtopics[selectedTopic.topicId] || []),
              subtopic.id
            ]
          };

          const baseXP = calculateXP(topic.difficulty || 'beginner');
          const bonusXP = Math.floor(score * baseXP / 100);
          const totalXP = baseXP + bonusXP;

          const today = new Date().toDateString();
          const streakBonus = userProgress.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()
            ? userProgress.streak + 1
            : 1;

          const newXP = userProgress.xp + totalXP;
          const newLevel = Math.floor(newXP / 1000) + 1;

          setUserProgress(prev => ({
            ...prev,
            completedSubtopics: newCompletedSubtopics,
            xp: newXP,
            level: newLevel,
            streak: streakBonus,
            lastCompletedDate: today
          }));

          const allSubtopicsCompleted = topic.subtopics.every(s => 
            newCompletedSubtopics[selectedTopic.topicId]?.includes(s.id)
          );

          if (allSubtopicsCompleted) {
            setUserProgress(prev => ({
              ...prev,
              completedTopics: [...prev.completedTopics, topic.id]
            }));
          }
        }
      }
    }

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const selectedPhaseAndTopic = selectedTopic ? {
    phase: coursePhases.find(p => p.id === selectedTopic.phaseId),
    topic: coursePhases
      .find(p => p.id === selectedTopic.phaseId)
      ?.topics.find(t => t.id === selectedTopic.topicId)
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      {showConfetti && <Confetti width={width} height={height} />}
      
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

        <div className="fixed top-4 right-4 flex items-center gap-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">{userProgress.xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-400" />
            <span className="font-bold">Level {userProgress.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="font-bold">{userProgress.streak} Day Streak</span>
          </div>
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
                          {userProgress.completedSubtopics[selectedTopic?.topicId]?.includes(subtopic.id) ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-500" />
                          )}
                          <span className="text-sm">{subtopic.title}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubtopicStart(selectedPhaseAndTopic.topic.title, subtopic.title)}
                          className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                          disabled={userProgress.completedSubtopics[selectedTopic?.topicId]?.includes(subtopic.id)}
                        >
                          <Play className="w-3 h-3" />
                          {userProgress.completedSubtopics[selectedTopic?.topicId]?.includes(subtopic.id) 
                            ? 'Completed' 
                            : 'Start'
                          }
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <QuizPopup
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
          moduleTitle={currentQuizTopic}
        />
      </div>
    </div>
  );
};

export default PythonFundamentals;
