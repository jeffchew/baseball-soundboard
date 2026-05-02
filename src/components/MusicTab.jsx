import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';

export default function MusicTab({ isPlaying, setIsPlaying }) {
  const { isCached } = useAudioCache();

  const handleSongClick = (song) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const audio = audioEngine.play(song.file, {
      startTime: song.startTime,
      fadeIn: song.fadeIn,
    });
    
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="p-4 pb-24">
      <div className="space-y-4">
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
                <span className="text-xl">{song.label}</span>
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

// Made with Bob
