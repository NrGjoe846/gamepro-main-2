import React, { useState } from 'react';
import { GraduationCap, User, Settings, Bell, Menu, X, Gift, Compass, BookOpen, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsPanel from './notifications/NotificationsPanel';
import SettingsPanel from './settings/SettingsPanel';
import CourseMenu from './CourseMenu';

const Navigation = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCourseMenu, setShowCourseMenu] = useState(false);

  const menuItems = [
    { icon: <Compass className="w-5 h-5" />, label: 'Explore', path: '/explore' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Achievements', path: '/achievements' },
    { icon: <Gift className="w-5 h-5" />, label: 'Rewards', path: '/rewards' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/10 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">UNAI Verse</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {/* Course Menu Button */}
              <button
                onClick={() => setShowCourseMenu(!showCourseMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                <span>Courses</span>
                {showCourseMenu ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              className="nav-icon-button relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>
            
            <button 
              className="nav-icon-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-6 h-6" />
            </button>
            
            <Link 
              to="/profile"
              className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-full transition-all duration-300"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden nav-icon-button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <button
                onClick={() => setShowCourseMenu(!showCourseMenu)}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Courses</span>
                </div>
                {showCourseMenu ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-2 px-4 py-3 hover:bg-white/10 transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Course Menu */}
      <AnimatePresence>
        {showCourseMenu && <CourseMenu onClose={() => setShowCourseMenu(false)} />}
      </AnimatePresence>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </nav>
  );
};

export default Navigation;
