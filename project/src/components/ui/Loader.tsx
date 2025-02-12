import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1a2e]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-bold text-center"
      >
        <motion.span
          animate={{
            color: ['#9333ea', '#3b82f6', '#8b5cf6', '#9333ea'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          UNAI
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Loader;
