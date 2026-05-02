import { useState } from 'react';
import { audioConfig } from '../config';

/**
 * Component to preload all audio files into cache
 * Useful for ensuring offline readiness before going to the ballpark
 */
export default function PreloadAudio() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  // Get all audio files from config
  const getAudioFiles = () => {
    const audioFiles = [];
    
    // Collect all file paths from config
    audioConfig.walkups.forEach(item => audioFiles.push(item.file));
    audioConfig.sounds.forEach(item => audioFiles.push(item.file));
    audioConfig.songs.forEach(item => audioFiles.push(item.file));
    audioConfig.pregameBackgroundOptions?.forEach(item => audioFiles.push(item.file));
    audioConfig.pregame.forEach(item => audioFiles.push(item.file));

    // Remove duplicates (some files appear in multiple categories)
    return [...new Set(audioFiles)];
  };

  const preloadAudio = async () => {
    setIsPreloading(true);
    setIsComplete(false);
    
    const audioFiles = getAudioFiles();
    setProgress({ current: 0, total: audioFiles.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < audioFiles.length; i++) {
      try {
        const response = await fetch(audioFiles[i]);
        if (response.ok) {
          // Just fetching triggers the service worker to cache it
          await response.blob(); // Consume the response
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.warn(`Failed to preload: ${audioFiles[i]}`, error);
        failCount++;
      }
      
      setProgress({ current: i + 1, total: audioFiles.length });
    }

    setIsPreloading(false);
    setIsComplete(true);
    
    console.log(`Preload complete: ${successCount} cached, ${failCount} failed`);
  };

  const percentage = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  if (isComplete) {
    return (
      <div className="bg-green-600 text-white rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-bold">Preload Complete!</div>
              <div className="text-sm opacity-90">
                {progress.total} files cached for offline use
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsComplete(false)}
            className="text-xs bg-white text-green-700 px-3 py-1 rounded hover:bg-green-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white rounded-lg p-4 mb-3">
      {!isPreloading ? (
        <button
          onClick={preloadAudio}
          className="w-full flex items-center justify-center gap-2 font-bold"
        >
          <span>📥</span>
          <span>Preload All Audio for Offline Use</span>
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">Preloading Audio...</span>
            <span className="text-sm">{percentage}%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2 mb-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs opacity-90">
            {progress.current} of {progress.total} files
          </div>
        </div>
      )}
    </div>
  );
}


