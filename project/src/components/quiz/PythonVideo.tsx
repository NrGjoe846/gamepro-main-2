import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, PauseCircle, Maximize2, CheckCircle } from 'lucide-react';

interface PythonVideoProps {
  isOpen: boolean;
  onClose: () => void; // Called when closing without completion
  onComplete?: () => void; // Called when marking as completed
  moduleTitle: string;
}

// Mapping subtopic titles to OneDrive video URLs
const videoUrlMap: Record<string, string> = {
  "Installing Python (Anaconda, PyCharm, or basic Python)": "https://r1tglg.sn.files.1drv.com/y4matulJUOKOv7Hmbh5nWurmHVPytrNhI6zlRhZ0L5aHEORPqZgqkLjwxzlp2ow0s-Sz7zICfZNvyDEEt8vm3t6dIIuaxQ4hEopvS79mZ35cuRTJ4_MHAgykJNmk1VdusfxkVtm7kYkyIhBJ3Z3bwwFPp2JM-X5aVWJNIKXx8ptaqVjZLvSL1Hlg1x98uiXbvm2ZAaBblYa2EAEltW7ZEF1zfjoCGv5bOhKsCXnNQr_lYI?AVOverride=1", // Your provided URL (needs conversion)
  "Setting up the IDE": "https://onedrive.live.com/download?resid=YOUR_RESID2&authkey=YOUR_AUTHKEY2", // Replace with actual OneDrive URL
  "default": "https://www.w3schools.com/html/mov_bbb.mp4" // Fallback placeholder
};

const PythonVideo: React.FC<PythonVideoProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  if (!isOpen) return null;

  const videoUrl = videoUrlMap[moduleTitle] || videoUrlMap["default"];

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
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
    setVideoEnded(false); // Reset state
    onClose(); // Close without marking completion
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoEnded(true); // Show "Completed" button
  };

  const handleMarkComplete = () => {
    if (onComplete) {
      onComplete(); // Mark as completed and close
    }
    setVideoEnded(false); // Reset state
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
        </div>

        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={videoUrl}
            controls={false} // Custom controls below
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
            disabled={isPlaying || videoEnded}
          >
            <PlayCircle className="w-5 h-5" />
            Play
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
            disabled={!isPlaying}
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
