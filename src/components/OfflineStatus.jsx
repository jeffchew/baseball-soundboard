import { useServiceWorker } from '../hooks/useServiceWorker';

/**
 * Stadium-themed offline status indicator for the Lake Monsters soundboard
 * Shows when the app is ready to work offline at the ballpark
 */
export default function OfflineStatus() {
  const { status, offlineReady, needRefresh, updateServiceWorker } = useServiceWorker();

  // Don't show anything while loading
  if (status === 'loading') {
    return null;
  }

  // Status configurations with stadium-themed styling
  const statusConfig = {
    'offline-ready': {
      icon: '📶',
      text: 'Field Ready',
      subtext: 'All audio cached for offline use',
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-700',
    },
    'online': {
      icon: '🌐',
      text: 'Online',
      subtext: 'Caching audio files...',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-700',
    },
    'update-available': {
      icon: '🔄',
      text: 'Update Available',
      subtext: 'New version ready',
      bgColor: 'bg-yellow-600',
      textColor: 'text-white',
      borderColor: 'border-yellow-700',
    },
    'error': {
      icon: '⚠️',
      text: 'Offline Mode Unavailable',
      subtext: 'Using online mode only',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-700',
    },
  };

  const config = statusConfig[status] || statusConfig['online'];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <div
        className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg border-2 ${config.borderColor} p-4 transition-all duration-300 hover:scale-105`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0" role="img" aria-label="Status icon">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-tight mb-1">
              {config.text}
            </div>
            <div className="text-xs opacity-90 leading-tight">
              {config.subtext}
            </div>
            
            {/* Show update button if update is available */}
            {needRefresh && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="mt-2 w-full bg-white text-yellow-700 font-semibold text-xs py-1.5 px-3 rounded hover:bg-yellow-50 transition-colors"
              >
                Update Now
              </button>
            )}
          </div>
        </div>

        {/* Offline ready indicator with pulse animation */}
        {offlineReady && (
          <div className="mt-2 pt-2 border-t border-green-500/30">
            <div className="flex items-center gap-2 text-xs">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-100"></span>
              </div>
              <span className="font-medium">Ready for game day!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


