import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Custom hook to manage Service Worker registration and status
 * Provides offline-ready status for the Lake Monsters soundboard
 *
 * @returns {Object} Service worker status and control functions
 * @returns {string} status - Current status: 'loading', 'online', 'ready', 'offline-ready', 'update-available', 'error'
 * @returns {boolean} offlineReady - True when app AND audio are ready to work offline
 * @returns {boolean} needRefresh - True when an update is available
 * @returns {Function} updateServiceWorker - Function to update the service worker
 * @returns {number} audioCacheCount - Number of audio files cached
 */
export function useServiceWorker() {
  const [status, setStatus] = useState('loading');
  const [audioCacheCount, setAudioCacheCount] = useState(0);

  const {
    offlineReady: swOfflineReady,
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('[SW] Service Worker registered:', swUrl);
      
      // Check for updates periodically (every hour)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[SW] Service Worker registration error:', error);
      setStatus('error');
    },
    onOfflineReady() {
      console.log('[SW] Service Worker installed and precache complete');
      // Don't set offline-ready yet - need to check audio cache
    },
    onNeedRefresh() {
      console.log('[SW] New content available, please refresh');
      setStatus('update-available');
    },
  });

  // Check audio cache periodically
  useEffect(() => {
    const checkAudioCache = async () => {
      try {
        const cacheNames = await caches.keys();
        const audioCacheName = cacheNames.find(name => name.includes('audio-cache'));
        
        if (audioCacheName) {
          const cache = await caches.open(audioCacheName);
          const keys = await cache.keys();
          const count = keys.length;
          setAudioCacheCount(count);
          
          // Consider offline-ready if we have at least some audio cached
          if (count > 0 && swOfflineReady) {
            setStatus('offline-ready');
          } else if (swOfflineReady) {
            setStatus('ready');
          }
        } else if (swOfflineReady) {
          setStatus('ready');
        }
      } catch (error) {
        console.error('[SW] Error checking audio cache:', error);
      }
    };

    // Check immediately and then every 5 seconds
    checkAudioCache();
    const interval = setInterval(checkAudioCache, 5000);

    return () => clearInterval(interval);
  }, [swOfflineReady]);

  useEffect(() => {
    // Update status based on registration state
    if (needRefresh) {
      // Ignore update-available, just treat as ready
      return;
    }
    
    if (swOfflineReady && status === 'loading') {
      // Service worker is ready, check audio cache
      setStatus('ready');
    } else if (status === 'loading' && navigator.onLine) {
      // Still loading but online
      setStatus('online');
    }
  }, [swOfflineReady, needRefresh, status]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (status !== 'offline-ready' && status !== 'update-available') {
        setStatus(swOfflineReady ? 'ready' : 'online');
      }
    };

    const handleOffline = () => {
      if (audioCacheCount > 0 && swOfflineReady) {
        setStatus('offline-ready');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [status, swOfflineReady, audioCacheCount]);

  return {
    status,
    offlineReady: status === 'offline-ready',
    needRefresh,
    updateServiceWorker,
    audioCacheCount,
  };
}


