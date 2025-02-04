import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
import AuthSystem from './components/AuthSystem';
import Dashboard from './components/Dashboard';
import ProfileDashboard from './components/profile/ProfileDashboard';
import CompilerPage from './components/compiler/CompilerPage';
import PythonFundamentals from './components/courses/PythonFundamentals';
import CProgramming from './components/courses/CProgramming';
import JavaProgramming from './components/courses/JavaProgramming';
import ChallengeCategories from './components/challenges/ChallengeCategories';
import LanguageSelection from './components/challenges/LanguageSelection';
import LevelSelection from './components/challenges/LevelSelection';
import DailyChallenge from './components/challenges/DailyChallenge';
import JavaChallenge from './components/challenges/JavaChallenge.tsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthSystem />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfileDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/compiler"
            element={
              <RequireAuth>
                <CompilerPage />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/python-fundamentals"
            element={
              <RequireAuth>
                <PythonFundamentals />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/c-programming"
            element={
              <RequireAuth>
                <CProgramming />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/java-programming"
            element={
              <RequireAuth>
                <JavaProgramming />
              </RequireAuth>
            }
          />
          <Route
            path="/challenges"
            element={
              <RequireAuth>
                <ChallengeCategories />
              </RequireAuth>
            }
          />
          <Route
            path="/challenges/language-select"
            element={
              <RequireAuth>
                <LanguageSelection />
              </RequireAuth>
            }
          />
          <Route
            path="/challenges/level-select"
            element={
              <RequireAuth>
                <LevelSelection />
              </RequireAuth>
            }
          />
          <Route
            path="/challenges/daily"
            element={
              <RequireAuth>
                <DailyChallenge />
              </RequireAuth>
            }
          />
          <Route
            path="/challenges/java"
            element={
              <RequireAuth>
                <JavaChallenge />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
