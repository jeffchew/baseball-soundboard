import { useState } from 'react';
import audioEngine from '../utils/audioEngine';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { audioConfig } from '../config';

export default function Header({ activeTab, setActiveTab, isPlaying, setIsPlaying, resetPlayCounts }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { status, offlineReady, audioCacheCount } = useServiceWorker();
  const { isIOS } = useDeviceDetection();

  const handleInitialize = async () => {
    const success = await audioEngine.initialize();
    if (success) {
      setIsInitialized(true);
    }
  };

  const handlePreload = async () => {
    setIsPreloading(true);
    
    // Get all audio files from config
    const audioFiles = [];
    audioConfig.walkups.forEach(item => audioFiles.push(item.file));
    audioConfig.sounds.forEach(item => audioFiles.push(item.file));
    audioConfig.songs.forEach(item => audioFiles.push(item.file));
    audioConfig.pregame.forEach(item => audioFiles.push(item.file));
    
    // Remove duplicates
    const uniqueFiles = [...new Set(audioFiles)];
    setProgress({ current: 0, total: uniqueFiles.length });

    let successCount = 0;
    for (let i = 0; i < uniqueFiles.length; i++) {
      try {
        const response = await fetch(uniqueFiles[i]);
        if (response.ok) {
          await response.blob();
          successCount++;
        }
      } catch (error) {
        console.warn(`Failed to preload: ${uniqueFiles[i]}`, error);
      }
      setProgress({ current: i + 1, total: uniqueFiles.length });
    }

    setIsPreloading(false);
    console.log(`Preload complete: ${successCount} files cached`);
  };

  const handleClearCache = async () => {
    if (confirm('Clear all cached audio files and reset the app? This will fetch fresh versions of all files. You will need to preload again for offline use.')) {
      try {
        // Clear all caches
        const cacheNames = await caches.keys();
        let totalFilesCleared = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalFilesCleared += keys.length;
          await Promise.all(keys.map(key => cache.delete(key)));
        }
        
        // Unregister all service workers to force fresh registration
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration => registration.unregister()));
        }
        
        // Track cache clear in GA4
        if (window.gtag) {
          window.gtag('event', 'clear_audio_cache', {
            files_cleared: totalFilesCleared,
            service_worker_reset: true,
          });
        }
        
        alert('Cache cleared and service worker reset! The page will now reload with fresh files.');
        // Force reload from server, bypassing cache
        window.location.reload(true);
      } catch (error) {
        console.error('Failed to clear cache:', error);
        alert('Failed to clear cache. Check console for details.');
      }
    }
  };

  const handlePlayAnthem = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    const playStartTime = Date.now();
    
    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'play_audio', {
        audio_type: 'national_anthem',
        audio_name: 'National Anthem',
        audio_id: 'national-anthem',
      });
    }
    
    const anthem = audioConfig.pregame.find(p => p.id === 'national-anthem');
    const audio = audioEngine.play(anthem.file, {
      startTime: anthem.startTime,
      fadeIn: anthem.fadeIn,
    });
    
    audio.onended = () => {
      setIsPlaying(false);
      
      // Track duration when audio ends naturally
      const durationPlayed = Math.round((Date.now() - playStartTime) / 1000);
      if (window.gtag) {
        window.gtag('event', 'audio_complete', {
          audio_type: 'national_anthem',
          audio_name: 'National Anthem',
          audio_id: 'national-anthem',
          duration_seconds: durationPlayed,
        });
      }
    };
  };

  const handleResetPlayCounts = () => {
    if (confirm('Reset all play counts? This will clear the play count tracking for all audio files.')) {
      resetPlayCounts();
      
      // Track in GA4
      if (window.gtag) {
        window.gtag('event', 'reset_play_counts', {
          action: 'manual_reset',
        });
      }
      
      alert('Play counts have been reset!');
    }
  };

  const tabs = [
    { id: 'lineup', label: 'Lineup' },
    { id: 'soundboard', label: 'Soundboard' },
    { id: 'music', label: 'Music' },
  ];

  const showPreloadButton = !offlineReady && !isPreloading && (status === 'ready' || status === 'online');
  const showOfflineReady = offlineReady;
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-yankee-navy border-b-2 border-yankee-slate shadow-lg">
      <div className="px-4 py-3">
        {/* Initialize Audio Button - Only for iOS devices */}
        {!isInitialized && isIOS && (
          <div className="mb-3">
            <button
              onClick={handleInitialize}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-200"
            >
              🔊 Initialize Audio (iPhone Users)
            </button>
          </div>
        )}

        {/* Preload Button */}
        {showPreloadButton && (
          <div className="mb-3 flex items-center gap-3">
            <img
              src="/lake-monsters-logo.png"
              alt="Lake Monsters Logo"
              className="h-12 w-auto flex-shrink-0"
            />
            <div className="flex-1">
              <button
                onClick={handlePreload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-200"
              >
                📥 Preload All Audio for Offline Use
              </button>
              {audioCacheCount > 0 && (
                <div className="mt-2 text-center text-sm text-blue-300">
                  {audioCacheCount} files already cached
                </div>
              )}
            </div>
            <button
              onClick={handleResetPlayCounts}
              className="flex-shrink-0 font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 bg-orange-600 hover:bg-orange-700 text-white"
              title="Reset Play Counts"
            >
              🔄
            </button>
            <button
              onClick={handlePlayAnthem}
              disabled={isPlaying}
              className={`flex-shrink-0 font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 ${
                isPlaying
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title="Play National Anthem"
            >
              🇺🇸
            </button>
          </div>
        )}

        {/* Preloading Progress */}
        {isPreloading && (
          <div className="mb-3 bg-blue-600 text-white rounded-lg p-4 shadow-lg">
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

        {showOfflineReady && (
          <div className="mb-3 flex items-center gap-3">
            <img
              src="/lake-monsters-logo.png"
              alt="Lake Monsters Logo"
              className="h-12 w-auto flex-shrink-0"
            />
            <div className="flex-1 bg-green-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-2 font-bold mb-1">
                    <span>📶</span>
                    <span>Offline Ready</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  </div>
                  <div className="text-center text-sm opacity-90">
                    {audioCacheCount} audio files cached • Ready for game day!
                  </div>
                </div>
                <button
                  onClick={handleClearCache}
                  className="ml-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors"
                  title="Clear cached audio files"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
            <button
              onClick={handleResetPlayCounts}
              className="flex-shrink-0 font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 bg-orange-600 hover:bg-orange-700 text-white"
              title="Reset Play Counts"
            >
              🔄
            </button>
            <button
              onClick={handlePlayAnthem}
              disabled={isPlaying}
              className={`flex-shrink-0 font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 ${
                isPlaying
                  ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title="Play National Anthem"
            >
              🇺🇸
            </button>
          </div>
        )}


        {/* Tab Navigation */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 font-bold rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-yankee-navy shadow-lg'
                  : 'bg-yankee-slate text-white hover:bg-yankee-gray'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}


