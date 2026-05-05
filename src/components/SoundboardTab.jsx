import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';

export default function SoundboardTab({ isPlaying, setIsPlaying, incrementPlayCount, getPlayCount }) {
  const { isCached } = useAudioCache();

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
            <div className="mb-3">
              <h3 className="text-xl font-bold text-white">{categoryInfo.title}</h3>
              <p className="text-sm text-yankee-light">{categoryInfo.description}</p>
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


