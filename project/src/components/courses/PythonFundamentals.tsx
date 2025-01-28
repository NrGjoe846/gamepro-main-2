import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackButton from '../BackButton';

interface Node {
  id: string;
  title: string;
  x: number;
  y: number;
  connections: string[];
  type: 'pink' | 'blue' | 'locked';
  completed?: boolean;
}

const nodes: Node[] = [
  { id: 'basic-syntax', title: 'BASIC SYNTAX', x: 20, y: 30, connections: ['variables'], type: 'pink', completed: true },
  { id: 'variables', title: 'VARIABLES', x: 35, y: 20, connections: ['control-flow'], type: 'pink', completed: true },
  { id: 'control-flow', title: 'CONTROL FLOW', x: 50, y: 25, connections: ['functions', 'data-types'], type: 'pink' },
  { id: 'functions', title: 'FUNCTIONS', x: 65, y: 20, connections: ['advanced'], type: 'blue' },
  { id: 'data-types', title: 'DATA TYPES', x: 65, y: 35, connections: ['advanced'], type: 'pink' },
  { id: 'advanced', title: 'ADVANCED', x: 80, y: 30, connections: [], type: 'locked' },
];

const PythonFundamentals = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://your-character-image-url.jpg'; // Replace with actual character image URL
    img.onload = () => setCharacterLoaded(true);
  }, []);

  const renderConnections = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="pink-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF1493" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="blue-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00CED1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {nodes.map(node =>
        node.connections.map(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return null;

          const startX = `${node.x}%`;
          const startY = `${node.y}%`;
          const endX = `${target.x}%`;
          const endY = `${target.y}%`;

          return (
            <motion.path
              key={`${node.id}-${targetId}`}
              d={`M ${startX} ${startY} Q ${(node.x + target.x) / 2}% ${node.y}%, ${endX} ${endY}`}
              stroke={node.type === 'pink' ? 'url(#pink-glow)' : 'url(#blue-glow)'}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          );
        })
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#0A1628] text-white relative overflow-hidden">
      {/* Background with misty forest effect */}
      <div className="absolute inset-0 bg-[url('/forest-bg.jpg')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628]/80" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider">PHASE</h1>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">SCORES</span>
            <span className="text-pink-400">SKILLS</span>
            <span className="text-gray-400">LOADOUT</span>
          </div>
        </div>

        {/* Character and Node System */}
        <div className="relative h-[80vh]">
          {/* Character */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-64 h-96 relative">
              {/* Replace with actual character image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse" />
            </div>
          </motion.div>

          {/* Node System */}
          <div className="absolute inset-0">
            {renderConnections()}
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={`relative ${
                    node.type === 'pink' ? 'text-pink-400' :
                    node.type === 'blue' ? 'text-cyan-400' :
                    'text-gray-400'
                  }`}
                >
                  {/* Node circle */}
                  <div className={`w-12 h-12 rounded-full border-2 ${
                    node.type === 'pink' ? 'border-pink-400 bg-pink-400/20' :
                    node.type === 'blue' ? 'border-cyan-400 bg-cyan-400/20' :
                    'border-gray-400 bg-gray-400/20'
                  } flex items-center justify-center`}>
                    {node.completed && (
                      <div className="w-3 h-3 bg-current rounded-full" />
                    )}
                  </div>
                  
                  {/* Node title */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-mono">
                    {node.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom UI elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-pink-400/20 border border-pink-400" />
            <span className="text-pink-400">LEVEL 1</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-pink-400" />
            </div>
            <span className="text-gray-400">50%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonFundamentals;
