import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';

const About = () => {
  const socialLinks = [
    { 
      name: 'Website', 
      url: 'https://www.unaitech.com', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Visit our official website for more information',
      icon: '🌊'
    },
    { 
      name: 'YouTube', 
      url: 'https://youtube.com/@UnaiTech', 
      color: 'from-red-500 to-pink-500',
      description: 'Watch our educational content and tutorials',
      icon: '🎥'
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/unai.tech', 
      color: 'from-purple-500 to-pink-500',
      description: 'Follow us for updates and behind-the-scenes',
      icon: '📷'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com/company/unai-tech', 
      color: 'from-blue-600 to-blue-400',
      description: 'Connect with us professionally',
      icon: '💼'
    },
    { 
      name: 'WhatsApp Community', 
      url: 'https://whatsapp.com/channel/0029VazCTXQ0G0XiHoGHy50i', 
      color: 'from-green-500 to-green-300',
      description: 'Join our WhatsApp community for real-time updates',
      icon: '✅'
    }
  ];

  // Floating orb animation
  useEffect(() => {
    const orbs = document.querySelectorAll('.floating-orb');
    orbs.forEach((orb, index) => {
      const delay = index * 0.5;
      const element = orb as HTMLElement;
      element.style.animation = `floatOrb 3s ease-in-out ${delay}s infinite`;
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#1E293B]">
      {/* Cosmic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Reflective Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <BackButton />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Explore UNAI Tech
          </h1>
          <p className="text-xl text-gray-400">
            Connect with us across different platforms
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative h-[300px]"
            >
              {/* Glowing Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
              
              {/* Card Content */}
              <div className="relative h-full backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                {/* Floating Orb */}
                <div className="floating-orb absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-white/20 to-white/5 rounded-full blur-sm" />
                
                {/* Icon */}
                <div className="text-4xl mb-4">{link.icon}</div>
                
                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-2">{link.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{link.description}</p>
                </div>
                
                {/* Visit Button */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-sm text-blue-400"
                >
                  Visit <ExternalLink className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
