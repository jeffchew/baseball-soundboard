import { useState, useEffect } from 'react';
import Header from './components/Header';
import LineupTab from './components/LineupTab';
import SoundboardTab from './components/SoundboardTab';
import MusicTab from './components/MusicTab';
import StopButton from './components/StopButton';
import { usePlayCount } from './hooks/usePlayCount';

function App() {
  const [activeTab, setActiveTab] = useState('lineup');
  const [isPlaying, setIsPlaying] = useState(false);
  const { incrementPlayCount, getPlayCount } = usePlayCount();

  // Track tab navigation
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'tab_view', {
        tab_name: activeTab,
      });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-yankee-navy">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      
      <main>
        {activeTab === 'lineup' && <LineupTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
        {activeTab === 'soundboard' && <SoundboardTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} incrementPlayCount={incrementPlayCount} getPlayCount={getPlayCount} />}
        {activeTab === 'music' && <MusicTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} incrementPlayCount={incrementPlayCount} getPlayCount={getPlayCount} />}
      </main>

      <StopButton setIsPlaying={setIsPlaying} />
    </div>
  );
}

export default App;


