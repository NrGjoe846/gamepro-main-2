import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, User, Brain, Star, Award, ChevronDown, ChevronUp, Settings, Save } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import BackButton from '../BackButton';
import { interviewService } from '../../services/interviewService';
import { categories, difficulties } from '../../data/interviewQuestions';

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
  const [error, setError] = useState<string | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const questions = interviewService.getQuestionsForCategory(selectedCategory, difficulty);
    const firstQuestion = questions[0];

    if (firstQuestion) {
      const initialMessages: Message[] = [
        {
          id: Date.now().toString(),
          type: 'bot',
          content: `Welcome to your ${selectedCategory} interview! I'll be asking you questions about ${selectedCategory} concepts.`,
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: firstQuestion.question,
        }
      ];

      setMessages(initialMessages);
      setCurrentQuestion(firstQuestion);
      setPreviousQuestions([firstQuestion.id]);
      setSessionScore(0);
      setError(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentQuestion) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Analyze response
      const analysis = interviewService.analyzeResponse(input, currentQuestion);
      
      // Generate feedback message
      const feedbackMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: analysis.feedback,
        score: analysis.score,
        feedback: analysis.detailedFeedback.join('\n')
      };

      // Generate follow-up question
      const followUpQuestion = interviewService.generateFollowUpQuestion(
        selectedCategory,
        difficulty,
        previousQuestions
      );

      const followUpMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: followUpQuestion
      };

      // Update messages and score
      setTimeout(() => {
        setMessages(prev => [...prev, feedbackMessage, followUpMessage]);
        setSessionScore(prev => prev + analysis.score);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      setError('Unable to process your response. Please try again.');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <BackButton />
          </div>
          
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
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
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              
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
                          {message.score && (
                            <div className="mt-2 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">Score: {message.score}</span>
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
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Score */}
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Session Score</h3>
              </div>
              <animated.div className="text-4xl font-bold text-blue-400">
                {scoreProps.number.to(n => Math.floor(n))}
              </animated.div>
            </div>

            {/* Interview Settings */}
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Settings</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    {difficulties.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewBot;
