import React from 'react';
import { ExternalLink, Globe, Youtube, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';

const About = () => {
  const socialLinks = [
    { 
      name: 'Website', 
      url: 'https://www.unaitech.com', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Visit our official website for more information',
      icon: <Globe className="w-12 h-12 text-blue-400" />
    },
    { 
      name: 'YouTube', 
      url: 'https://youtube.com/@UnaiTech', 
      color: 'from-red-500 to-pink-500',
      description: 'Watch our educational content and tutorials',
      icon: <Youtube className="w-12 h-12 text-red-400" />
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/unai.tech', 
      color: 'from-purple-500 to-pink-500',
      description: 'Follow us for updates and behind-the-scenes',
      icon: <Instagram className="w-12 h-12 text-purple-400" />
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com/company/unai-tech', 
      color: 'from-blue-600 to-blue-400',
      description: 'Connect with us professionally',
      icon: <Linkedin className="w-12 h-12 text-blue-500" />
    },
    { 
      name: 'WhatsApp Community', 
      url: 'https://whatsapp.com/channel/0029VazCTXQ0G0XiHoGHy50i', 
      color: 'from-green-500 to-green-300',
      description: 'Join our WhatsApp community for real-time updates',
      icon: <MessageCircle className="w-12 h-12 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#1E293B]">
      {/* Cosmic Background with Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <BackButton />

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
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="group relative h-[300px]"
            >
              {/* Glowing Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
              
              {/* Card Content */}
              <div className="relative h-full backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl">
                {/* Floating Icon Animation */}
                <motion.div 
                  className="mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {link.icon}
                </motion.div>
                
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
    </div>
  );
};

export default About;
