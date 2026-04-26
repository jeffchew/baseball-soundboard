import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';

export default function MusicTab({ isPlaying, setIsPlaying }) {
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
        {audioConfig.songs.map((song) => (
          <button
            key={song.id}
            onClick={() => handleSongClick(song)}
            disabled={isPlaying}
            className={`w-full font-bold py-6 px-6 rounded-lg shadow-lg transition-all duration-200 text-left ${
              isPlaying
                ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                : 'bg-yankee-slate hover:bg-yankee-gray text-white hover:scale-102 active:scale-98'
            }`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">🎵</span>
              <span className="text-xl">{song.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
