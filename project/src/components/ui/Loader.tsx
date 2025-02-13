import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1a2e]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex gap-2">
        {/* Hidden SVG for gradient definition */}
        <svg height={0} width={0} viewBox="0 0 64 64" className="absolute">
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="loader-gradient">
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset={1} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Letter U */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth={8} 
            stroke="url(#loader-gradient)" 
            d="M 10,4 V 40 C 10,52 20,60 32,60 C 44,60 54,52 54,40 V 4" 
            className="animate-dashArray"
            pathLength={360} 
          />
        </svg>
        
        {/* Letter N */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth={8} 
            stroke="url(#loader-gradient)" 
            d="M 10,60 V 4 L 54,60 V 4" 
            className="animate-dashArray"
            pathLength={360} 
          />
        </svg>
        
        {/* Letter A */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth={8} 
            stroke="url(#loader-gradient)" 
            d="M 10,60 L 32,4 L 54,60 M 22,36 H 42" 
            className="animate-dashArray"
            pathLength={360} 
          />
        </svg>
        
        {/* Letter I */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height={64} width={64} className="inline-block">
          <path 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth={8} 
            stroke="url(#loader-gradient)" 
            d="M 32,4 V 60" 
            className="animate-dashArray"
            pathLength={360} 
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
