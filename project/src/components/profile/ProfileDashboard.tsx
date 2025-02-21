import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Trophy, Star, Code, Book, Timer, Target, Award, GitBranch, Zap, 
  Activity, Wallet, ChevronRight, Users, Sword, Shield, Crown,
  Gamepad, Gift, Sparkles, Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import { useSpring, animated } from 'react-spring';

const ProfileDashboard = () => {
  const { user } = useAuth();
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Game stats
  const gameStats = {
    rank: 'Gold',
    title: 'Code Warrior',
    powerLevel: 1250,
    questsCompleted: 47,
    bossesDefeated: 12,
    specialItems: 8
  };

  // Virtual economy
  const virtualEconomy = {
    balance: 1250,
    inventory: [
      { id: 1, name: 'Premium Course Access', quantity: 2 },
      { id: 2, name: 'Challenge Tokens', quantity: 5 },
      { id: 3, name: 'Special Badges', quantity: 3 },
    ],
    recentTransactions: [
      { id: 1, type: 'earned', amount: 100, description: 'Completed Python Challenge' },
      { id: 2, type: 'spent', amount: 50, description: 'Purchased Course Access' },
      { id: 3, type: 'earned', amount: 75, description: 'Daily Streak Bonus' },
    ]
  };

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex M.', points: 15420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { rank: 2, name: 'Sarah K.', points: 14250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { rank: 3, name: 'John D.', points: 13890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  ];

  // Animation for power level
  const { powerLevel } = useSpring({
    from: { powerLevel: 0 },
    to: { powerLevel: gameStats.powerLevel },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  // Animation for balance
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: virtualEconomy.balance },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return (
    <div className="min-h-screen bg-[#0B0B15] text-white p-8">
      {/* Circuit Board Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              {/* Power Level Ring */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-sm font-bold">
                  {gameStats.rank}
                </div>
              </div>

              {/* Avatar with Customization */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="5"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: gameStats.powerLevel / 2000 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-32 mx-auto"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      alt="Profile Avatar"
                      className="w-full h-full rounded-full border-4 border-white/20"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAvatarCustomization(true)}
                      className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-2xl font-bold">{user?.name || 'Code Warrior'}</h2>
                  <p className="text-blue-400">{gameStats.title}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <animated.span className="font-bold">
                      {powerLevel.to(n => `Power Level: ${n.toFixed(0)}`)}
                    </animated.span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {gameStats.questsCompleted}
                    </div>
                    <div className="text-sm text-gray-400">Quests</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {gameStats.bossesDefeated}
                    </div>
                    <div className="text-sm text-gray-400">Bosses</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Virtual Currency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Virtual Currency</h2>
                </div>
                <animated.div className="text-2xl font-bold text-yellow-400">
                  {number.to(n => `${n.toFixed(0)} 💰`)}
                </animated.div>
              </div>

              <div className="space-y-4">
                {virtualEconomy.recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className={`text-sm ${
                        transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} 💰
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Achievements and Progress */}
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
                {[
                  { title: 'Complete Python Challenge', progress: 60 },
                  { title: 'Earn 1000 XP', progress: 75 },
                  { title: 'Defeat Boss Level', progress: 30 }
                ].map((quest, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>{quest.title}</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Game Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Gamepad className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Game Stats</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(gameStats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg"
                  >
                    <div className="text-sm text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xl font-bold">{value}</div>
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
                  <Users className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Leaderboard</h2>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
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
                        <div className="text-sm text-gray-400">{user.points.toLocaleString()} XP</div>
                      </div>
                    </div>
                    {index === 0 && (
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
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
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Inventory</h2>
                </div>
                <span className="text-sm text-gray-400">
                  {virtualEconomy.inventory.length} items
                </span>
              </div>

              <div className="space-y-4">
                {virtualEconomy.inventory.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
