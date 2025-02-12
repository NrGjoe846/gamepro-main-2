import React from 'react';
import { Brain, Book, MessageSquare, Lightbulb, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AptitudeTest = () => {
  const aptitudeTopics = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Quantitative Aptitude",
      description: "Master mathematical and numerical problem-solving skills essential for competitive exams",
      topics: ["Number System", "Algebra", "Geometry", "Data Interpretation", "Arithmetic"]
    },
    {
      icon: <Book className="h-8 w-8" />,
      title: "Logical Reasoning",
      description: "Develop critical thinking and analytical reasoning abilities",
      topics: ["Syllogisms", "Blood Relations", "Coding-Decoding", "Series", "Analogies"]
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Verbal Ability",
      description: "Enhance your language skills, comprehension, and communication",
      topics: ["Reading Comprehension", "Vocabulary", "Grammar", "Verbal Reasoning", "Error Spotting"]
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Non-Verbal Reasoning",
      description: "Improve pattern recognition and spatial reasoning capabilities",
      topics: ["Pattern Series", "Figure Matrix", "Paper Folding", "Mirror Images", "Embedded Figures"]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "General Knowledge",
      description: "Stay updated with current affairs and essential general awareness",
      topics: ["Current Affairs", "Science", "History", "Geography", "Technology"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-12">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Aptitude Test</h1>
            <p className="text-gray-400">Master your aptitude skills across different domains</p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 gap-8">
          {aptitudeTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    {topic.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{topic.title}</h2>
                    <p className="text-gray-400">{topic.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {topic.topics.map((subtopic, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-center transition-all duration-300"
                    >
                      {subtopic}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
