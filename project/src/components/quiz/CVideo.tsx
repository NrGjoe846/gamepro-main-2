// src/components/quiz/CVideo.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';

interface CVideoProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  videoUrl?: string; // Optional prop for video source
}

const CVideo: React.FC<CVideoProps> = ({ isOpen, onClose, moduleTitle, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div className="relative w-full max-w-4xl bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{moduleTitle}</h2>
          <p className="text-sm text-gray-400">Watch the video to learn more!</p>
        </div>

        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <video
            controls
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} // Placeholder video
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Finish Watching
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CVideo;
