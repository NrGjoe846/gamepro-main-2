import React from 'react';
import { GraduationCap, Code, Atom, Trophy, Users, Activity, Terminal, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import LearningPath from './LearningPath';
import ProgressCard from './ProgressCard';
import NextLessonCard from './NextLessonCard';
import DailyChallenge from './DailyChallenge';
import AchievementBadge from './gamification/AchievementBadge';
import FloatingCompiler from './FloatingCompiler';
import ProgrammingCourses from './courses/ProgrammingCourses';

const Dashboard = () => {
  const recentAchievements = [
    { id: 1, title: 'First Code', icon: '🚀', description: 'Wrote your first line of code' },
    { id: 2, title: '7 Day Streak', icon: '🔥', description: 'Coded for 7 days in a row' },
    { id: 3, title: 'Bug Hunter', icon: '🐛', description: 'Fixed 10 coding errors' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B15] text-white overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section with Enhanced Space Theme */}
      <div className="relative min-h-[90vh] pt-20">
        {/* Animated Space Background with Enhanced Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Stars with Enhanced Twinkling */}
          <div className="absolute inset-0">
            {[...Array(200)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random(),
                  transform: `scale(${Math.random() * 0.5 + 0.5})`
                }}
              />
            ))}
          </div>

          {/* Animated Rockets */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-rocket"
              style={{
                top: `${Math.random() * 100}%`,
                left: `-50px`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${Math.random() * 5 + 10}s`
              }}
            >
              <div className="relative">
                <span className="text-2xl">🚀</span>
                <div className="absolute -left-4 top-1/2 w-8 h-2 bg-gradient-to-l from-blue-500/50 to-transparent rounded-full blur-sm animate-pulse" />
              </div>
            </div>
          ))}

          {/* Floating Planets with Enhanced Glow */}
          <div className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-lg animate-float-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-40 left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 blur-lg animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              UNAI Verse
            </h1>
            <p className="text-2xl text-gray-300 mb-8 animate-fade-in">
              Your Journey Through The Code Galaxy Begins Here
            </p>
          </div>

          {/* Daily Challenge Section */}
          <div className="mb-12 animate-slide-up">
            <DailyChallenge />
          </div>

          {/* Recent Achievements */}
          <div className="mb-12 animate-slide-up-delayed">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} {...achievement} />
              ))}
            </div>
          </div>

          {/* Programming Courses Section */}
          <div className="mb-12 animate-slide-up-delayed-2">
            <ProgrammingCourses />
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 animate-slide-up-delayed-3">
            <Link to="/miniproject">
              <LearningPath 
                icon={<Code2 className="w-8 h-8" />}
                title="MiniProject.Diy"
                description="Turn your Imagination into Reality"
                progress={65}
              />
            </Link>
            <Link to="/aptitude-test">
              <LearningPath 
                icon={<Atom className="w-8 h-8" />}
                title="Aptitude test"
                description="Test your self"
                progress={42}
              />
            </Link>
            <Link to="/interview-bot">
              <LearningPath 
                icon={<Activity className="w-8 h-8" />}
                title="AI interview BOT"
                description="Take an interview test from our interview expert"
                progress={28}
              />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 animate-slide-up-delayed-4">
            <ProgressCard />
            <NextLessonCard />
          </div>
        </div>
      </div>

      {/* Floating Compiler Button */}
      <FloatingCompiler />

      {/* Add enhanced space-themed animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(0.8); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
          }

          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }

          @keyframes rocket {
            0% { 
              transform: translateX(-100px) translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% { 
              transform: translateX(calc(100vw + 100px)) translateY(-100px) rotate(15deg);
              opacity: 0;
            }
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-twinkle {
            animation: twinkle 3s ease-in-out infinite;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
          }

          .animate-rocket {
            animation: rocket 15s linear infinite;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s linear infinite;
          }

          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }

          .animate-slide-up {
            animation: slideUp 0.8s ease-out;
          }

          .animate-slide-up-delayed {
            animation: slideUp 0.8s ease-out 0.2s backwards;
          }

          .animate-slide-up-delayed-2 {
            animation: slideUp 0.8s ease-out 0.4s backwards;
          }

          .animate-slide-up-delayed-3 {
            animation: slideUp 0.8s ease-out 0.6s backwards;
          }

          .animate-slide-up-delayed-4 {
            animation: slideUp 0.8s ease-out 0.8s backwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
