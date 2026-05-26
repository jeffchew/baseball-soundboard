import { useState } from 'react';
import audioEngine from '../utils/audioEngine';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { audioConfig } from '../config';

/**
 * Header component with tab navigation, audio initialization, and offline caching controls.
 * Displays preload button, offline status, and provides access to settings and national anthem.
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ('lineup', 'soundboard', or 'music')
 * @param {Function} props.setActiveTab - Function to change the active tab
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {Function} props.setIsPlaying - Function to update playing state
 * @param {Function} props.resetPlayCounts - Function to reset all play count tracking
 */
export default function Header({ activeTab, setActiveTab, isPlaying, setIsPlaying, resetPlayCounts }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { status, offlineReady, audioCacheCount } = useServiceWorker();
  const { isIOS } = useDeviceDetection();

  /**
   * Initializes the audio engine for iOS devices.
   * Required to unlock audio playback on iOS due to browser restrictions.
   */
  const handleInitialize = async () => {
    const success = await audioEngine.initialize();
    if (success) {
      setIsInitialized(true);
    }
  };

  /**
   * Preloads all audio files for offline use by fetching them into the browser cache.
   * Displays progress as files are downloaded and cached by the service worker.
   * Includes walkups, sounds, songs, and pregame audio files.
   */
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

  /**
   * Clears all cached audio files and resets the service worker.
   * Prompts for confirmation before clearing cache and reloading the page.
   * Useful for forcing fresh downloads of updated audio files.
   */
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

  /**
   * Plays the national anthem audio file.
   * Prevents playback if audio is already playing and tracks the event in Google Analytics.
   */
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

  /**
   * Resets all play count tracking after user confirmation.
   * Clears the play count data from localStorage and tracks the reset in Google Analytics.
   */
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

  // Tab configuration for navigation
  const tabs = [
    { id: 'lineup', label: 'Lineup' },
    { id: 'soundboard', label: 'Soundboard' },
    { id: 'music', label: 'Music' },
  ];

  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <>
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

          {/* Top Row: Logo + Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
              title="Settings & Controls"
            >
              <img
                src="/lake-monsters-logo.png"
                alt="Lake Monsters Logo"
                className="h-12 w-auto"
              />
            </button>
            
            {/* Tab Navigation */}
            <div className="flex-1 flex gap-2">
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
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-yankee-navy border-2 border-yankee-slate rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-yankee-navy border-b border-yankee-slate px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Settings & Controls</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-white hover:text-yankee-light text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Offline Status */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Offline Mode</h3>
                {offlineReady ? (
                  <div className="bg-green-600 text-white rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 font-bold mb-1">
                      <span>📶</span>
                      <span>Offline Ready</span>
                    </div>
                    <div className="text-center text-sm opacity-90">
                      {audioCacheCount} files cached • Ready for game day!
                    </div>
                  </div>
                ) : isPreloading ? (
                  <div className="bg-blue-600 text-white rounded-lg p-4">
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
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* National Anthem */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">National Anthem</h3>
                <button
                  onClick={() => {
                    handlePlayAnthem();
                    setShowSettingsModal(false);
                  }}
                  disabled={isPlaying}
                  className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-200 ${
                    isPlaying
                      ? 'bg-yankee-gray text-yankee-light cursor-not-allowed opacity-50'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  🇺🇸 Play National Anthem
                </button>
              </div>

              {/* Advanced Settings */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Advanced</h3>
                <div className="space-y-2">
                  <a
                    href="/clear-cache.html"
                    className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-200 text-center"
                  >
                    🔧 Cache & Settings
                  </a>
                  <button
                    onClick={() => {
                      handleResetPlayCounts();
                      setShowSettingsModal(false);
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-200"
                  >
                    🔄 Reset Play Counts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


