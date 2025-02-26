import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthSystem from './components/AuthSystem';
import Dashboard from './components/Dashboard';
import ProfileDashboard from './components/profile/ProfileDashboard';
import CompilerPage from './components/compiler/CompilerPage';
import PythonFundamentals from './components/courses/PythonFundamentals';
import CProgramming from './components/courses/CProgramming';
import JavaProgramming from './components/courses/JavaProgramming';
import ProgrammingCourses from './components/courses/ProgrammingCourses';
import ChallengeCategories from './components/challenges/ChallengeCategories';
import LanguageSelection from './components/challenges/LanguageSelection';
import LevelSelection from './components/challenges/LevelSelection';
import DailyChallenge from './components/challenges/DailyChallenge';
import JavaChallenge from './components/challenges/JavaChallenge.tsx';
import InterviewBot from './components/interview/InterviewBot';
import AptitudeTest from './components/aptitude/AptitudeTest';
import About from './components/About';
import AchievementsPage from './components/achievements/AchievementsPage';
import RewardsPage from './components/rewards/RewardsPage';
import Store from './components/Store';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthSystem />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<Store />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compiler" 
            element={
              <ProtectedRoute>
                <CompilerPage />
              </ProtectedRoute>
            } 
          />
         

          {/* Achievements */}
          <Route 
            path="/achievements" 
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            } 
          />
          {/* Rewards */}
          <Route 
            path="/rewards" 
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            } 
          />

          {/* Courses */}
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <ProgrammingCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/python-fundamentals" 
            element={
              <ProtectedRoute>
                <PythonFundamentals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/c-programming" 
            element={
              <ProtectedRoute>
                <CProgramming />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/java-programming" 
            element={
              <ProtectedRoute>
                <JavaProgramming />
              </ProtectedRoute>
            } 
          />

          {/* Challenges */}
          <Route 
            path="/challenges" 
            element={
              <ProtectedRoute>
                <ChallengeCategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges/language-select" 
            element={
              <ProtectedRoute>
                <LanguageSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges/level-select" 
            element={
              <ProtectedRoute>
                <LevelSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges/daily" 
            element={
              <ProtectedRoute>
                <DailyChallenge />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges/java" 
            element={
              <ProtectedRoute>
                <JavaChallenge />
              </ProtectedRoute>
            } 
          />

          {/* Interview Bot */}
          <Route 
            path="/interview-bot" 
            element={
              <ProtectedRoute>
                <InterviewBot />
              </ProtectedRoute>
            } 
          />

          {/* Aptitude Test */}
          <Route 
            path="/aptitude-test" 
            element={
              <ProtectedRoute>
                <AptitudeTest />
              </ProtectedRoute>
            } 
          />

          {/* Default Route - Redirect to /auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
