import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';

export default function SoundboardTab({ isPlaying, setIsPlaying, incrementPlayCount, getPlayCount }) {
  const { isCached } = useAudioCache();

  /**
   * Handles clicking on a sound button to play the selected sound effect.
   * Prevents playback if audio is already playing and tracks the event in Google Analytics.
   * Supports initial delay for Bluetooth speaker wake-up.
   * @param {Object} sound - The sound object containing file path, label, and metadata
   */
  const handleSoundClick = (sound) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    incrementPlayCount(sound.id);
    
    const playStartTime = Date.now();
    
    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'sound',
        audio_name: sound.label,
        audio_id: sound.id,
      });
    }
    
    const audio = audioEngine.play(sound.file, {
      startTime: sound.startTime,
      fadeIn: sound.fadeIn,
      audioType: 'sound',
      initialDelay: sound.initialDelay || 0,
    });
    
    audio.onended = () => {
      setIsPlaying(false);
      
      // Track duration when audio ends naturally
      const durationPlayed = Math.round((Date.now() - playStartTime) / 1000);
      if (window.gtag) {
        window.gtag('event', 'audio_complete', {
          audio_type: 'sound',
          audio_name: sound.label,
          audio_id: sound.id,
          duration_seconds: durationPlayed,
        });
      }
    };
  };

  /**
   * Plays a random sound from the specified category.
   * Prioritizes unplayed sounds, but falls back to all sounds if all have been played.
   * For "at-bat" category, excludes situational sounds (two strikes and strikeouts).
   * @param {string} category - The category to select a random sound from
   */
  const handleRandomSound = (category) => {
    if (isPlaying) return;
    
    // Get sounds for this category
    let eligibleSounds = audioConfig.sounds.filter(sound => sound.category === category);
    
    // For "at-bat" category, exclude situational sounds (two strikes and strikeouts)
    if (category === 'at-bat') {
      const excludedIds = ['imperial', 'strikeout-mario', 'strikeout-megaman', 'strikeout-pacman', 'strikeout-pc-richards'];
      eligibleSounds = eligibleSounds.filter(sound => !excludedIds.includes(sound.id));
    }
    
    // Filter sounds that haven't been played yet
    const unplayedSounds = eligibleSounds.filter(sound => getPlayCount(sound.id) === 0);
    
    // If all sounds have been played, use all eligible sounds
    const availableSounds = unplayedSounds.length > 0 ? unplayedSounds : eligibleSounds;
    
    // Pick a random sound
    const randomSound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
    
    // Play the random sound
    handleSoundClick(randomSound);
  };

  /**
   * Gets the count of unplayed sounds in a specific category.
   * Used to display remaining sounds in the random button.
   * For "at-bat" category, excludes situational sounds from the count.
   * @param {string} category - The category to count unplayed sounds for
   * @returns {number} The number of unplayed sounds in the category
   */
  const getUnplayedCount = (category) => {
    let sounds = audioConfig.sounds.filter(sound => sound.category === category);
    
    // For "at-bat" category, exclude situational sounds
    if (category === 'at-bat') {
      const excludedIds = ['imperial', 'strikeout-mario', 'strikeout-megaman', 'strikeout-pacman', 'strikeout-pc-richards'];
      sounds = sounds.filter(sound => !excludedIds.includes(sound.id));
    }
    
    return sounds.filter(sound => getPlayCount(sound.id) === 0).length;
  };

  // Group sounds by category
  const categories = {
    'at-bat': {
      title: 'At Bat',
      description: 'Quick sounds for during at-bats',
      color: 'bg-blue-600 hover:bg-blue-700',
      disabledColor: 'bg-blue-800',
    },
    'hype': {
      title: 'Hype',
      description: 'Crowd hype and energy sounds',
      color: 'bg-purple-600 hover:bg-purple-700',
      disabledColor: 'bg-purple-800',
    },
    'steal': {
      title: 'Steal',
      description: 'For stolen bases',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      disabledColor: 'bg-yellow-800',
    },
    'walk': {
      title: 'Walk',
      description: 'For when batter walks',
      color: 'bg-green-600 hover:bg-green-700',
      disabledColor: 'bg-green-800',
    },
    'hit-short': {
      title: 'Victory (Short)',
      description: 'Quick celebration clips',
      color: 'bg-orange-600 hover:bg-orange-700',
      disabledColor: 'bg-orange-800',
    },
    'hit-long': {
      title: 'Victory (Long)',
      description: 'Longer celebration clips',
      color: 'bg-red-600 hover:bg-red-700',
      disabledColor: 'bg-red-800',
    },
  };

  const soundsByCategory = audioConfig.sounds.reduce((acc, sound) => {
    const category = sound.category || 'at-bat';
    if (!acc[category]) acc[category] = [];
    acc[category].push(sound);
    return acc;
  }, {});

  return (
    <div className="p-4 pb-24">
      {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
        const sounds = soundsByCategory[categoryKey] || [];
        if (sounds.length === 0) return null;

        return (
          <div key={categoryKey} className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{categoryInfo.title}</h3>
                <p className="text-sm text-yankee-light">{categoryInfo.description}</p>
              </div>
              <button
                onClick={() => handleRandomSound(categoryKey)}
                disabled={isPlaying}
                className={`font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 ${
                  isPlaying
                    ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                    : `${categoryInfo.color} text-white hover:scale-105 active:scale-95`
                }`}
              >
                <span className="text-xl">🎲</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">Random</div>
                  <div className="text-xs text-white/80">{getUnplayedCount(categoryKey)} left</div>
                </div>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sounds.map((sound) => {
                const cached = isCached(sound.file);
                
                return (
                  <button
                    key={sound.id}
                    onClick={() => handleSoundClick(sound)}
                    disabled={isPlaying}
                    className={`relative font-bold py-8 px-6 rounded-lg shadow-lg transition-all duration-200 ${
                      isPlaying
                        ? `${categoryInfo.disabledColor} text-yankee-light cursor-not-allowed opacity-50`
                        : `${categoryInfo.color} text-white hover:scale-105 active:scale-95`
                    }`}
                  >
                    {cached && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" title="Cached for offline use" />
                    )}
                    <div className="text-xl">{sound.label}</div>
                    {getPlayCount(sound.id) > 0 && (
                      <div className="text-sm text-white/80 mt-1">
                        ▶ {getPlayCount(sound.id)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}


