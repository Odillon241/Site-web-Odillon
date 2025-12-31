import React from 'react';

export const AboutHeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-odillon-teal/5 via-transparent to-odillon-lime/5" />

      {/* Large circle patterns */}
      <div className="absolute -top-24 -right-24 w-96 h-96 border border-odillon-teal/10 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-odillon-lime/10 rounded-full" />

      {/* Smaller decorative circles */}
      <div className="absolute top-1/4 right-1/3 w-32 h-32 border border-odillon-teal/20 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-odillon-lime/20 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      {/* Simple grid overlay */}
      <div className="absolute inset-0 opacity-[0.15]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-odillon-teal"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      {/* Subtle dots pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-odillon-lime" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>
      </div>

      {/* Floating squares */}
      <div className="absolute top-1/3 left-1/4 w-20 h-20 border-2 border-odillon-teal/15 transform rotate-12 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-odillon-lime/15 transform -rotate-12 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />

      {/* Subtle light beams effect */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-odillon-teal/10 to-transparent" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-odillon-lime/10 to-transparent" />

      {/* Radial fade overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
    </div>
  );
};
