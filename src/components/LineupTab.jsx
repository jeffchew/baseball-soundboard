import { useState, useRef, useMemo, useEffect } from 'react';
import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';
import { usePlayerState } from '../hooks/usePlayerState';
import { usePlayerOrder } from '../hooks/usePlayerOrder';

export default function LineupTab({ isPlaying, setIsPlaying }) {
  const { isCached } = useAudioCache();
  const [isSequencing, setIsSequencing] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const [enabledPlayers, setEnabledPlayers] = usePlayerState(audioConfig.walkups);
  const [playerOrder, setPlayerOrder] = usePlayerOrder(audioConfig.walkups);
  const [isReordering, setIsReordering] = useState(false);
  const [tempOrder, setTempOrder] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragElementRef = useRef(null);
  const stopRequested = useRef(false);
  const sequenceId = useRef(0); // Track sequence instances
  const [selectedPregameSongId, setSelectedPregameSongId] = useState(() => {
    try {
      const stored = localStorage.getItem('baseball-soundboard-pregame-song');
      return stored || 'song4';
    } catch (error) {
      console.error('Error loading pregame song from localStorage:', error);
      return 'song4';
    }
  });
  const [isPregameMusicExpanded, setIsPregameMusicExpanded] = useState(false);

  // Save selected pregame song to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('baseball-soundboard-pregame-song', selectedPregameSongId);
    } catch (error) {
      console.error('Error saving pregame song to localStorage:', error);
    }
  }, [selectedPregameSongId]);
  const pregameBackgroundOptions = useMemo(
    () => audioConfig.pregameBackgroundOptions ?? [],
    []
  );
  const selectedPregameSong =
    pregameBackgroundOptions.find((song) => song.id === selectedPregameSongId) ??
    pregameBackgroundOptions[0];

  const togglePlayer = (playerId) => {
    setEnabledPlayers(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };

  const startReordering = () => {
    setIsReordering(true);
    setTempOrder([...playerOrder]);
  };

  const saveOrder = () => {
    setPlayerOrder([...tempOrder]);
    setIsReordering(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const cancelReordering = () => {
    setIsReordering(false);
    setTempOrder([]);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDragStart = (e, index) => {
    e.preventDefault();
    const touch = e.touches?.[0] || e;
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      elementX: rect.left,
      elementY: rect.top
    };
    dragElementRef.current = e.currentTarget;
    setDraggedIndex(index);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDragMove = (e) => {
    if (draggedIndex === null) return;
    e.preventDefault();
    
    const touch = e.touches?.[0] || e;
    const deltaX = touch.clientX - dragStartPos.current.x;
    const deltaY = touch.clientY - dragStartPos.current.y;
    
    // Update visual position of dragged element
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Find which element we're over based on Y position
    const elements = document.querySelectorAll('[data-player-index]');
    let newDragOverIndex = null;
    
    elements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      
      if (touch.clientY >= rect.top && touch.clientY <= rect.bottom && idx !== draggedIndex) {
        newDragOverIndex = idx;
      }
    });
    
    if (newDragOverIndex !== null && newDragOverIndex !== dragOverIndex) {
      setDragOverIndex(newDragOverIndex);
    }
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    
    // Perform the swap on drop
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newOrder = [...tempOrder];
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dragOverIndex, 0, removed);
      setTempOrder(newOrder);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePlayerClick = (player) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    const playStartTime = Date.now();
    
    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'walkup',
        audio_name: player.label,
        audio_id: player.id,
        player_number: player.number,
      });
    }
    
    const audio = audioEngine.play(player.file, {
      startTime: player.startTime,
      fadeIn: false,
      audioType: 'walkup',
    });
    
    audio.onended = () => {
      setIsPlaying(false);
      
      // Track duration when audio ends naturally
      const durationPlayed = Math.round((Date.now() - playStartTime) / 1000);
      if (window.gtag) {
        window.gtag('event', 'audio_complete', {
          audio_type: 'walkup',
          audio_name: player.label,
          audio_id: player.id,
          player_number: player.number,
          duration_seconds: durationPlayed,
        });
      }
    };
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

    if (selectedPregameSong) {
      // Track pregame background music in GA4
      if (window.gtag) {
        window.gtag('event', 'play_audio', {
          audio_type: 'pregame_background',
          audio_name: selectedPregameSong.label,
          audio_id: selectedPregameSong.id,
        });
      }
      
      audioEngine.playBackground(
        selectedPregameSong.file,
        audioConfig.pregameBackgroundVolume,
        selectedPregameSong.startTime ?? 0
      );
    }

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
    
    // Track Lake Monsters intro in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'pregame_intro',
        audio_name: lakeMonsters.label,
        audio_id: lakeMonsters.id,
      });
    }
    
    const lakeAudio = audioEngine.play(lakeMonsters.file, {
      startTime: lakeMonsters.startTime,
      fadeIn: false,
      isSequence: true,
      audioType: 'pregame',
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

    // Play each player intro from pregame folder (only enabled players, in current order)
    const allPlayerIntros = audioConfig.pregame.filter(p =>
      p.id.startsWith('intro-') &&
      !p.id.includes('monsters') &&
      !p.id.includes('end')
    );

    // Create array of enabled player intros based on current player order
    const playerIntrosWithIndices = playerOrder
      .map((player, orderIndex) => {
        // Find the original index in audioConfig.walkups to get the correct intro
        const originalIndex = audioConfig.walkups.findIndex(p => p.id === player.id);
        return {
          intro: allPlayerIntros[originalIndex],
          orderIndex, // Track position in current order
          walkupPlayer: player
        };
      })
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

      const { intro, orderIndex } = playerIntrosWithIndices[i];
      setCurrentPlayerIndex(orderIndex);
      
      // Track player intro in GA4
      if (window.gtag) {
        window.gtag('event', 'play_audio', {
          audio_type: 'pregame_intro',
          audio_name: intro.label,
          audio_id: intro.id,
        });
      }
      
      // Play player intro
      const audio = audioEngine.play(intro.file, {
        startTime: intro.startTime,
        fadeIn: false,
        isSequence: true,
        audioType: 'pregame',
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
    
    // Track intro end in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'pregame_intro',
        audio_name: introEnd.label,
        audio_id: introEnd.id,
      });
    }
    
    const endAudio = audioEngine.play(introEnd.file, {
      startTime: introEnd.startTime,
      fadeIn: false,
      isSequence: true,
      audioType: 'anthem',
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
      <div className="mb-6">
        {!isReordering ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <button
              type="button"
              onClick={() => setIsPregameMusicExpanded((prev) => !prev)}
              disabled={isSequencing}
              className={`w-full rounded-lg shadow-lg font-bold py-4 px-6 transition-colors duration-200 text-lg ${
                isSequencing
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-70'
                  : 'bg-yankee-slate hover:bg-yankee-gray text-white'
              }`}
            >
              🎵 Change Intro Music
            </button>

            <button
              type="button"
              onClick={startReordering}
              disabled={isSequencing}
              className={`w-full rounded-lg shadow-lg font-bold py-4 px-6 transition-colors duration-200 text-lg ${
                isSequencing
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-70'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              🔀 Change Player Order
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={saveOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
            >
              ✅ Save Changes
            </button>

            <button
              type="button"
              onClick={cancelReordering}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
            >
              ❌ Cancel
            </button>
          </div>
        )}

        {isPregameMusicExpanded && (
          <div className="mt-3 bg-yankee-slate rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 pb-3 border-b border-yankee-gray">
              <h2 className="text-white font-bold text-lg">Pregame Background Music</h2>
              <p className="text-yankee-light text-sm">
                Selected: {selectedPregameSong?.label ?? 'None'}
              </p>
            </div>
            <div className="p-4 pt-3">
              <p className="text-yankee-light text-sm mb-3">
                Choose the song that plays underneath the pregame intro sequence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pregameBackgroundOptions.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      setSelectedPregameSongId(song.id);
                      setIsPregameMusicExpanded(false);
                    }}
                    disabled={isSequencing}
                    className={`rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      selectedPregameSongId === song.id
                        ? 'border-blue-400 bg-blue-600 text-white'
                        : isSequencing
                        ? 'border-yankee-gray bg-yankee-gray text-yankee-light cursor-not-allowed opacity-60'
                        : 'border-yankee-gray bg-yankee-navy text-white hover:border-blue-400 hover:bg-yankee-gray'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{song.label}</span>
                      {selectedPregameSongId === song.id && (
                        <span className="text-sm font-bold">Selected</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Grid */}
      {isReordering && (
        <div className="mb-4 p-4 bg-purple-900 rounded-lg">
          <p className="text-white text-center font-semibold">
            👆 Drag players to reorder them, then click "Save Changes"
          </p>
        </div>
      )}

      <div className={isReordering ? "flex flex-col gap-2" : "grid grid-cols-2 gap-4"}>
        {(isReordering ? tempOrder : playerOrder)
          .sort((a, b) => {
            // In reorder mode, sort enabled players first, disabled last
            if (!isReordering) return 0;
            const aEnabled = enabledPlayers[a.id];
            const bEnabled = enabledPlayers[b.id];
            if (aEnabled === bEnabled) return 0;
            return aEnabled ? -1 : 1;
          })
          .map((player, index) => {
            const isDisabled = !enabledPlayers[player.id];
            const isEnabledPlayer = enabledPlayers[player.id];
            
            return (
          <div key={player.id} className="relative" data-player-index={index}>
            {/* Drop indicator line - only show for enabled players */}
            {isReordering && isEnabledPlayer && dragOverIndex === index && draggedIndex !== index && (
              <div className="absolute -top-1 left-0 right-0 h-1 bg-purple-300 shadow-lg shadow-purple-300/50 rounded-full z-40" />
            )}
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
              onClick={() => !isReordering && handlePlayerClick(player)}
              disabled={!isReordering && (isSequencing || isPlaying || isDisabled)}
              className={`relative w-full rounded-lg shadow-lg ${
                isReordering
                  ? `p-4 flex items-center justify-between ${
                      isDisabled
                        ? 'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
                        : draggedIndex === index
                        ? 'bg-purple-700 text-white z-50 shadow-2xl'
                        : 'bg-purple-800 text-white transition-all duration-200'
                    }`
                  : `p-6 ${
                      currentPlayerIndex === index
                        ? 'bg-green-600 text-white scale-105 transition-all duration-200'
                        : !enabledPlayers[player.id]
                        ? 'bg-yankee-gray text-yankee-light opacity-40 transition-all duration-200'
                        : isSequencing || isPlaying
                        ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50 transition-all duration-200'
                        : 'bg-yankee-slate hover:bg-yankee-gray text-white transition-all duration-200'
                    }`
              }`}
              style={{
                pointerEvents: (!isSequencing && !isPlaying && isEnabledPlayer) ? 'auto' : 'none',
                transform: isReordering && isEnabledPlayer && draggedIndex === index
                  ? `translateY(${dragOffset.y}px)`
                  : undefined,
                transition: draggedIndex === index ? 'none' : 'all 0.2s ease-out'
              }}
            >
              {isCached(player.file) && !isReordering && (
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-400 rounded-full" title="Cached for offline use" />
              )}
              {isReordering ? (
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`text-xl p-2 -m-2 ${isDisabled ? 'text-gray-500' : 'text-purple-300 cursor-grab active:cursor-grabbing'}`}
                    onTouchStart={(e) => isEnabledPlayer && handleDragStart(e, index)}
                    onTouchMove={(e) => isEnabledPlayer && handleDragMove(e)}
                    onTouchEnd={(e) => isEnabledPlayer && handleDragEnd(e)}
                    onMouseDown={(e) => isEnabledPlayer && handleDragStart(e, index)}
                    onMouseMove={(e) => isEnabledPlayer && e.buttons === 1 && handleDragMove(e)}
                    onMouseUp={(e) => isEnabledPlayer && handleDragEnd(e)}
                    style={{ touchAction: isEnabledPlayer ? 'none' : 'auto' }}
                  >
                    {isDisabled ? '✕' : '☰'}
                  </div>
                  <div className="text-xl font-bold">#{player.number}</div>
                  <div className="text-lg font-semibold">{player.label}</div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold mb-2">#{player.number}</div>
                  <div className="text-lg font-semibold">{player.label}</div>
                </>
              )}
            </button>
          </div>
            );
          })}
      </div>
    </div>
  );
}


