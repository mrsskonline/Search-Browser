import React, { useState, useEffect, useRef } from 'react';
import { performSmartSearch, generateFuturisticImage } from './services/geminiService';
import Background from './components/Background';
import TrendingBar from './components/TrendingBar';
import Loader from './components/Loader';
import { SpaceTheme, Topic, SearchResult } from './types';

// Placeholder utility for "Related Images" since we can't search real images easily without key
const getPlaceholderImages = (query: string, count: number = 4) => {
  // Use a hash of the query to keep images stable for the same query
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    // Add randomness based on query hash + index
    src: `https://picsum.photos/400/300?random=${hash + i}`,
    alt: `${query} related image ${i + 1}`
  }));
};

const INITIAL_TRENDING: Topic[] = [
  { id: '1', label: 'Mars Colonization', trend: 'up' },
  { id: '2', label: 'Quantum Computing', trend: 'up' },
  { id: '3', label: 'Neural Interfaces', trend: 'neutral' },
  { id: '4', label: 'Exoplanet Discovery', trend: 'up' },
  { id: '5', label: 'Fusion Energy', trend: 'up' },
  { id: '6', label: 'Artificial General Intelligence', trend: 'neutral' },
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState<SpaceTheme>(SpaceTheme.DeepSpace);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [trending, setTrending] = useState<Topic[]>(INITIAL_TRENDING);
  const [relatedImages, setRelatedImages] = useState<{ id: number; src: string; alt: string }[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setIsSearching(true);
    setResult(null);
    setGeneratedImage(null);
    
    // Switch theme randomly for effect
    const themes = Object.values(SpaceTheme);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);

    // 1. Get Answer & Links
    const searchData = await performSmartSearch(searchQuery);
    setResult(searchData);

    // 2. Set "Related" placeholder images
    setRelatedImages(getPlaceholderImages(searchQuery));

    // 3. Update trending topics based on results
    if (searchData.relatedTopics.length > 0) {
      setTrending(searchData.relatedTopics.map((t, i) => ({
        id: `rel-${i}`,
        label: t,
        trend: 'neutral'
      })));
    }

    setIsSearching(false);
  };

  const handleGenerateImage = async () => {
    if (!query) return;
    setIsGenerating(true);
    const base64Image = await generateFuturisticImage(query);
    setGeneratedImage(base64Image);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <div className="min-h-screen text-white relative font-sans selection:bg-cyan-500/30">
      <Background theme={theme} />

      {/* Header / Logo */}
      <header className="fixed top-0 left-0 p-6 z-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 animate-pulse" />
        <h1 className="font-futuristic text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          DO SEARCHABLE
        </h1>
      </header>

      {/* Main Content Area */}
      <main className={`transition-all duration-700 ease-in-out flex flex-col items-center justify-center min-h-screen p-4 pb-32 ${result ? 'pt-24 justify-start' : ''}`}>
        
        {/* Search Container */}
        <div className={`w-full max-w-2xl transition-all duration-500 ${result ? 'scale-90' : 'scale-100'}`}>
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${query ? 'opacity-75' : ''}`}></div>
            <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-1 shadow-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search the universe..."
                className="w-full bg-transparent text-white p-4 text-lg outline-none font-medium placeholder-gray-500"
              />
              <button 
                onClick={() => handleSearch(query)}
                className="p-3 px-6 rounded bg-white/5 hover:bg-white/10 border-l border-white/10 text-cyan-400 font-futuristic text-sm tracking-wider transition-colors"
              >
                SEARCH
              </button>
            </div>
          </div>
          
          {/* Helper Text */}
          {!result && !isSearching && (
            <div className="text-center mt-6 space-y-2 animate-fade-in-up">
              <p className="text-gray-400 text-sm">Powered by Gemini AI • Multiverse Search Engine</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isSearching && <Loader />}

        {/* Search Results */}
        {result && !isSearching && (
          <div ref={resultsRef} className="w-full max-w-4xl mt-8 animate-fade-in-up space-y-8">
            
            {/* Direct Answer Card */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
              <div className="flex items-center gap-2 mb-4">
                 <span className="text-cyan-400 text-2xl">✦</span>
                 <h2 className="text-xl font-futuristic text-white">Direct Answer</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-lg">
                 {result.answer}
              </div>
            </div>

            {/* Visuals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Related Images (Simulated Search) */}
              <div className="space-y-4">
                <h3 className="font-futuristic text-lg text-blue-300 border-b border-blue-500/30 pb-2 inline-block">
                  Visual Data
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {relatedImages.map((img) => (
                    <div key={img.id} className="aspect-video relative rounded-lg overflow-hidden border border-white/10 group">
                      <img 
                        src={img.src} 
                        alt={img.alt} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Generative Image Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-purple-500/30 pb-2">
                  <h3 className="font-futuristic text-lg text-purple-300">
                    Generative Synthesis
                  </h3>
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="text-xs bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 px-3 py-1 rounded text-purple-300 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? 'SYNTHESIZING...' : 'GENERATE NEW'}
                  </button>
                </div>
                
                <div className="aspect-video bg-black/50 rounded-lg border border-purple-500/20 flex items-center justify-center overflow-hidden relative">
                  {isGenerating ? (
                    <div className="text-purple-400 animate-pulse flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      Processing Nebula Data...
                    </div>
                  ) : generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <div className="text-center p-4">
                       <p className="text-gray-500 text-sm mb-2">Generate a unique AI visualization for "{query}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sources / Grounding */}
            {result.sources.length > 0 && (
              <div className="pt-4">
                <h3 className="font-futuristic text-sm text-gray-500 mb-3 uppercase tracking-wider">Source Uplinks</h3>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-cyan-200/80 hover:text-cyan-200 transition-colors truncate max-w-[200px]"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <TrendingBar 
        topics={trending} 
        onTopicClick={(t) => handleSearch(t)} 
      />
    </div>
  );
};

export default App;
