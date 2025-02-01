import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, Code, Play, CheckCircle, Lock, ChevronDown, ChevronUp, 
  AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../BackButton';
import GlowingButton from '../ui/GlowingButton';
import QuizPopup from '../quiz/QuizPopup';

// ... (keep all existing interfaces and coursePhases data)

const PythonFundamentals = () => {
  // ... (keep all existing state variables)
  
  // Add new state for quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizTopic, setCurrentQuizTopic] = useState<string>('');

  // Update handleTopicStart to include quiz functionality
  const handleTopicStart = (phaseId: string, topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedTopic?.topicId === topicId) {
      setExpandedTopic(null);
      setSelectedTopic(null);
    } else {
      setExpandedTopic(topicId);
      setSelectedTopic({ phaseId, topicId });

      // Show quiz for specific topics
      if (phaseId === 'phase-1' && topicId === 'first-program') {
        setCurrentQuizTopic('Writing Your First Python Program: print("Hello, World!")');
        setShowQuiz(true);
      }

      setTimeout(() => {
        subtopicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    // Update progress or unlock next topic
    if (selectedTopic) {
      const phase = coursePhases.find(p => p.id === selectedTopic.phaseId);
      const topic = phase?.topics.find(t => t.id === selectedTopic.topicId);
      if (topic && topic.subtopics) {
        const subtopic = topic.subtopics.find(s => s.id === 'first-program');
        if (subtopic) {
          subtopic.completed = true;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      {/* Keep existing JSX structure */}
      <div className="max-w-full mx-auto">
        {/* ... (keep existing header and content) */}

        {/* Add Quiz Popup */}
        <QuizPopup
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
          moduleTitle={currentQuizTopic}
        />

        {/* ... (keep rest of the existing JSX) */}
      </div>
    </div>
  );
};

export default PythonFundamentals;
