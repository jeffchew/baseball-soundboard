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

  const handleRandomSong = () => {
    if (isPlaying) return;
    
    // Exclude specific songs from random selection
    const excludedSongIds = ['song38', 'song37']; // Theme From New York, New York & The Imperial March
    const eligibleSongs = audioConfig.songs.filter(song => !excludedSongIds.includes(song.id));
    
    // Filter songs that haven't been played yet
    const unplayedSongs = eligibleSongs.filter(song => getPlayCount(song.id) === 0);
    
    // If all songs have been played, use all eligible songs
    const availableSongs = unplayedSongs.length > 0 ? unplayedSongs : eligibleSongs;
    
    // Pick a random song
    const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    
    // Play the random song
    handleSongClick(randomSong);
  };

  return (
    <div className="p-4 pb-24">
      <div className="space-y-4">
        {/* Random Song Button */}
        <button
          onClick={handleRandomSong}
          disabled={isPlaying}
          className={`relative w-full font-bold py-6 px-6 rounded-lg shadow-lg transition-all duration-200 text-left ${
            isPlaying
              ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-102 active:scale-98'
          }`}
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">🎲</span>
            <div className="flex-1">
              <span className="text-xl">Random Song</span>
              <span className="ml-3 text-sm text-white/80">
                {audioConfig.songs.filter(song => !['song38', 'song37'].includes(song.id) && getPlayCount(song.id) === 0).length} unplayed
              </span>
            </div>
          </div>
        </button>

        {/* Song List */}
        {audioConfig.songs.map((song) => {
          const cached = isCached(song.file);
          
          return (
            <button
              key={song.id}
              onClick={() => handleSongClick(song)}
              disabled={isPlaying}
              className={`relative w-full font-bold py-6 px-6 rounded-lg shadow-lg transition-all duration-200 text-left ${
                isPlaying
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                  : 'bg-yankee-slate hover:bg-yankee-gray text-white hover:scale-102 active:scale-98'
              }`}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">🎵</span>
                <div className="flex-1">
                  <span className="text-xl">{song.label}</span>
                  {getPlayCount(song.id) > 0 && (
                    <span className="ml-3 text-sm text-yankee-light">
                      ▶ {getPlayCount(song.id)}
                    </span>
                  )}
                </div>
                {cached && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full flex-shrink-0" title="Cached for offline use" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


