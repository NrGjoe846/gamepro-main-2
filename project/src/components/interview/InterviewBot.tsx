import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Brain, Star, Award, X, Send, Mic, Settings, Clock, CheckCircle, AlertTriangle, BarChart } from 'lucide-react';
import BackButton from '../BackButton';

interface OnboardingQuestion {
  id: string;
  question: string;
  options: string[];
  type: 'single' | 'multiple';
}

interface InterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'problem-solving';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedTopics: string[];
  followUps: string[];
}

interface FeedbackMetric {
  category: string;
  score: number;
  feedback: string;
  improvements: string[];
}

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'experience',
    question: 'What is your current experience level?',
    options: ['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5+ years)'],
    type: 'single'
  },
  {
    id: 'role',
    question: 'What role are you interviewing for?',
    options: ['Software Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Full Stack Developer', 'DevOps Engineer'],
    type: 'single'
  },
  {
    id: 'skills',
    question: 'Select your primary technical skills',
    options: ['Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Cloud Platforms'],
    type: 'multiple'
  },
  {
    id: 'focus',
    question: 'What aspects of the interview would you like to focus on?',
    options: ['Technical Questions', 'System Design', 'Problem Solving', 'Behavioral Questions', 'Best Practices'],
    type: 'multiple'
  },
  {
    id: 'duration',
    question: 'Select interview duration',
    options: ['5 minutes', '10 minutes', '15 minutes'],
    type: 'single'
  }
];

const InterviewBot: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user'; content: string; feedback?: string }>>([]); 
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMetric[]>([]);
  const [currentInterviewQuestion, setCurrentInterviewQuestion] = useState<InterviewQuestion | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer Effect
  useEffect(() => {
    if (interviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [interviewStarted, timeRemaining]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionSelect = (questionId: string, option: string) => {
    const question = onboardingQuestions[currentQuestionIndex];
    
    if (question.type === 'single') {
      setAnswers(prev => ({ ...prev, [questionId]: [option] }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId]?.includes(option)
          ? prev[questionId].filter(o => o !== option)
          : [...(prev[questionId] || []), option]
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      startInterview();
    }
  };

  const startInterview = () => {
    setShowOnboarding(false);
    const duration = parseInt(answers['duration']?.[0] || '5');
    setTimeRemaining(duration * 60);
    setInterviewStarted(true);

    // Initial greeting and first question
    const initialMessages = [
      {
        type: 'bot' as const,
        content: `Welcome! I'll be conducting a ${duration}-minute interview focusing on ${answers['focus']?.join(', ')}. Let's make the most of our time.`
      },
      {
        type: 'bot' as const,
        content: 'To start, could you tell me about your background and what interests you about this role?'
      }
    ];
    setMessages(initialMessages);
  };

  const generateNextQuestion = () => {
    const focusAreas = answers['focus'] || [];
    const role = answers['role']?.[0] || '';
    const experience = answers['experience']?.[0] || '';

    // Example question generation based on focus areas and role
    let question = '';
    if (focusAreas.includes('Technical Questions')) {
      question = `Could you explain how you would implement a scalable caching system for a high-traffic web application?`;
    } else if (focusAreas.includes('System Design')) {
      question = `How would you design a real-time notification system that can handle millions of users?`;
    } else if (focusAreas.includes('Behavioral Questions')) {
      question = `Tell me about a challenging project you worked on and how you overcame the obstacles.`;
    } else {
      question = `What's your approach to learning new technologies and staying updated in the field?`;
    }

    return question;
  };

  const analyzePreviousAnswer = (answer: string): string => {
    // Example analysis logic
    const keywords = ['scalable', 'efficient', 'team', 'solved', 'implemented', 'designed'];
    const hasKeywords = keywords.some(keyword => answer.toLowerCase().includes(keyword));
    const isDetailed = answer.length > 100;
    const hasStructure = answer.includes('because') || answer.includes('therefore') || answer.includes('however');

    if (hasKeywords && isDetailed && hasStructure) {
      return 'Your answer was well-structured and detailed. Good use of technical terminology.';
    } else if (isDetailed) {
      return 'Your answer was detailed, but try to include more specific technical terms and examples.';
    } else {
      return 'Consider providing more details and specific examples in your answer.';
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || !interviewStarted) return;

    const userMessage = { type: 'user' as const, content: input };
    const analysis = analyzePreviousAnswer(input);
    const nextQuestion = generateNextQuestion();
    
    const botResponse = {
      type: 'bot' as const,
      content: nextQuestion,
      feedback: analysis
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInput('');
  };

  const endInterview = () => {
    setInterviewStarted(false);
    generateFeedback();
    setShowFeedback(true);
  };

  const generateFeedback = () => {
    // Analyze all responses and generate comprehensive feedback
    const technicalScore = Math.random() * 40 + 60; // Example scoring
    const communicationScore = Math.random() * 30 + 70;
    const problemSolvingScore = Math.random() * 35 + 65;

    const feedbackMetrics: FeedbackMetric[] = [
      {
        category: 'Technical Knowledge',
        score: technicalScore,
        feedback: 'Demonstrated good understanding of core concepts',
        improvements: [
          'Deepen knowledge of system design patterns',
          'Practice more algorithmic problem-solving',
          'Explore advanced features of your primary programming languages'
        ]
      },
      {
        category: 'Communication',
        score: communicationScore,
        feedback: 'Clear and structured responses',
        improvements: [
          'Use more technical terminology when appropriate',
          'Provide more concrete examples from past experiences',
          'Structure answers using the STAR method'
        ]
      },
      {
        category: 'Problem Solving',
        score: problemSolvingScore,
        feedback: 'Good analytical approach to problems',
        improvements: [
          'Practice breaking down complex problems',
          'Consider multiple solutions before implementing',
          'Focus on optimization and scalability'
        ]
      }
    ];

    setFeedback(feedbackMetrics);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <AnimatePresence>
          {showOnboarding ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span>Customizing Your Interview</span>
                  <span>{currentQuestionIndex + 1}/{onboardingQuestions.length}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / onboardingQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold mb-6">
                  {onboardingQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-3">
                  {onboardingQuestions[currentQuestionIndex].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(onboardingQuestions[currentQuestionIndex].id, option)}
                      className={`w-full p-4 text-left rounded-xl transition-all duration-300 ${
                        answers[onboardingQuestions[currentQuestionIndex].id]?.includes(option)
                          ? 'bg-blue-500/30 border-blue-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!answers[onboardingQuestions[currentQuestionIndex].id]?.length}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestionIndex === onboardingQuestions.length - 1 ? 'Start Interview' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {showFeedback ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold mb-6">Interview Feedback</h2>
                    
                    <div className="space-y-6">
                      {feedback.map((metric, index) => (
                        <div key={index} className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-semibold">{metric.category}</h3>
                              <span className="text-sm">{Math.round(metric.score)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${metric.score}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-300 mb-4">{metric.feedback}</p>
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-gray-400">Areas for Improvement:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {metric.improvements.map((improvement, i) => (
                                  <li key={i} className="text-sm text-gray-300">{improvement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
                      >
                        Start New Interview
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="w-6 h-6 text-blue-400" />
                      <div>
                        <h2 className="font-bold">AI Interview Assistant</h2>
                        <p className="text-sm text-gray-400">Customized for {answers['role']?.[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {timeRemaining > 0 && (
                        <div className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="font-mono">{formatTime(timeRemaining)}</span>
                        </div>
                      )}
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-xl p-4 ${
                          message.type === 'user' 
                            ? 'bg-blue-500/20 ml-12' 
                            : 'bg-white/10 mr-12'
                        }`}>
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
                              <p>{message.content}</p>
                              {message.feedback && (
                                <div className="mt-2 text-sm text-gray-400 bg-white/5 p-2 rounded-lg">
                                  <p>{message.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your response..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500/50"
                        />
                        <button
                          onClick={() => setIsRecording(!isRecording)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                            isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10'
                          }`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || !interviewStarted}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewBot;
