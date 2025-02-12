import React from 'react';
import { Bell, Star, Trophy, Book, X, Code2, Coffee, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'achievement' | 'course' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  courseLink?: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'course',
    title: 'Continue Python Learning',
    message: 'Resume your Python Fundamentals course from Phase 2',
    time: '2 hours ago',
    read: false,
    courseLink: '/courses/python-fundamentals'
  },
  {
    id: '2',
    type: 'course',
    title: 'Java Course Available',
    message: 'Start your Java Programming journey today',
    time: '5 hours ago',
    read: false,
    courseLink: '/courses/java-programming'
  },
  {
    id: '3',
    type: 'course',
    title: 'C Programming Course',
    message: 'Explore system programming with C',
    time: '1 day ago',
    read: true,
    courseLink: '/courses/c-programming'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    message: 'You\'ve completed your first Python course.',
    time: '2 days ago',
    read: true
  }
];

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'course':
        return <Book className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  const getCourseIcon = (courseLink?: string) => {
    if (!courseLink) return null;
    if (courseLink.includes('python')) return <Code2 className="w-4 h-4 text-blue-400" />;
    if (courseLink.includes('java')) return <Coffee className="w-4 h-4 text-orange-400" />;
    if (courseLink.includes('c-programming')) return <Settings className="w-4 h-4 text-purple-400" />;
    return null;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.courseLink) {
      onClose();
      navigate(notification.courseLink);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-16 right-4 w-96 max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-black/90 rounded-xl border border-white/10 shadow-2xl"
    >
      <div className="sticky top-0 bg-black/90 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNotificationClick(notification)}
            className={`p-4 rounded-lg border ${
              notification.read ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/20'
            } hover:bg-white/20 transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{notification.title}</h4>
                  {getCourseIcon(notification.courseLink)}
                </div>
                <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{notification.time}</span>
                  {notification.courseLink && (
                    <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to open course →
                    </span>
                  )}
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-black/90 p-4 border-t border-white/10">
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300">
          Mark All as Read
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
