import { useState, useRef } from 'react';
import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';

export default function LineupTab({ isPlaying, setIsPlaying }) {
  const [isSequencing, setIsSequencing] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const stopRequested = useRef(false);

  const handlePlayerClick = (player) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const audio = audioEngine.play(player.file, {
      startTime: player.startTime,
      fadeIn: false,
    });
    
    audio.onended = () => setIsPlaying(false);
  };

  const startLineupSequence = async () => {
    if (isSequencing) return;
    
    // Stop any currently playing audio first
    audioEngine.stop();
    audioEngine.stopBackground();
    
    setIsSequencing(true);
    setCurrentPlayerIndex(-1);
    stopRequested.current = false;

    // Register stop callback with audio engine
    audioEngine.setSequenceStopCallback(() => {
      stopRequested.current = true;
    });

    // Find Baba O'Riley for background music
    const babaORiley = audioConfig.songs.find(song => song.id === 'song4');
    
    // Start background music (Baba O'Riley) at 30 seconds at moderate volume
    audioEngine.playBackground(babaORiley.file, 0.35, 30);

    // Wait 15 seconds for background music to play before starting voiceovers
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Check if stop was requested
    if (stopRequested.current) {
      audioEngine.stopBackground();
      setIsSequencing(false);
      setCurrentPlayerIndex(-1);
      return;
    }

    // Play Lake Monsters intro first
    const lakeMonsters = audioConfig.pregame.find(p => p.id === 'intro-monsters');
    
    const lakeAudio = audioEngine.play(lakeMonsters.file, {
      startTime: lakeMonsters.startTime,
      fadeIn: false,
      isSequence: true,
    });

    await new Promise((resolve) => {
      lakeAudio.onended = resolve;
      setTimeout(resolve, 30000);
    });

    // Check if stop was requested
    if (stopRequested.current) {
      audioEngine.stopBackground();
      setIsSequencing(false);
      setCurrentPlayerIndex(-1);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Play each player intro from pregame folder
    const playerIntros = audioConfig.pregame.filter(p => 
      p.id.startsWith('intro-') && 
      !p.id.includes('monsters') && 
      !p.id.includes('end')
    );

    for (let i = 0; i < playerIntros.length; i++) {
      // Check if stop was requested
      if (stopRequested.current) {
        audioEngine.stopBackground();
        setIsSequencing(false);
        setCurrentPlayerIndex(-1);
        return;
      }

      setCurrentPlayerIndex(i);
      const intro = playerIntros[i];
      
      // Play player intro
      const audio = audioEngine.play(intro.file, {
        startTime: intro.startTime,
        fadeIn: false,
        isSequence: true,
      });

      // Wait for audio to finish
      await new Promise((resolve) => {
        audio.onended = resolve;
        setTimeout(resolve, 30000);
      });

      // Check if stop was requested
      if (stopRequested.current) {
        audioEngine.stopBackground();
        setIsSequencing(false);
        setCurrentPlayerIndex(-1);
        return;
      }
      
      // Wait 2 seconds before next player
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Check if stop was requested
    if (stopRequested.current) {
      audioEngine.stopBackground();
      setIsSequencing(false);
      setCurrentPlayerIndex(-1);
      return;
    }

    // Play intro end
    const introEnd = audioConfig.pregame.find(p => p.id === 'intro-end');
    
    const endAudio = audioEngine.play(introEnd.file, {
      startTime: introEnd.startTime,
      fadeIn: false,
      isSequence: true,
    });

    await new Promise((resolve) => {
      endAudio.onended = resolve;
      setTimeout(resolve, 30000);
    });

    // Stop background music
    audioEngine.stopBackground();
    audioEngine.clearSequenceStopCallback();
    setIsSequencing(false);
    setCurrentPlayerIndex(-1);
  };

  const handleStopSequence = () => {
    stopRequested.current = true;
    audioEngine.stop();
    audioEngine.stopBackground();
    audioEngine.clearSequenceStopCallback();
    setIsSequencing(false);
    setCurrentPlayerIndex(-1);
  };

  return (
    <div className="p-4 pb-24">
      {/* Start Lineup Button */}
      <div className="mb-6">
        {!isSequencing ? (
          <button
            onClick={startLineupSequence}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
          >
            🎤 Start Pregame Intro
          </button>
        ) : (
          <button
            onClick={handleStopSequence}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
          >
            ⏹ Stop Pregame Intro
          </button>
        )}
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-2 gap-4">
        {audioConfig.walkups.map((player, index) => (
          <button
            key={player.id}
            onClick={() => handlePlayerClick(player)}
            disabled={isSequencing || isPlaying}
            className={`p-6 rounded-lg shadow-lg transition-all duration-200 ${
              currentPlayerIndex === index
                ? 'bg-green-600 text-white scale-105'
                : isSequencing || isPlaying
                ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                : 'bg-yankee-slate hover:bg-yankee-gray text-white'
            }`}
          >
            <div className="text-4xl font-bold mb-2">#{player.number}</div>
            <div className="text-lg font-semibold">{player.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
