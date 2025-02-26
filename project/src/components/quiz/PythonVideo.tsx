import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, PauseCircle, Maximize2 } from 'lucide-react';

// Load YouTube Iframe API script dynamically
const loadYouTubeAPI = () => {
  if (!window['YT']) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
  }
};

interface PythonVideoProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
}

// Mapping subtopic titles to YouTube embed URLs
const videoUrlMap: Record<string, string> = {
  "Installing Python (Anaconda, PyCharm, or basic Python)": "https://www.youtube.com/embed/YKSpANU8jPE", // Your provided URL
  "Setting up the IDE": "https://www.youtube.com/embed/NES0LRUFMBE" , // Placeholder (replace with actual URL)
  "default": "https://www.youtube.com/embed/dQw4w9WgXcQ" // Fallback placeholder
};

const PythonVideo: React.FC<PythonVideoProps> = ({ isOpen, onClose, moduleTitle }) => {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load YouTube API when component mounts
  useEffect(() => {
    loadYouTubeAPI();
    window['onYouTubeIframeAPIReady'] = () => {
      if (iframeRef.current) {
        playerRef.current = new window['YT'].Player(iframeRef.current, {
          events: {
            onReady: () => console.log("YouTube Player Ready"),
            onError: (e: any) => console.error("YouTube Player Error:", e.data),
          },
        });
      }
    };

    // Cleanup to avoid multiple API calls
    return () => {
      delete window['onYouTubeIframeAPIReady'];
    };
  }, []);

  if (!isOpen) return null;

  const videoUrl = videoUrlMap[moduleTitle] || videoUrlMap["default"];

  const handlePlay = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
    }
  };

  const handlePause = () => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch((err) => {
          console.error("Error enabling fullscreen:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

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
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{moduleTitle}</h2>
          <p className="text-sm text-gray-400">Watch the video to learn more!</p>
        </div>

        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`${videoUrl}?enablejsapi=1&controls=1&rel=0`}
            title={moduleTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Play
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <PauseCircle className="w-5 h-5" />
            Pause
          </button>
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <Maximize2 className="w-5 h-5" />
            Fullscreen
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PythonVideo;
