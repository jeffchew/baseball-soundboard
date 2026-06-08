import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LineupTab from './components/LineupTab';
import SoundboardTab from './components/SoundboardTab';
import MusicTab from './components/MusicTab';
import StopButton from './components/StopButton';
import { usePlayCount } from './hooks/usePlayCount';
import { useLastBatter } from './hooks/useLastBatter';

/**
 * Main application component for the Baseball Soundboard.
 * Manages tab navigation, audio playback state, and play count tracking.
 * Integrates Google Analytics for tracking user interactions.
 */
function App() {
  const [showSoundsTab, setShowSoundsTab] = useState(() => {
    try {
      const stored = localStorage.getItem('baseball-soundboard-show-sounds-tab');
      return stored === null ? true : stored === 'true';
    } catch (error) {
      console.error('Error loading sounds tab preference from localStorage:', error);
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState('lineup');
  const [isPlaying, setIsPlaying] = useState(false);
  const { incrementPlayCount, getPlayCount, resetPlayCounts } = usePlayCount();
  const [lastBatterId, setLastBatterId, clearLastBatter] = useLastBatter();
  const categoryRefs = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem('baseball-soundboard-show-sounds-tab', String(showSoundsTab));
    } catch (error) {
      console.error('Error saving sounds tab preference to localStorage:', error);
    }
  }, [showSoundsTab]);

  useEffect(() => {
    if (!showSoundsTab && activeTab === 'soundboard') {
      setActiveTab('lineup');
    }
  }, [showSoundsTab, activeTab]);

  // Track tab navigation
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'tab_view', {
        tab_name: activeTab,
      });
    }
  }, [activeTab]);

  /**
   * Scrolls smoothly to a specific category section
   * @param {string} categoryKey - The category to scroll to
   */
  const scrollToCategory = (categoryKey) => {
    const element = categoryRefs.current[categoryKey];
    if (element) {
      const yOffset = -140; // Offset for sticky header + category nav
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Category configurations for each tab
  const soundCategories = {
    'at-bat': { title: 'At Bat', color: 'bg-blue-600 hover:bg-blue-700' },
    'hype': { title: 'Hype', color: 'bg-purple-600 hover:bg-purple-700' },
    'steal': { title: 'Steal', color: 'bg-yellow-600 hover:bg-yellow-700' },
    'walk': { title: 'Walk', color: 'bg-green-600 hover:bg-green-700' },
    'hit-short': { title: 'Victory (Short)', color: 'bg-orange-600 hover:bg-orange-700' },
    'hit-long': { title: 'Victory (Long)', color: 'bg-red-600 hover:bg-red-700' },
  };

  const musicCategories = {
    'upbeat': { title: 'Upbeat', color: 'bg-yellow-600 hover:bg-yellow-700' },
    'rock': { title: 'Rock', color: 'bg-red-600 hover:bg-red-700' },
    'hip-hop': { title: 'Hip Hop', color: 'bg-blue-600 hover:bg-blue-700' },
    'villain': { title: 'Villain', color: 'bg-gray-700 hover:bg-gray-800' },
    'game-end': { title: 'Game End', color: 'bg-green-600 hover:bg-green-700' },
  };

  return (
    <div className="min-h-screen bg-yankee-navy">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isPlaying={isPlaying} setIsPlaying={setIsPlaying} resetPlayCounts={resetPlayCounts} clearLastBatter={clearLastBatter} showSoundsTab={showSoundsTab} setShowSoundsTab={setShowSoundsTab} />
      
      {/* Category Navigation - Only show for soundboard and music tabs */}
      {((showSoundsTab && activeTab === 'soundboard') || activeTab === 'music') && (
        <div className="sticky top-[72px] z-50 bg-yankee-dark/95 backdrop-blur-sm border-b border-yankee-gray/30 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {Object.entries(activeTab === 'soundboard' ? soundCategories : musicCategories).map(([categoryKey, categoryInfo]) => (
              <button
                key={categoryKey}
                onClick={() => scrollToCategory(categoryKey)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${categoryInfo.color} text-white hover:scale-105 active:scale-95`}
              >
                {categoryInfo.title}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <main>
        {activeTab === 'lineup' && <LineupTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} lastBatterId={lastBatterId} setLastBatterId={setLastBatterId} />}
        {showSoundsTab && activeTab === 'soundboard' && <SoundboardTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} incrementPlayCount={incrementPlayCount} getPlayCount={getPlayCount} categoryRefs={categoryRefs} />}
        {activeTab === 'music' && <MusicTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} incrementPlayCount={incrementPlayCount} getPlayCount={getPlayCount} categoryRefs={categoryRefs} />}
      </main>

      <StopButton setIsPlaying={setIsPlaying} />
    </div>
  );
}

export default App;


