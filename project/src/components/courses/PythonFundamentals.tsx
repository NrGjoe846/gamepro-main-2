import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, Code, Play, CheckCircle, Lock, ChevronDown, ChevronUp, 
  AlertCircle, ChevronLeft, ChevronRight, Star, Trophy, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import GlowingButton from '../ui/GlowingButton';
import PythonQuizPopup from '../quiz/PythonQuizPopup';
import PythonFlashcards from '../quiz/PythonFlashcards';
import PythonVideo from '../quiz/PythonVideo';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { coursePhases } from "./PythonCourseData";

interface Topic {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  locked: boolean;
  subtopics?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface Phase {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  expanded?: boolean;
  icon: string;
}

const PythonFundamentals = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [flippedPhase, setFlippedPhase] = useState<string | null>(null);
  const [sparklePhase, setSparklePhase] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ phaseId: string; topicId: string } | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizTopic, setCurrentQuizTopic] = useState<string>('');
  const [currentQuizSubtopic, setCurrentQuizSubtopic] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('pythonProgress');
    return saved ? JSON.parse(saved) : {
      completedTopics: [],
      completedSubtopics: {},
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletedDate: null
    };
  });

  const phasesContainerRef = useRef<HTMLDivElement>(null);
  const subtopicsRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragThreshold = 5;
  const [dragDistance, setDragDistance] = useState(0);

  useEffect(() => {
    scrollToCurrentPhase();
  }, [currentPhaseIndex]);

  useEffect(() => {
    localStorage.setItem('pythonProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const getPhaseProgress = (phase: Phase) => {
    const totalSubtopics = phase.topics.reduce((sum, topic) => 
      sum + (topic.subtopics?.length || 0), 0);
    const completedSubtopics = phase.topics.reduce((sum, topic) => {
      const completed = userProgress.completedSubtopics[topic.id] || [];
      return sum + completed.length;
    }, 0);
    return totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  };

  const scrollToCurrentPhase = () => {
    if (phasesContainerRef.current) {
      const container = phasesContainerRef.current;
      const phaseElement = container.children[currentPhaseIndex] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const phaseWidth = phaseElement.offsetWidth;
      const newScrollLeft = phaseElement.offsetLeft - (containerWidth / 2) + (phaseWidth / 2);
      container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!phasesContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - phasesContainerRef.current.offsetLeft);
    setScrollLeft(phasesContainerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !phasesContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - phasesContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    phasesContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUp = () => {
    if (!isDragging || !phasesContainerRef.current) return;
    setIsDragging(false);
    if (dragDistance > dragThreshold) {
      const container = phasesContainerRef.current;
      const phaseWidth = container.children[0].clientWidth;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / phaseWidth);
      setCurrentPhaseIndex(Math.max(0, Math.min(newIndex, coursePhases.length - 1)));
    }
  };

  const handlePrevPhase = () => {
    setCurrentPhaseIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPhase = () => {
    setCurrentPhaseIndex(prev => Math.min(coursePhases.length - 1, prev + 1));
  };

  const handlePhaseClick = (index: number) => {
    if (dragDistance <= dragThreshold) {
      setCurrentPhaseIndex(index);
      setSelectedTopic(null);
      setExpandedTopic(null);
    }
  };

  const handlePhaseStart = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSparklePhase(phaseId);
    const sparkles = Array.from({ length: 8 }).map((_, i) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute w-2 h-2 bg-blue-400 rounded-full';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
      sparkle.style.animation = `sparkle ${Math.random() * 0.5 + 0.5}s ease-in-out ${i * 0.1}s`;
      return sparkle;
    });
    const target = e.currentTarget as HTMLElement;
    sparkles.forEach(sparkle => target.appendChild(sparkle));
    setTimeout(() => sparkles.forEach(sparkle => sparkle.remove()), 1000);
    setTimeout(() => setSparklePhase(null), 500);
    if (flippedPhase !== phaseId) setFlippedPhase(phaseId);
  };

  const handleFlipBack = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedPhase(null);
  };

  const handleTopicStart = (phaseId: string, topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTopic?.topicId === topicId) {
      setExpandedTopic(null);
      setSelectedTopic(null);
    } else {
      setExpandedTopic(topicId);
      setSelectedTopic({ phaseId, topicId });
      setTimeout(() => subtopicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const isSubtopicLocked = (phaseId: string, topicId: string, subtopicIndex: number) => {
    const phase = coursePhases.find(p => p.id === phaseId);
    const topic = phase?.topics.find(t => t.id === topicId);
    
    if (!topic?.subtopics || subtopicIndex === 0) {
      return false;
    }

    const previousSubtopic = topic.subtopics[subtopicIndex - 1];
    const completedSubtopics = userProgress.completedSubtopics[topicId] || [];
    
    return !completedSubtopics.includes(previousSubtopic.id);
  };

  const handleSubtopicStart = (topicTitle: string, subtopicTitle: string) => {
    if (!selectedTopic) return;

    const phase = coursePhases.find(p => p.id === selectedTopic.phaseId);
    const topic = phase?.topics.find(t => t.id === selectedTopic.topicId);
    const subtopicIndex = topic?.subtopics?.findIndex(s => s.title === subtopicTitle);

    if (subtopicIndex !== undefined && subtopicIndex >= 0 && 
        isSubtopicLocked(selectedTopic.phaseId, selectedTopic.topicId, subtopicIndex)) {
      console.log('Subtopic is locked. Complete previous subtopic first.');
      return;
    }

    console.log('Starting subtopic:', { topicTitle, subtopicTitle });
    setCurrentQuizTopic(topicTitle);
    setCurrentQuizSubtopic(subtopicTitle);

    const isPhase1Topic1 = 
      coursePhases[0].topics[0].title === topicTitle &&
      (subtopicTitle === coursePhases[0].topics[0].subtopics?.[0].title ||
       subtopicTitle === coursePhases[0].topics[0].subtopics?.[1].title);

    if (isPhase1Topic1) {
      setShowVideo(true);
    } else {
      setShowFlashcards(true);
    }
  };

  const handleStartQuiz = () => {
    setShowFlashcards(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    setShowQuiz(false);
    setShowConfetti(true);

    if (selectedTopic) {
      const phase = coursePhases.find(p => p.id === selectedTopic.phaseId);
      const topic = phase?.topics.find(t => t.id === selectedTopic.topicId);

      if (topic && topic.subtopics) {
        const subtopic = topic.subtopics.find(s => s.title === currentQuizSubtopic);
        if (subtopic) {
          const newCompletedSubtopics = {
            ...userProgress.completedSubtopics,
            [selectedTopic.topicId]: [
              ...(userProgress.completedSubtopics[selectedTopic.topicId] || []),
              subtopic.id
            ]
          };

          const baseXP = 50;
          const bonusXP = Math.floor(score * baseXP / 100);
          const totalXP = baseXP + bonusXP;

          const today = new Date().toDateString();
          const streakBonus = userProgress.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()
            ? userProgress.streak + 1
            : 1;

          const newXP = userProgress.xp + totalXP;
          const newLevel = Math.floor(newXP / 1000) + 1;

          setUserProgress(prev => ({
            ...prev,
            completedSubtopics: newCompletedSubtopics,
            xp: newXP,
            level: newLevel,
            streak: streakBonus,
            lastCompletedDate: today
          }));

          const allSubtopicsCompleted = topic.subtopics.every(s =>
            newCompletedSubtopics[selectedTopic.topicId]?.includes(s.id)
          );

          if (allSubtopicsCompleted) {
            setUserProgress(prev => ({
              ...prev,
              completedTopics: [...prev.completedTopics, topic.id]
            }));
          }
        }
      }
    }

    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleVideoClose = () => {
    setShowVideo(false);
  };

  const handleVideoComplete = () => {
    setShowVideo(false);
    if (selectedTopic) {
      const phase = coursePhases.find(p => p.id === selectedTopic.phaseId);
      const topic = phase?.topics.find(t => t.id === selectedTopic.topicId);
      const subtopic = topic?.subtopics?.find(s => s.title === currentQuizSubtopic);
      if (subtopic) {
        setUserProgress(prev => ({
          ...prev,
          completedSubtopics: {
            ...prev.completedSubtopics,
            [selectedTopic.topicId]: [
              ...(prev.completedSubtopics[selectedTopic.topicId] || []),
              subtopic.id
            ]
          },
          xp: prev.xp + 25
        }));
      }
    }
  };

  const selectedPhaseAndTopic = selectedTopic ? {
    phase: coursePhases.find(p => p.id === selectedTopic.phaseId),
    topic: coursePhases.find(p => p.id === selectedTopic.phaseId)?.topics.find(t => t.id === selectedTopic.topicId)
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      {showConfetti && <Confetti width={width} height={height} />}
      
      <style>
        {`
          @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); }
            50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
            100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); }
          }
        `}
      </style>
      
      <div className="max-w-full mx-auto relative">
        {/* Updated XP/Level/Streak Overlay - Integrated into page layout */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-[#1a1a2e]/95 via-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md p-4 rounded-b-xl shadow-lg border-b border-blue-500/20 mb-8">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="font-bold text-blue-200">{userProgress.xp}</span>
                <span className="text-sm text-blue-300/70">XP</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-blue-200">Lv. {userProgress.level}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-5 h-5 text-blue-400 animate-[pulseGlow_2s_infinite]" />
                <span className="font-bold text-blue-200">{userProgress.streak}</span>
                <span className="text-sm text-blue-300/70">Streak</span>
              </motion.div>
            </div>
            <div className="w-1/3 h-2 bg-gray-700/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${((userProgress.xp % 1000) / 1000) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <BackButton />
        </div>

        <div className="flex justify-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-24 h-24 md:w-32 md:h-32">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-blue-400/50 flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-blue-500/30">
              <span className="text-4xl md:text-5xl select-none">{coursePhases[currentPhaseIndex].icon}</span>
            </div>
          </motion.div>
        </div>

        <div className="relative mb-12">
          <button
            onClick={handlePrevPhase}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm transition-opacity duration-300 ${
              currentPhaseIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70'
            }`}
            disabled={currentPhaseIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextPhase}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full backdrop-blur-sm transition-opacity duration-300 ${
              currentPhaseIndex === coursePhases.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70'
            }`}
            disabled={currentPhaseIndex === coursePhases.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={phasesContainerRef}
            className="flex gap-6 overflow-x-auto px-4 py-2 no-scrollbar touch-pan-x"
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {coursePhases.map((phase, index) => {
              const progress = getPhaseProgress(phase);
              return (
                <motion.div
                  key={phase.id}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: index === currentPhaseIndex ? 1 : 0.8, opacity: index === currentPhaseIndex ? 1 : 0.6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: index === currentPhaseIndex ? 1.02 : 0.85, transition: { duration: 0.15 } }}
                  whileTap={{ scale: index === currentPhaseIndex ? 0.98 : 0.8, transition: { duration: 0.1 } }}
                  className={`relative min-w-[300px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer select-none ${
                    index === currentPhaseIndex ? 'ring-2 ring-blue-500/50' : 'filter grayscale'
                  }`}
                  onClick={() => handlePhaseClick(index)}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <motion.div
                    className="relative w-full h-full transition-all preserve-3d"
                    animate={{ rotateY: flippedPhase === phase.id ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl"
                      style={{
                        backgroundImage: `url(${phase.backgroundImage || '/placeholder-image.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.50
                      }}
                    />

                    <div className="absolute inset-0 backface-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                      <div className="relative h-full p-6 flex flex-col">
                        <div className="text-4xl mb-4 select-none">{phase.icon}</div>
                        <h3 className="text-xl font-bold mb-2 select-none">{phase.title}</h3>
                        <p className="text-sm text-gray-400 mb-4 select-none">{phase.description}</p>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1 text-blue-300/70">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-3 bg-gray-700/30 rounded-full overflow-hidden relative">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            >
                              <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
                            </motion.div>
                          </div>
                        </div>
                        {index === currentPhaseIndex && (
                          <motion.button
                            onClick={(e) => handlePhaseStart(phase.id, e)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 group select-none relative overflow-hidden"
                          >
                            {sparklePhase === phase.id ? (
                              <AlertCircle className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '0.5s' }} />
                            ) : (
                              <div className="relative">
                                <Play className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-150" />
                                <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-sm transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            )}
                            Flip to see topics
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl overflow-y-auto">
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold mb-4">{phase.title} Topics</h3>
                        {phase.topics.map((topic) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold mb-1">{topic.title}</h4>
                                <p className="text-sm text-gray-400">{topic.description}</p>
                              </div>
                              <GlowingButton
                                onClick={(e) => handleTopicStart(phase.id, topic.id, e)}
                                className="text-sm font-medium"
                              >
                                <Play className="w-4 h-4" />
                                <span>View</span>
                              </GlowingButton>
                            </div>
                          </motion.div>
                        ))}
                        <motion.button
                          onClick={(e) => handleFlipBack(phase.id, e)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="relative z-10">Flip back</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {coursePhases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhaseIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPhaseIndex ? 'w-8 bg-blue-500' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedPhaseAndTopic && selectedPhaseAndTopic.topic && (
            <motion.div
              ref={subtopicsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 mt-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedPhaseAndTopic.topic.title} Subtopics</h3>
                <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2">
                  {expandedTopic === selectedPhaseAndTopic.topic.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {expandedTopic === selectedPhaseAndTopic.topic.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {selectedPhaseAndTopic.topic.subtopics?.map((subtopic, index) => {
                      const isLocked = isSubtopicLocked(selectedPhaseAndTopic.phase.id, selectedPhaseAndTopic.topic.id, index);
                      const isCompleted = userProgress.completedSubtopics[selectedTopic?.topicId]?.includes(subtopic.id);

                      return (
                        <motion.div
                          key={subtopic.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`flex items-center justify-between p-3 rounded-lg backdrop-blur-xl border border-white/10 ${
                            isLocked ? 'bg-gray-800/70 cursor-not-allowed' : 'bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-500" />
                            )}
                            <span className={`text-sm ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                              {subtopic.title}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: isLocked ? 1 : 1.05 }}
                            whileTap={{ scale: isLocked ? 1 : 0.95 }}
                            onClick={() => !isLocked && handleSubtopicStart(selectedPhaseAndTopic.topic.title, subtopic.title)}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-300 flex items-center gap-2 ${
                              isLocked 
                                ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed' 
                                : isCompleted 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-white'
                            }`}
                            disabled={isLocked || isCompleted}
                          >
                            {isLocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                            {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Start'}
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <PythonFlashcards
          isOpen={showFlashcards}
          onClose={() => setShowFlashcards(false)}
          onStartQuiz={handleStartQuiz}
          moduleTitle={currentQuizSubtopic}
        />

        <PythonQuizPopup
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
          moduleTitle={currentQuizSubtopic}
        />

        <PythonVideo
          isOpen={showVideo}
          onClose={handleVideoClose}
          onComplete={handleVideoComplete}
          moduleTitle={currentQuizSubtopic}
        />
      </div>
    </div>
  );
};

export default PythonFundamentals;
