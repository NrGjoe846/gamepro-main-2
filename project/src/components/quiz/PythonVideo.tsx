import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, PauseCircle, Maximize2, CheckCircle } from 'lucide-react';

// Import local video files from src/assets/videos/
import installingPythonVideo from '../../assets/videos/installing-python.mp4';
import settingUpIdeVideo from '../../assets/videos/setting-up-ide.mp4';

interface PythonVideoProps {
  isOpen: boolean;
  onClose: () => void; // Called when closing without completion
  onComplete?: () => void; // Called when marking as completed
  moduleTitle: string;
}

// Mapping subtopic titles to local video files
const videoUrlMap: Record<string, string> = {
  "Installing Python (Anaconda, PyCharm, or basic Python)": installingPythonVideo,
  "Setting up the IDE": settingUpIdeVideo,
  "default": "https://www.w3schools.com/html/mov_bbb.mp4" // Fallback placeholder (external URL)
};

const PythonVideo: React.FC<PythonVideoProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = videoUrlMap[moduleTitle] || videoUrlMap["default"];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload video when URL changes
    }
  }, [videoUrl]);

  if (!isOpen) return null;

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Error playing video:", err);
          setError("Failed to play video. Check if the video file is correctly placed in src/assets/videos/.");
        });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error("Error enabling fullscreen:", err);
          setError("Fullscreen not supported.");
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // Pause video on close
    }
    setIsPlaying(false);
    setVideoEnded(false);
    setError(null);
    onClose();
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoEnded(true); // Show "Completed" button
  };

  const handleMarkComplete = () => {
    if (onComplete) {
      onComplete(); // Mark as completed and close
    }
    setVideoEnded(false);
    setError(null);
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
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{moduleTitle}</h2>
          <p className="text-sm text-gray-400">Watch the video to learn more!</p>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={videoUrl}
            controls={false} // Custom controls below
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.error("Video error:", e);
              setError("Failed to load video. Ensure the video file exists in src/assets/videos/.");
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={isPlaying || videoEnded || error !== null}
          >
            <PlayCircle className="w-5 h-5" />
            Play
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={!isPlaying || error !== null}
          >
            <PauseCircle className="w-5 h-5" />
            Pause
          </button>
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={error !== null}
          >
            <Maximize2 className="w-5 h-5" />
            Fullscreen
          </button>
          {videoEnded && (
            <button
              onClick={handleMarkComplete}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Completed
            </button>
          )}
          <button
            onClick={handleClose}
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
