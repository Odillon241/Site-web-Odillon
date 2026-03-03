import React from 'react';

export const ContactHeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        {/* Teal gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#39837a]/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

        {/* Lime gradient orb */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C4D82E]/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-[#39837a]/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-[#C4D82E]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#39837a]/20 rounded-lg transform rotate-12 animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-[#C4D82E]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-[#39837a]/20 transform rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonals" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="1" className="text-[#39837a]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonals)" />
        </svg>
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />

      {/* Animated floating elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#39837a] rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#C4D82E] rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      <div className="absolute top-2/3 right-1/2 w-2 h-2 bg-[#39837a] rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
};
