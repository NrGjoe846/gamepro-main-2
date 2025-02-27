import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, PauseCircle, Maximize2, CheckCircle } from 'lucide-react';

interface JavaVideoProps {
  isOpen: boolean;
  onClose: () => void; // Called when closing without completion
  onComplete?: () => void; // Called when marking as completed
  moduleTitle: string;
}

// Mapping subtopic titles to video URLs (replace with your actual Java video URLs)
const videoUrlMap: Record<string, string> = {
  "Installing Java (JDK, JRE)": "https://example.com/java-install.mp4", // Replace with direct MP4 link
  "Setting up the IDE (IntelliJ IDEA, Eclipse, or VS Code)": "https://example.com/java-ide-setup.mp4", // Replace with direct MP4 link
  "default": "https://www.w3schools.com/html/mov_bbb.mp4" // Fallback placeholder
};

const JavaVideo: React.FC<JavaVideoProps> = ({ isOpen, onClose, onComplete, moduleTitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = videoUrlMap[moduleTitle] || videoUrlMap["default"];
  const isOneDrive = videoUrl.includes("1drv.ms") || videoUrl.includes("onedrive.live.com");

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
          setError("Failed to play video. Ensure the URL is a direct video link (e.g., .mp4).");
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
          {isOneDrive && !error && (
            <p className="text-sm text-yellow-400">
              Note: OneDrive sharing links don’t work directly. Replace with a direct MP4 URL for playback.
            </p>
          )}
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
              setError("Failed to load video. Use a direct MP4 URL instead of a sharing link.");
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

export default JavaVideo;
