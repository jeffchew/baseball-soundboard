import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';

export default function MusicTab({ isPlaying, setIsPlaying, incrementPlayCount, getPlayCount }) {
  const { isCached } = useAudioCache();

  const handleSongClick = (song) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    incrementPlayCount(song.id);
    
    const playStartTime = Date.now();
    
    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'song',
        audio_name: song.label,
        audio_id: song.id,
      });
    }
    
    const audio = audioEngine.play(song.file, {
      startTime: song.startTime,
      fadeIn: song.fadeIn,
      audioType: 'song',
    });
    
    audio.onended = () => {
      setIsPlaying(false);
      
      // Track duration when audio ends naturally
      const durationPlayed = Math.round((Date.now() - playStartTime) / 1000);
      if (window.gtag) {
        window.gtag('event', 'audio_complete', {
          audio_type: 'song',
          audio_name: song.label,
          audio_id: song.id,
          duration_seconds: durationPlayed,
        });
      }
    };
  };

  const handleRandomSong = (category) => {
    if (isPlaying) return;
    
    // Filter songs by category
    const eligibleSongs = audioConfig.songs.filter(song => song.category === category);
    
    // Filter songs that haven't been played yet
    const unplayedSongs = eligibleSongs.filter(song => getPlayCount(song.id) === 0);
    
    // If all songs have been played, use all eligible songs
    const availableSongs = unplayedSongs.length > 0 ? unplayedSongs : eligibleSongs;
    
    // Pick a random song
    const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    
    // Play the random song
    handleSongClick(randomSong);
  };

  // Get count of unplayed songs by category
  const getUnplayedCount = (category) => {
    const songs = audioConfig.songs.filter(song => song.category === category);
    return songs.filter(song => getPlayCount(song.id) === 0).length;
  };

  // Category configuration
  const categories = {
    'upbeat': {
      title: 'Upbeat',
      description: 'High-energy, danceable, feel-good songs',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      disabledColor: 'bg-yellow-800',
    },
    'rock': {
      title: 'Rock',
      description: 'Guitar-driven rock anthems',
      color: 'bg-red-600 hover:bg-red-700',
      disabledColor: 'bg-red-800',
    },
    'hip-hop': {
      title: 'Hip Hop',
      description: 'Hip hop and rap tracks',
      color: 'bg-blue-600 hover:bg-blue-700',
      disabledColor: 'bg-blue-800',
    },
    'villain': {
      title: 'Villain',
      description: 'Intimidating entrance music',
      color: 'bg-gray-700 hover:bg-gray-800',
      disabledColor: 'bg-gray-900',
    },
    'mothers-day': {
      title: "Mother's Day",
      description: 'Songs celebrating moms',
      color: 'bg-pink-600 hover:bg-pink-700',
      disabledColor: 'bg-pink-800',
    },
    'game-end': {
      title: 'Game End',
      description: 'Post-game celebration',
      color: 'bg-green-600 hover:bg-green-700',
      disabledColor: 'bg-green-800',
    },
  };

  const songsByCategory = audioConfig.songs.reduce((acc, song) => {
    const category = song.category || 'upbeat';
    if (!acc[category]) acc[category] = [];
    acc[category].push(song);
    return acc;
  }, {});

  return (
    <div className="p-4 pb-24">
      {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
        const songs = songsByCategory[categoryKey] || [];
        if (songs.length === 0) return null;

        // Hide random button for villain, mothers-day, and game-end categories
        const showRandomButton = categoryKey !== 'villain' && categoryKey !== 'mothers-day' && categoryKey !== 'game-end';

        return (
          <div key={categoryKey} className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{categoryInfo.title}</h3>
                <p className="text-sm text-yankee-light">{categoryInfo.description}</p>
              </div>
              {showRandomButton && (
                <button
                  onClick={() => handleRandomSong(categoryKey)}
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
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {songs.map((song) => {
                const cached = isCached(song.file);
                
                return (
                  <button
                    key={song.id}
                    onClick={() => handleSongClick(song)}
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
                    <div className="text-xl">{song.label}</div>
                    {getPlayCount(song.id) > 0 && (
                      <div className="text-sm text-white/80 mt-1">
                        ▶ {getPlayCount(song.id)}
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

// Made with Bob
