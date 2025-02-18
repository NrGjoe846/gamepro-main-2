import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import styled from 'styled-components';

const About = () => {
  const socialLinks = [
    { 
      name: 'Instagram',
      url: 'https://instagram.com/unai.tech',
      color: 'text-pink-500',
      bgColor: 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook',
      url: 'https://facebook.com/unai.tech',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height={24} className="w-8 h-8 fill-current">
          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
        </svg>
      )
    },
    { 
      name: 'WhatsApp',
      url: 'https://wa.me/your-number',
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      icon: (
        <svg width={30} height={30} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current">
          <path d="M19.001 4.908A9.817 9.817 0 0 0 11.992 2C6.534 2 2.085 6.448 2.08 11.908c0 1.748.458 3.45 1.321 4.956L2 22l5.255-1.377a9.916 9.916 0 0 0 4.737 1.206h.005c5.46 0 9.908-4.448 9.913-9.913A9.872 9.872 0 0 0 19 4.908h.001ZM11.992 20.15A8.216 8.216 0 0 1 7.797 19l-.3-.18-3.117.818.833-3.041-.196-.314a8.2 8.2 0 0 1-1.258-4.381c0-4.533 3.696-8.23 8.239-8.23a8.2 8.2 0 0 1 5.825 2.413 8.196 8.196 0 0 1 2.41 5.825c-.006 4.55-3.702 8.24-8.24 8.24Zm4.52-6.167c-.247-.124-1.463-.723-1.692-.808-.228-.08-.394-.123-.556.124-.166.246-.641.808-.784.969-.143.166-.29.185-.537.062-.247-.125-1.045-.385-1.99-1.23-.738-.657-1.232-1.47-1.38-1.716-.142-.247-.013-.38.11-.504.11-.11.247-.29.37-.432.126-.143.167-.248.248-.413.082-.167.043-.31-.018-.433-.063-.124-.557-1.345-.765-1.838-.2-.486-.404-.419-.557-.425-.142-.009-.309-.009-.475-.009a.911.911 0 0 0-.661.31c-.228.247-.864.845-.864 2.067 0 1.22.888 2.395 1.013 2.56.122.167 1.742 2.666 4.229 3.74.587.257 1.05.408 1.41.523.595.19 1.13.162 1.558.1.475-.072 1.464-.6 1.673-1.178.205-.58.205-1.075.142-1.18-.061-.104-.227-.165-.475-.29Z" />
        </svg>
      )
    },
    { 
      name: 'Gmail',
      url: 'mailto:your-email@gmail.com',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height={24} className="w-8 h-8 fill-current">
          <path d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Connect with UNAI Tech
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Join our community across different platforms
          </motion.p>
        </div>

        <StyledWrapper>
          <div className="main mx-auto">
            <div className="up">
              <motion.a
                href={socialLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card1"
              >
                {socialLinks[0].icon}
              </motion.a>
              <motion.a
                href={socialLinks[1].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card2"
              >
                {socialLinks[1].icon}
              </motion.a>
            </div>
            <div className="down">
              <motion.a
                href={socialLinks[2].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card3"
              >
                {socialLinks[2].icon}
              </motion.a>
              <motion.a
                href={socialLinks[3].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card4"
              >
                {socialLinks[3].icon}
              </motion.a>
            </div>
          </div>
        </StyledWrapper>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .main {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    max-width: 400px;
  }

  .up {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  .down {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  .card1, .card2, .card3, .card4 {
    width: 90px;
    height: 90px;
    outline: none;
    border: none;
    background: white;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    transition: .2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card1 {
    border-radius: 90px 5px 5px 5px;
  }

  .card2 {
    border-radius: 5px 90px 5px 5px;
  }

  .card3 {
    border-radius: 5px 5px 5px 90px;
  }

  .card4 {
    border-radius: 5px 5px 90px 5px;
  }

  .instagram {
    fill: #cc39a4;
  }

  .facebook {
    fill: #03A9F4;
  }

  .whatsapp {
    fill: #00ff00;
  }

  .gmail {
    fill: #f14336;
  }

  .card1:hover {
    cursor: pointer;
    scale: 1.1;
    background-color: #cc39a4;
  }

  .card1:hover .instagram {
    fill: white;
  }

  .card2:hover {
    cursor: pointer;
    scale: 1.1;
    background-color: #1877f2;
  }

  .card2:hover .facebook {
    fill: white;
  }

  .card3:hover {
    cursor: pointer;
    scale: 1.1;
    background-color: #00ff00;
  }

  .card3:hover .whatsapp {
    fill: white;
  }

  .card4:hover {
    cursor: pointer;
    scale: 1.1;
    background-color: #FF0004;
  }

  .card4:hover .gmail {
    fill: white;
  }
`;

export default About;
