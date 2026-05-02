import { useEffect, useState } from 'react';

/**
 * Hook to check if specific audio files are cached
 * Returns a Set of cached file paths for quick lookup
 */
export function useAudioCache() {
  const [cachedFiles, setCachedFiles] = useState(new Set());

  useEffect(() => {
    const checkCache = async () => {
      try {
        const cacheNames = await caches.keys();
        const audioCacheName = cacheNames.find(name => name.includes('audio-cache'));
        
        if (audioCacheName) {
          const cache = await caches.open(audioCacheName);
          const requests = await cache.keys();
          
          // Extract file paths from cache requests
          const paths = requests.map(request => {
            const url = new URL(request.url);
            return url.pathname;
          });
          
          setCachedFiles(new Set(paths));
        }
      } catch (error) {
        console.error('[Cache] Error checking audio cache:', error);
      }
    };

    // Check immediately and then every 3 seconds
    checkCache();
    const interval = setInterval(checkCache, 3000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Check if a specific file is cached
   * @param {string} filePath - The file path (e.g., '/audio/songs/Sweet Caroline.mp3')
   * @returns {boolean} True if the file is cached
   */
  const isCached = (filePath) => {
    return cachedFiles.has(filePath);
  };

  return {
    cachedFiles,
    isCached,
    cacheCount: cachedFiles.size,
  };
}


