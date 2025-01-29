import React from 'react';
import { motion } from 'framer-motion';

interface GlowingButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group
        px-6 py-2.5
        rounded-lg
        bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500
        hover:from-blue-600 hover:via-cyan-500 hover:to-purple-600
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 opacity-0 group-hover:opacity-75 blur-xl transition-all duration-300 animate-pulse" />
      
      {/* Sparkle Container */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
    </motion.button>
  );
};

export default GlowingButton;
