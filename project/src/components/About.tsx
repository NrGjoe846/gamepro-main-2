import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';

const About = () => {
  const socialLinks = [
    { name: 'Website', url: 'https://www.unaitech.com', color: 'from-blue-500 to-cyan-500', description: 'Visit our official website for more information' },
    { name: 'YouTube', url: 'https://youtube.com/@UnaiTech', color: 'from-red-500 to-pink-500', description: 'Watch our educational content and tutorials' },
    { name: 'Instagram', url: 'https://instagram.com/unai.tech', color: 'from-purple-500 to-pink-500', description: 'Follow us for updates and behind-the-scenes' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/unai-tech', color: 'from-blue-600 to-blue-400', description: 'Connect with us professionally' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About UNAI Tech</h1>
          <p className="text-xl text-gray-400">
            Join our community and explore the world of technology and programming
          </p>
        </div>

        <div className="grid gap-6">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100`} />
              <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{link.name}</h2>
                    <p className="text-gray-400">{link.description}</p>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/10 rounded-lg"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
