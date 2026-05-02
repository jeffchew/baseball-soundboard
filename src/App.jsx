import { useState } from 'react';
import Header from './components/Header';
import LineupTab from './components/LineupTab';
import SoundboardTab from './components/SoundboardTab';
import MusicTab from './components/MusicTab';
import StopButton from './components/StopButton';

function App() {
  const [activeTab, setActiveTab] = useState('lineup');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-yankee-navy">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {activeTab === 'lineup' && <LineupTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
        {activeTab === 'soundboard' && <SoundboardTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
        {activeTab === 'music' && <MusicTab isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
      </main>

      <StopButton setIsPlaying={setIsPlaying} />
    </div>
  );
}

export default App;


