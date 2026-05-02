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
          // Normalize paths by removing query strings and ensuring consistent format
          const paths = requests.map(request => {
            const url = new URL(request.url);
            // Get pathname and remove any query strings
            let path = url.pathname;
            
            // Decode URL encoding (e.g., %20 -> space)
            path = decodeURIComponent(path);
            
            // Normalize the path - ensure it starts with /
            if (!path.startsWith('/')) {
              path = '/' + path;
            }
            
            return path;
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
    // Normalize the input path
    let normalizedPath = filePath;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    
    // Decode URL encoding to match cached paths
    normalizedPath = decodeURIComponent(normalizedPath);
    
    // Check if the normalized path exists in cache
    return cachedFiles.has(normalizedPath);
  };

  return {
    cachedFiles,
    isCached,
    cacheCount: cachedFiles.size,
  };
}


