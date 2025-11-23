import React from 'react';
import { Topic } from '../types';

interface TrendingBarProps {
  topics: Topic[];
  onTopicClick: (topic: string) => void;
}

const TrendingBar: React.FC<TrendingBarProps> = ({ topics, onTopicClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-md border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xs font-futuristic text-blue-400 mb-2 uppercase tracking-widest opacity-80">
          Trending Signals
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick(topic.label)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:border-blue-500/50 transition-all duration-300 whitespace-nowrap group"
            >
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                {topic.label}
              </span>
              {topic.trend === 'up' && <span className="text-green-400 text-xs">▲</span>}
              {topic.trend === 'down' && <span className="text-red-400 text-xs">▼</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingBar;
