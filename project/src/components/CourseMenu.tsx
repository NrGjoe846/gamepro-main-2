import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Coffee, Settings } from 'lucide-react';
import GlowingButton from './ui/GlowingButton';

interface CourseMenuProps {
  onClose: () => void;
}

const courses = [
  {
    id: 'python',
    title: 'Python Fundamentals',
    description: 'Master Python programming from basics to advanced concepts',
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    path: '/courses/python-fundamentals',
    color: 'from-blue-500/20 to-green-500/20',
    progress: 45,
    phases: ['Basics', 'Data Structures', 'OOP', 'Advanced Topics']
  },
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Learn Java and object-oriented programming principles',
    icon: <Coffee className="w-6 h-6 text-orange-400" />,
    path: '/courses/java-programming',
    color: 'from-orange-500/20 to-red-500/20',
    progress: 30,
    phases: ['Core Java', 'OOP', 'Collections', 'Advanced Java']
  },
  {
    id: 'c',
    title: 'C Programming',
    description: 'Deep dive into system programming with C',
    icon: <Settings className="w-6 h-6 text-purple-400" />,
    path: '/courses/c-programming',
    color: 'from-purple-500/20 to-blue-500/20',
    progress: 15,
    phases: ['Basics', 'Memory Management', 'Pointers', 'Advanced C']
  }
];

const CourseMenu: React.FC<CourseMenuProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${course.color} rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100`} />
              <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  {course.icon}
                  <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>

                {/* Phase Cards */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {course.phases.map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-2 bg-white/5 rounded-lg text-sm text-center"
                    >
                      {phase}
                    </motion.div>
                  ))}
                </div>

                <Link to={course.path} onClick={onClose}>
                  <GlowingButton className="w-full">
                    Continue Learning
                  </GlowingButton>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseMenu;
