import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-cyan-400 border-b-transparent border-l-cyan-400 animate-spin-reverse opacity-70"></div>
      </div>
      <p className="text-cyan-400 font-futuristic text-sm animate-pulse tracking-widest">PROCESSING...</p>
    </div>
  );
};

export default Loader;
