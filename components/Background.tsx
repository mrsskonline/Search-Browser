import React, { useEffect, useState } from 'react';
import { SpaceTheme } from '../types';

interface BackgroundProps {
  theme: SpaceTheme;
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  const getThemeStyles = (t: SpaceTheme) => {
    switch (t) {
      case SpaceTheme.Mars:
        return 'bg-gradient-to-br from-red-900 via-black to-orange-900';
      case SpaceTheme.EarthOrbit:
        return 'bg-gradient-to-b from-blue-900 via-black to-black';
      case SpaceTheme.BlackHole:
        return 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-gray-900 to-black';
      case SpaceTheme.Nebula:
        return 'bg-gradient-to-tr from-purple-900 via-black to-indigo-900';
      case SpaceTheme.DeepSpace:
      default:
        return 'bg-black';
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out ${getThemeStyles(theme)}`}>
      {/* Stars Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Optional Overlay Textures based on Theme */}
      {theme === SpaceTheme.BlackHole && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black rounded-full shadow-[0_0_100px_40px_rgba(255,255,255,0.1)] ring-4 ring-white/10 blur-sm animate-pulse" />
      )}
      
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
    </div>
  );
};

export default Background;
