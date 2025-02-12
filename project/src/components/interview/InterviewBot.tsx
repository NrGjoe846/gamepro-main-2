import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, User, Brain, Star, Award, ChevronDown, ChevronUp, Settings, Save } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  feedback?: string;
  score?: number;
}

interface InterviewSession {
  category: string;
  difficulty: string;
  score: number;
  duration: number;
  date: Date;
}

const API_KEY = "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";

const InterviewBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<InterviewSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'data-science', name: 'Data Science', icon: '📊' },
    { id: 'machine-learning', name: 'Machine Learning', icon: '🤖' },
    { id: 'deep-learning', name: 'Deep Learning', icon: '🧠' },
    { id: 'statistics', name: 'Statistics', icon: '📈' },
    { id: 'python', name: 'Python Programming', icon: '🐍' },
    { id: 'sql', name: 'SQL & Databases', icon: '💾' },
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', color: 'green' },
    { id: 'intermediate', name: 'Intermediate', color: 'blue' },
    { id: 'advanced', name: 'Advanced', color: 'purple' },
    { id: 'expert', name: 'Expert', color: 'red' },
  ];

  // Animation for score
  const scoreProps = useSpring({
    number: sessionScore,
    from: { number: 0 },
    config: { mass: 1, tension: 20, friction: 10 },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startInterview = async () => {
    if (!selectedCategory) return;

    const initialMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Welcome to your ${selectedCategory} interview! I'll be asking you questions about ${selectedCategory} concepts. Are you ready to begin?`,
    };

    setMessages([initialMessage]);
    setSessionScore(0);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are an AI interviewer specializing in ${selectedCategory}. Provide detailed feedback and follow-up questions.` },
            { role: 'user', content: input }
          ],
        }),
      });

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      // Calculate response score (simplified example)
      const score = Math.floor(Math.random() * 30) + 70; // 70-100 range
      setSessionScore(prev => prev + score);

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        feedback: generateFeedback(score),
        score: score,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFeedback = (score: number): string => {
    if (score >= 90) return "Excellent response! Very comprehensive and well-structured.";
    if (score >= 80) return "Good answer! Consider adding more specific examples.";
    if (score >= 70) return "Decent response. Try to be more detailed in your explanation.";
    return "Your answer needs improvement. Focus on key concepts.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {!selectedCategory ? (
          // Category Selection Screen
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold text-center mb-12">
              Select Interview Category
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Practice {category.name} interview questions
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Interview Interface
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Interview Stats</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Current Score</p>
                    <animated.div className="text-3xl font-bold text-blue-400">
                      {scoreProps.number.to(n => Math.floor(n))}
                    </animated.div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Questions</p>
                    <p className="text-xl font-bold">{Math.floor(messages.length / 2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Difficulty</p>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-white/10 rounded-lg px-3 py-2 mt-1"
                    >
                      {difficulties.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Session History */}
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Past Sessions</h2>
                </div>
                <div className="space-y-4">
                  {sessionHistory.map((session, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{session.category}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 font-bold">{session.score}</p>
                          <p className="text-sm text-gray-400">{session.duration}min</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 flex flex-col h-[800px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="w-8 h-8 text-blue-400" />
                    <div>
                      <h2 className="text-xl font-bold">AI Interview Assistant</h2>
                      <p className="text-sm text-gray-400">{selectedCategory} Interview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[80%] ${
                        message.type === 'user' 
                          ? 'bg-blue-500/20 ml-12' 
                          : 'bg-white/10 mr-12'
                      } rounded-xl p-4`}>
                        <div className="flex items-start gap-3">
                          {message.type === 'bot' ? (
                            <Bot className="w-6 h-6 text-blue-400" />
                          ) : (
                            <User className="w-6 h-6 text-purple-400" />
                          )}
                          <div>
                            <p className="text-sm mb-1">
                              {message.type === 'bot' ? 'AI Assistant' : 'You'}
                            </p>
                            <p className="text-base">{message.content}</p>
                            {message.feedback && (
                              <div className="mt-2 p-2 bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-400">{message.feedback}</p>
                                {message.score && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-yellow-400">
                                      Score: {message.score}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <Bot className="w-6 h-6 text-blue-400" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
                        isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Interview Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    {difficulties.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Interview Focus
                  </label>
                  <div className="space-y-2">
                    {['Technical Questions', 'Behavioral Questions', 'Case Studies'].map((focus) => (
                      <label key={focus} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox bg-white/10 border-white/20 rounded"
                        />
                        <span>{focus}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Interview Duration
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save settings
                    setShowSettings(false);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewBot;
