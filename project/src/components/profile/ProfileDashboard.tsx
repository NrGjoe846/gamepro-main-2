import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useWindowSize } from 'react-use';
import {
  Trophy, Star, Code, Book, Timer, Target, Award, GitBranch, Zap,
  Activity, Wallet, ChevronRight, Users, Sword, Shield, Crown,
  Gamepad, Gift, Sparkles, Map, Brain, Cpu, Globe, Hexagon
} from 'lucide-react';
import BackButton from '../BackButton';

const ProfileDashboard = () => {
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const { width, height } = useWindowSize();

  // Game stats with animated values
  const gameStats = {
    rank: 'Cosmic Explorer',
    title: 'Neural Navigator',
    powerLevel: 1250,
    questsCompleted: 47,
    bossesDefeated: 12,
    specialItems: 8,
    energyLevel: 85,
    neuralCapacity: 92,
    quantumTokens: 3750
  };

  // Animated stats using react-spring
  const { powerLevel } = useSpring({
    from: { powerLevel: 0 },
    to: { powerLevel: gameStats.powerLevel },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  const { energyLevel } = useSpring({
    from: { energyLevel: 0 },
    to: { energyLevel: gameStats.energyLevel },
    delay: 300,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: 'NeuroCoder', points: 15420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', specialty: 'Quantum Computing' },
    { rank: 2, name: 'ByteMaster', points: 14250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', specialty: 'Neural Networks' },
    { rank: 3, name: 'CyberPilot', points: 13890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', specialty: 'AI Systems' },
  ];

  // Achievements and badges
  const achievements = [
    { id: 1, name: 'Neural Pioneer', icon: '🧠', rarity: 'Legendary', xp: 5000 },
    { id: 2, name: 'Quantum Sage', icon: '⚡', rarity: 'Epic', xp: 3000 },
    { id: 3, name: 'Code Architect', icon: '🏗️', rarity: 'Rare', xp: 2000 },
  ];

  // Active quests
  const activeQuests = [
    { id: 1, title: 'Neural Network Mastery', progress: 75, reward: '500 QT' },
    { id: 2, title: 'Quantum Algorithm Challenge', progress: 45, reward: '750 QT' },
    { id: 3, title: 'Cybersecurity Mission', progress: 90, reward: '1000 QT' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B15] text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Animated Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}

        {/* Energy Waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="space-y-8">
            {/* Profile Card with Glowing Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 overflow-hidden"
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
                <div className="absolute inset-0 bg-[url('/circuit.svg')] opacity-5" />
              </div>

              {/* Avatar with Power Ring */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-40 h-40">
                  {/* Power Ring Animation */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#power-gradient)"
                      strokeWidth="4"
                      strokeDasharray="439.8"
                      strokeDashoffset={440 - (440 * gameStats.powerLevel) / 2000}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="power-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Avatar Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-32 mx-auto mt-4"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic"
                      alt="Profile Avatar"
                      className="w-full h-full rounded-full border-4 border-white/20"
                    />
                    {/* Customization Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAvatarCustomization(true)}
                      className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* User Info */}
                <div className="text-center mt-4 space-y-2">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    Neural Navigator
                  </h2>
                  <p className="text-blue-400">Level {Math.floor(gameStats.powerLevel / 100)}</p>
                  
                  {/* Power Level */}
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <animated.span className="font-bold">
                      {powerLevel.to(n => `Power Level: ${n.toFixed(0)}`)}
                    </animated.span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="relative p-4 bg-white/5 rounded-lg overflow-hidden group hover:bg-white/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Brain className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-blue-400">
                      {gameStats.neuralCapacity}%
                    </div>
                    <div className="text-sm text-gray-400">Neural Capacity</div>
                  </div>
                  
                  <div className="relative p-4 bg-white/5 rounded-lg overflow-hidden group hover:bg-white/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Cpu className="w-6 h-6 text-purple-400 mb-2" />
                    <animated.div className="text-2xl font-bold text-purple-400">
                      {energyLevel.to(n => `${n.toFixed(0)}%`)}
                    </animated.div>
                    <div className="text-sm text-gray-400">Energy Level</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold">Achievements</h2>
                </div>
                <span className="text-sm text-gray-400">{achievements.length} Unlocked</span>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className="relative p-4 bg-white/5 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative flex items-center gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-gray-400">{achievement.rarity}</p>
                      </div>
                      <div className="ml-auto text-yellow-400">+{achievement.xp} XP</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Active Quests and Progress */}
          <div className="space-y-8">
            {/* Active Quests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Map className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Active Quests</h2>
                </div>
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {activeQuests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-4 bg-white/5 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{quest.title}</h3>
                        <span className="text-yellow-400">{quest.reward}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${quest.progress}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats and Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Performance Metrics</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Globe className="w-6 h-6" />, label: 'Global Rank', value: '#42' },
                  { icon: <Trophy className="w-6 h-6" />, label: 'Achievements', value: '24/50' },
                  { icon: <Target className="w-6 h-6" />, label: 'Accuracy', value: '94%' },
                  { icon: <Shield className="w-6 h-6" />, label: 'Defense', value: '850' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-4 bg-white/5 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="text-blue-400">{stat.icon}</div>
                      <div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Leaderboard and Inventory */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold">Neural Elite</h2>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-4 bg-white/5 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center font-bold">
                        #{user.rank}
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-white/20"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.specialty}</div>
                      </div>
                      <div className="ml-auto text-yellow-400">{user.points.toLocaleString()} XP</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Inventory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Hexagon className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Neural Artifacts</h2>
                </div>
                <span className="text-sm text-gray-400">
                  {gameStats.specialItems} Items
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Quantum Core', rarity: 'Legendary', power: 2500 },
                  { name: 'Neural Amplifier', rarity: 'Epic', power: 1800 },
                  { name: 'Synapse Enhancer', rarity: 'Rare', power: 1200 }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative p-4 bg-white/5 rounded-lg border border-white/10 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.rarity}</p>
                        </div>
                      </div>
                      <div className="text-blue-400">{item.power} PWR</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(0.8); }
          }
          .animate-twinkle {
            animation: twinkle 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ProfileDashboard;
