import { audioConfig } from '../config';
import audioEngine from '../utils/audioEngine';
import { useAudioCache } from '../hooks/useAudioCache';

export default function SoundboardTab({ isPlaying, setIsPlaying }) {
  const { isCached } = useAudioCache();

  const handleSoundClick = (sound) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const audio = audioEngine.play(sound.file, {
      startTime: sound.startTime,
      fadeIn: sound.fadeIn,
    });
    
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="p-4 pb-24">
      <div className="grid grid-cols-2 gap-4">
        {audioConfig.sounds.map((sound) => {
          const cached = isCached(sound.file);
          
          return (
            <button
              key={sound.id}
              onClick={() => handleSoundClick(sound)}
              disabled={isPlaying}
              className={`relative font-bold py-8 px-6 rounded-lg shadow-lg transition-all duration-200 ${
                isPlaying
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                  : 'bg-yankee-slate hover:bg-yankee-gray text-white hover:scale-105 active:scale-95'
              }`}
            >
              {cached && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" title="Cached for offline use" />
              )}
              <div className="text-xl">{sound.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Made with Bob
