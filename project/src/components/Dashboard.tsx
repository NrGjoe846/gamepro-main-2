import React, { useState } from 'react';
import { GraduationCap, User, Settings, Bell, Menu, X, Gift, Compass, BookOpen, Trophy, Code2, ChevronRight, ChevronDown, ChevronUp, Coffee, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import LearningPath from './LearningPath';
import ProgressCard from './ProgressCard';
import NextLessonCard from './NextLessonCard';
import DailyChallenge from './DailyChallenge';
import AchievementBadge from './gamification/AchievementBadge';
import FloatingCompiler from './FloatingCompiler';

const courses = [
  {
    id: 'python',
    title: 'Python Fundamentals',
    icon: '🐍',
    color: 'from-blue-500/20 to-green-500/20',
    path: '/courses/python-fundamentals',
    phases: [
      {
        title: "Phase 1: Python Basics",
        description: "Learn Python fundamentals and syntax",
        progress: 80,
        icon: "🚀"
      },
      {
        title: "Phase 2: Data Structures",
        description: "Master lists, dictionaries, and sets",
        progress: 65,
        icon: "📚"
      },
      {
        title: "Phase 3: Functions & OOP",
        description: "Understand functions and object-oriented programming",
        progress: 45,
        icon: "⚡"
      },
      {
        title: "Phase 4: File Handling",
        description: "Work with files and error handling",
        progress: 30,
        icon: "📁"
      },
      {
        title: "Phase 5: Modules & Packages",
        description: "Learn about modules and package management",
        progress: 20,
        icon: "📦"
      },
      {
        title: "Phase 6: Advanced Topics",
        description: "Explore advanced Python concepts",
        progress: 10,
        icon: "🔥"
      },
      {
        title: "Phase 7: Projects",
        description: "Build real-world Python applications",
        progress: 5,
        icon: "🏗️"
      }
    ]
  },
  {
    id: 'java',
    title: 'Java Programming',
    icon: '☕',
    color: 'from-orange-500/20 to-red-500/20',
    path: '/courses/java-programming',
    phases: [
      {
        title: "Phase 1: Java Basics",
        description: "Learn Java syntax and fundamentals",
        progress: 60,
        icon: "🚀"
      },
      {
        title: "Phase 2: Object-Oriented Programming",
        description: "Master classes, objects, and inheritance",
        progress: 40,
        icon: "🎯"
      },
      {
        title: "Phase 3: Collections Framework",
        description: "Work with lists, sets, and maps",
        progress: 25,
        icon: "📚"
      },
      {
        title: "Phase 4: Exception Handling",
        description: "Learn error handling and debugging",
        progress: 15,
        icon: "🛠️"
      },
      {
        title: "Phase 5: File I/O",
        description: "Handle file operations and streams",
        progress: 10,
        icon: "📁"
      },
      {
        title: "Phase 6: Multithreading",
        description: "Understand concurrent programming",
        progress: 5,
        icon: "⚡"
      },
      {
        title: "Phase 7: Advanced Java",
        description: "Explore advanced Java concepts",
        progress: 0,
        icon: "🔥"
      }
    ]
  },
  {
    id: 'c',
    title: 'C Programming',
    icon: '⚙️',
    color: 'from-purple-500/20 to-blue-500/20',
    path: '/courses/c-programming',
    phases: [
      {
        title: "Phase 1: C Basics",
        description: "Learn C syntax and fundamentals",
        progress: 70,
        icon: "🚀"
      },
      {
        title: "Phase 2: Functions & Arrays",
        description: "Master functions and array operations",
        progress: 55,
        icon: "📊"
      },
      {
        title: "Phase 3: Pointers",
        description: "Understand memory management",
        progress: 35,
        icon: "🎯"
      },
      {
        title: "Phase 4: Structures",
        description: "Work with custom data types",
        progress: 20,
        icon: "🏗️"
      },
      {
        title: "Phase 5: File Operations",
        description: "Handle file I/O operations",
        progress: 15,
        icon: "📁"
      },
      {
        title: "Phase 6: Dynamic Memory",
        description: "Learn dynamic memory allocation",
        progress: 10,
        icon: "💾"
      },
      {
        title: "Phase 7: Advanced C",
        description: "Explore advanced C concepts",
        progress: 5,
        icon: "🔥"
      }
    ]
  }
];

const Dashboard = () => {
  const [showCourses, setShowCourses] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const recentAchievements = [
    { id: 1, title: 'First Code', icon: '🚀', description: 'Wrote your first line of code' },
    { id: 2, title: '7 Day Streak', icon: '🔥', description: 'Coded for 7 days in a row' },
    { id: 3, title: 'Bug Hunter', icon: '🐛', description: 'Fixed 10 coding errors' },
  ];

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedPhase(null);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section with Floating Elements */}
      <div className="relative min-h-[90vh] pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="particles-container" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              UNAI Verse
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The Next Generation of Learning
            </p>
          </div>

          {/* Course Section Toggle */}
          <div className="mb-8">
            <button
              onClick={() => setShowCourses(!showCourses)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              <span>My Courses</span>
              {showCourses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Courses Section */}
          <AnimatePresence>
            {showCourses && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12 overflow-hidden"
              >
                <div className="grid gap-8">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="group relative"
                    >
                      {/* Course Header */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${course.color} rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100`} />
                      <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{course.icon}</div>
                            <div>
                              <h3 className="text-xl font-bold">{course.title}</h3>
                              <p className="text-sm text-gray-400">
                                {course.phases.length} phases • {
                                  course.phases.reduce((acc, phase) => acc + phase.progress, 0) / course.phases.length
                                }% complete
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCourse(course.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {expandedCourse === course.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Course Phases */}
                        <AnimatePresence>
                          {expandedCourse === course.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-4"
                            >
                              {course.phases.map((phase, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative"
                                >
                                  <div className="relative backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="text-2xl">{phase.icon}</div>
                                        <div>
                                          <h4 className="font-bold">{phase.title}</h4>
                                          <p className="text-sm text-gray-400">{phase.description}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="w-32">
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Progress</span>
                                            <span>{phase.progress}%</span>
                                          </div>
                                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${phase.progress}%` }}
                                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            />
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => togglePhase(`${course.id}-${index}`)}
                                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                          {expandedPhase === `${course.id}-${index}` ? (
                                            <ChevronUp className="w-4 h-4" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    <AnimatePresence>
                                      {expandedPhase === `${course.id}-${index}` && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="mt-4 pt-4 border-t border-white/10"
                                        >
                                          <Link
                                            to={course.path}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                          >
                                            <Code2 className="w-4 h-4" />
                                            <span>Start Learning</span>
                                            <ChevronRight className="w-4 h-4" />
                                          </Link>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily Challenge Section */}
          <div className="mb-12">
            <DailyChallenge />
          </div>

          {/* Recent Achievements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} {...achievement} />
              ))}
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <LearningPath 
              icon={<Code2 className="w-8 h-8" />}
              title="MiniProject.Diy"
              description="Turn your Imagination into Reality"
              progress={65}
            />
            <Link to="/aptitude-test">
              <LearningPath 
                icon={<Compass className="w-8 h-8" />}
                title="Aptitude test"
                description="Test your self"
                progress={42}
              />
            </Link>
            <LearningPath 
              icon={<Trophy className="w-8 h-8" />}
              title="AI interview BOT"
              description="Take an interview test from our interview expert"
              progress={28}
            />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <ProgressCard />
            <NextLessonCard />
          </div>
        </div>
      </div>

      {/* Floating Compiler Button */}
      <FloatingCompiler />
    </div>
  );
};

export default Dashboard;
