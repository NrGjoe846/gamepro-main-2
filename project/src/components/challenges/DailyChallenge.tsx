import React from 'react';
import { Star, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DailyChallenge = () => {
  const navigate = useNavigate();

  const handleStartChallenge = () => {import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Trophy, Code2, Zap, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import CodeEditor from '../CodeEditor/CodeEditor';
import { geminiService, Challenge, CodeValidationResult } from '../../services/geminiService';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [result, setResult] = useState<CodeValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const { width, height } = useWindowSize();

  useEffect(() => {
    loadDailyChallenge();
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadDailyChallenge = async () => {
    try {
      // TODO: Get user level from context/state
      const userLevel = 'beginner';
      const newChallenge = await geminiService.generateDailyChallenge(userLevel);
      setChallenge(newChallenge);
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeLeft = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    try {
      const validationResult = await geminiService.validateSolution(
        challenge,
        userCode,
        'python' // TODO: Make language dynamic
      );

      setResult(validationResult);
      setAttempts(prev => prev + 1);

      if (validationResult.isCorrect) {
        handleSuccess();
      } else if (attempts >= 1) {
        setShowHints(true);
      }
    } catch (error) {
      console.error('Error validating solution:', error);
    }
  };

  const handleSuccess = () => {
    setShowConfetti(true);
    // TODO: Update user progress, XP, and streak
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const getNextHint = async () => {
    if (!challenge || currentHint >= 2) return;
    
    try {
      const hint = await geminiService.getProgressiveHint(
        challenge,
        userCode,
        currentHint + 1
      );
      setCurrentHint(prev => prev + 1);
      // TODO: Update UI with new hint
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      {showConfetti && <Confetti width={width} height={height} />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold">Daily Coding Challenge</h1>
              <p className="text-gray-400">Keep your streak alive!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>{timeLeft}</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>100 XP</span>
            </div>
          </div>
        </div>

        {challenge && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Challenge Description */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">{challenge.title}</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">{challenge.description}</p>

                  <div className="bg-black/30 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Example:</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">Input: {challenge.sampleInput}</p>
                      <p className="text-gray-300">Output: {challenge.sampleOutput}</p>
                    </div>
                  </div>

                  {showHints && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Hints:</h3>
                      {challenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-500/10 rounded-lg text-sm text-gray-300"
                        >
                          {hint}
                        </div>
                      ))}
                      {currentHint < 2 && (
                        <button
                          onClick={getNextHint}
                          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Get Next Hint
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <div className={`backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 ${
                  result.isCorrect ? 'border-green-500/50' : 'border-red-500/50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <h3 className="font-bold">
                      {result.isCorrect ? 'Success!' : 'Keep Trying!'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-300">{result.feedback}</p>
                    
                    {!result.isCorrect && (
                      <>
                        <div className="text-sm">
                          <span className="text-gray-400">Efficiency: </span>
                          <span>{result.efficiency}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Readability: </span>
                          <span>{result.readability}</span>
                        </div>
                        {result.suggestions.length > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-400">Suggestions:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {result.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                onSubmit={handleSubmit}
                language="python"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
    navigate('/challenges/select');
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold">Daily Challenge</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>12:00:00</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Python Programming Challenge
        </h3>
        <p className="text-gray-300">
          Test your Python skills with our daily coding challenges. Complete
          these challenges to earn XP and special badges!
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>100 XP</span>
          </div>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">
            Python
          </div>
        </div>
        <button
          onClick={handleStartChallenge}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge;
