import { useState, useRef } from 'react';
import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';

export default function LineupTab({ isPlaying, setIsPlaying }) {
  const [isSequencing, setIsSequencing] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const [enabledPlayers, setEnabledPlayers] = useState(
    audioConfig.walkups.reduce((acc, player) => {
      acc[player.id] = true; // All players enabled by default
      return acc;
    }, {})
  );
  const stopRequested = useRef(false);
  const sequenceId = useRef(0); // Track sequence instances

  const togglePlayer = (playerId) => {
    setEnabledPlayers(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };

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
    
    // Increment sequence ID to invalidate any previous sequences
    sequenceId.current += 1;
    const currentSequenceId = sequenceId.current;
    
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

    // Check if stop was requested or sequence was superseded
    if (stopRequested.current || sequenceId.current !== currentSequenceId) {
      // If superseded by a new sequence, just exit silently without stopping audio
      if (sequenceId.current !== currentSequenceId) {
        return;
      }
      // If manually stopped, clean up audio
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
      // Fallback timeout in case onended doesn't fire
      setTimeout(() => resolve(), 30000);
    });

    // Check if stop was requested or sequence was superseded
    if (stopRequested.current || sequenceId.current !== currentSequenceId) {
      // If superseded by a new sequence, just exit silently without stopping audio
      if (sequenceId.current !== currentSequenceId) {
        return;
      }
      // If manually stopped, clean up audio
      audioEngine.stopBackground();
      setIsSequencing(false);
      setCurrentPlayerIndex(-1);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Play each player intro from pregame folder (only enabled players)
    const allPlayerIntros = audioConfig.pregame.filter(p =>
      p.id.startsWith('intro-') &&
      !p.id.includes('monsters') &&
      !p.id.includes('end')
    );

    // Create array of enabled player intros with their original indices
    const playerIntrosWithIndices = allPlayerIntros
      .map((intro, index) => ({
        intro,
        originalIndex: index,
        walkupPlayer: audioConfig.walkups[index]
      }))
      .filter(item => item.walkupPlayer && enabledPlayers[item.walkupPlayer.id]);

    for (let i = 0; i < playerIntrosWithIndices.length; i++) {
      // Check if stop was requested or sequence was superseded
      if (stopRequested.current || sequenceId.current !== currentSequenceId) {
        // If superseded by a new sequence, just exit silently without stopping audio
        if (sequenceId.current !== currentSequenceId) {
          return;
        }
        // If manually stopped, clean up audio
        audioEngine.stopBackground();
        setIsSequencing(false);
        setCurrentPlayerIndex(-1);
        return;
      }

      const { intro, originalIndex } = playerIntrosWithIndices[i];
      setCurrentPlayerIndex(originalIndex);
      
      // Play player intro
      const audio = audioEngine.play(intro.file, {
        startTime: intro.startTime,
        fadeIn: false,
        isSequence: true,
      });

      // Wait for audio to finish
      await new Promise((resolve) => {
        audio.onended = resolve;
        // Fallback timeout in case onended doesn't fire
        setTimeout(() => resolve(), 30000);
      });

      // Check if stop was requested or sequence was superseded
      if (stopRequested.current || sequenceId.current !== currentSequenceId) {
        // If superseded by a new sequence, just exit silently without stopping audio
        if (sequenceId.current !== currentSequenceId) {
          return;
        }
        // If manually stopped, clean up audio
        audioEngine.stopBackground();
        setIsSequencing(false);
        setCurrentPlayerIndex(-1);
        return;
      }
      
      // Wait 2 seconds before next player
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Check if stop was requested or sequence was superseded
    if (stopRequested.current || sequenceId.current !== currentSequenceId) {
      // If superseded by a new sequence, just exit silently without stopping audio
      if (sequenceId.current !== currentSequenceId) {
        return;
      }
      // If manually stopped, clean up audio
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
      // Fallback timeout in case onended doesn't fire
      setTimeout(() => resolve(), 30000);
    });

    // Sequence complete - keep background music playing
    // User can stop it manually with the STOP button
    audioEngine.clearSequenceStopCallback();
    setIsSequencing(false);
    setCurrentPlayerIndex(-1);
  };

  const handleStopSequence = () => {
    stopRequested.current = true;
    
    // Force stop any currently playing audio immediately
    if (audioEngine.activeAudio) {
      audioEngine.activeAudio.pause();
      audioEngine.activeAudio.currentTime = 0;
      audioEngine.activeAudio = null;
    }
    
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
          <div key={player.id} className="relative">
            {/* Enable/Disable Checkbox - positioned above button */}
            <div
              className="absolute top-2 right-2 z-10 pointer-events-auto"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <label
                className="flex items-center cursor-pointer p-2 -m-2 bg-yankee-navy rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={enabledPlayers[player.id]}
                  onChange={(e) => {
                    e.stopPropagation();
                    togglePlayer(player.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isSequencing}
                  className="w-7 h-7 sm:w-6 sm:h-6 rounded border-2 border-white bg-yankee-navy checked:bg-blue-600 checked:border-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                />
              </label>
            </div>
            
            {/* Player Button */}
            <button
              onClick={() => handlePlayerClick(player)}
              disabled={isSequencing || isPlaying || !enabledPlayers[player.id]}
              className={`w-full p-6 rounded-lg shadow-lg transition-all duration-200 ${
                currentPlayerIndex === index
                  ? 'bg-green-600 text-white scale-105'
                  : !enabledPlayers[player.id]
                  ? 'bg-yankee-gray text-yankee-light opacity-40'
                  : isSequencing || isPlaying
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                  : 'bg-yankee-slate hover:bg-yankee-gray text-white'
              }`}
              style={{ pointerEvents: isSequencing || isPlaying || !enabledPlayers[player.id] ? 'none' : 'auto' }}
            >
              <div className="text-4xl font-bold mb-2">#{player.number}</div>
              <div className="text-lg font-semibold">{player.label}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
