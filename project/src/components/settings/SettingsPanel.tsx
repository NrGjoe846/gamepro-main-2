import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Volume2, Bell, Shield, Palette, X, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [theme, setTheme] = useState('dark');
  const [volume, setVolume] = useState(80);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState('friends');
  const [panelColor, setPanelColor] = useState('bg-black/90');
  const [isChanging, setIsChanging] = useState(false);
  const [instructionText, setInstructionText] = useState('Click anywhere to customize the dashboard');
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium'
  });

  const themes = [
    { id: 'dark', name: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { id: 'light', name: 'Light', icon: <Sun className="w-5 h-5" /> },
    { id: 'system', name: 'System', icon: <Palette className="w-5 h-5" /> }
  ];

  const colors = [
    'bg-black/90',
    'bg-blue-900/90',
    'bg-purple-900/90',
    'bg-indigo-900/90'
  ];

  useEffect(() => {
    if (isChanging) {
      const timer = setTimeout(() => setIsChanging(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isChanging]);

  const handlePanelClick = () => {
    setIsChanging(true);

    // Cycle through panel colors
    setPanelColor(prev => {
      const currentIndex = colors.indexOf(prev);
      return colors[(currentIndex + 1) % colors.length];
    });

    // Update instruction text
    setInstructionText(prev => 
      prev === 'Click anywhere to customize the dashboard'
        ? 'Dashboard customization mode activated!'
        : 'Click anywhere to customize the dashboard'
    );

    // Update dashboard instructions through localStorage
    localStorage.setItem('dashboardInstructions', instructionText);
    
    // Dispatch custom event to notify dashboard of changes
    window.dispatchEvent(new CustomEvent('settingsUpdate', {
      detail: {
        instructions: instructionText,
        theme,
        accessibility
      }
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`absolute top-16 right-4 w-96 max-h-[80vh] overflow-y-auto backdrop-blur-xl ${panelColor} rounded-xl border border-white/10 shadow-2xl transition-colors duration-300`}
      onClick={handlePanelClick}
    >
      <div className="sticky top-0 bg-inherit p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Settings</h3>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={instructionText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <Sparkles className={`w-4 h-4 ${isChanging ? 'text-yellow-400' : 'text-gray-400'}`} />
            {instructionText}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h4 className="text-sm font-medium text-gray-400">Theme</h4>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(t.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 ${
                  theme === t.id ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10'
                } border hover:bg-white/10 transition-all duration-300`}
              >
                {t.icon}
                <span className="text-sm">{t.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Sound */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-400">Sound</h4>
            <Volume2 className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>

        {/* Notifications */}
        <motion.div 
          className="flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-medium">Notifications</h4>
          </div>
          <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </motion.div>

        {/* Privacy */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-medium">Privacy</h4>
          </div>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </motion.div>

        {/* Accessibility */}
        <motion.div 
          className="space-y-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-medium">Accessibility</h4>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm">High Contrast</span>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => setAccessibility({ ...accessibility, highContrast: e.target.checked })}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-400 text-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Reduced Motion</span>
              <input
                type="checkbox"
                checked={accessibility.reducedMotion}
                onChange={(e) => setAccessibility({ ...accessibility, reducedMotion: e.target.checked })}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-400 text-blue-500 focus:ring-blue-500"
              />
            </label>
            <div>
              <span className="text-sm block mb-1">Font Size</span>
              <select
                value={accessibility.fontSize}
                onChange={(e) => setAccessibility({ ...accessibility, fontSize: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="sticky bottom-0 bg-inherit p-4 border-t border-white/10"
        whileHover={{ scale: 1.02 }}
      >
        <motion.button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
        >
          Save Changes
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
