# PWA & Offline Caching Setup

## Overview

The Lake Monsters Soundboard is configured as a Progressive Web App (PWA) with robust offline caching to ensure reliable operation at ballparks with poor connectivity.

## Configuration

### Vite PWA Plugin

The app uses `vite-plugin-pwa` with Workbox for service worker generation and caching strategies.

**Key Features:**
- ✅ Automatic service worker registration
- ✅ CacheFirst strategy for audio files (.mp3, .m4a)
- ✅ StaleWhileRevalidate for JSON manifests
- ✅ Range request support for Safari/iOS audio playback
- ✅ Offline-ready indicator UI

### Caching Strategies

#### Audio Files (CacheFirst)
```javascript
// .mp3 and .m4a files
- Strategy: CacheFirst
- Cache Name: 'audio-cache'
- Max Entries: 200
- Max Age: 1 year
- Supports: Range requests (HTTP 206) for iOS/Safari
```

**Why CacheFirst?** Audio files are large and don't change. Once cached, they're served instantly from cache without network requests.

#### JSON Manifests (StaleWhileRevalidate)
```javascript
// roster.json, sounds.json
- Strategy: StaleWhileRevalidate
- Cache Name: 'manifest-cache'
- Max Entries: 10
- Max Age: 1 week
```

**Why StaleWhileRevalidate?** Manifests may update, but we want instant loading. This strategy serves cached versions immediately while checking for updates in the background.

#### Other Assets (StaleWhileRevalidate)
```javascript
// JS, CSS, HTML, images
- Strategy: StaleWhileRevalidate
- Cache Name: 'assets-cache'
- Max Entries: 100
- Max Age: 30 days
```

### Safari/iOS Audio Fix

**Critical Implementation:** The `rangeRequests: true` option enables the Workbox RangeRequestsPlugin, which is essential for iOS/Safari audio playback.

**Why it's needed:**
- iOS Safari uses HTTP range requests (206 Partial Content) for audio streaming
- Without range request support, cached audio won't play on iOS devices
- The plugin intercepts range requests and serves the appropriate byte ranges from cache

## Service Worker Registration

### Custom Hook: `useServiceWorker`

Located at [`src/hooks/useServiceWorker.js`](src/hooks/useServiceWorker.js)

**Returns:**
```javascript
{
  status: 'loading' | 'online' | 'offline-ready' | 'update-available' | 'error',
  offlineReady: boolean,
  needRefresh: boolean,
  updateServiceWorker: Function
}
```

**Features:**
- Tracks registration state
- Monitors online/offline status
- Detects when app is ready for offline use
- Handles service worker updates
- Checks for updates every hour

### Status Indicator Component

Located at [`src/components/OfflineStatus.jsx`](src/components/OfflineStatus.jsx)

**Stadium-themed UI states:**
- 🌐 **Online** - "Caching audio files..."
- 📶 **Field Ready** - "All audio cached for offline use" (with pulse animation)
- 🔄 **Update Available** - "New version ready" (with update button)
- ⚠️ **Error** - "Offline Mode Unavailable"

The indicator appears in the bottom-right corner and provides real-time feedback on caching status.

## Deployment Configuration

### Custom Domain Setup (lakemonsters.jchew.com)

**Current Configuration:**
```javascript
// vite.config.js
base: '/'  // ✅ Correct for custom domain
```

**Service Worker Scope:**
The service worker is registered at the root scope (`/`) which is correct for:
- Custom domains (lakemonsters.jchew.com)
- GitHub Pages with custom domain

**Important:** The `base: '/'` setting ensures:
- Service worker registers at `https://lakemonsters.jchew.com/sw.js`
- All assets are referenced from root
- No path prefix issues

### Cloudflare Cache Rules

**Recommended Settings:**

1. **Bypass Service Worker:**
   ```
   Rule: If URL path matches /sw.js
   Action: Bypass cache
   ```
   This ensures users always get the latest service worker.

2. **Cache Audio Assets:**
   ```
   Rule: If URL path matches /audio/*
   Action: Cache Everything
   Edge Cache TTL: 1 year
   Browser Cache TTL: 1 year
   ```
   This provides CDN-level caching for audio files.

3. **Cache Other Assets:**
   ```
   Rule: If URL path matches /assets/*
   Action: Cache Everything
   Edge Cache TTL: 30 days
   Browser Cache TTL: 30 days
   ```

### GitHub Actions Deployment

The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) automatically:
1. Builds the app with Vite
2. Generates the service worker
3. Deploys to GitHub Pages

**No changes needed** - the current workflow is compatible with PWA deployment.

## Testing Offline Functionality

### Development Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```
   The PWA is enabled in development mode for testing.

2. **Open DevTools:**
   - Chrome: Application → Service Workers
   - Check "Offline" to simulate offline mode
   - Verify audio files play from cache

3. **Check Cache Storage:**
   - Application → Cache Storage
   - Look for: `audio-cache`, `manifest-cache`, `assets-cache`

### Production Testing

1. **Deploy to production:**
   ```bash
   git push origin main
   ```

2. **Visit lakemonsters.jchew.com**

3. **Wait for "Field Ready" indicator:**
   - The green indicator with pulse animation confirms offline readiness
   - This means all accessed audio files are cached

4. **Test offline:**
   - Turn on airplane mode or disable network
   - Refresh the page
   - Play audio files - they should work offline

## Verification Checklist

Before game day, verify:

- [ ] Service worker registered successfully (check DevTools)
- [ ] "Field Ready" indicator shows green with pulse
- [ ] Audio files play in airplane mode
- [ ] Page loads offline (after initial visit)
- [ ] iOS/Safari devices can play cached audio
- [ ] Update notification appears when new version deployed

## Troubleshooting

### Service Worker Not Registering

**Check:**
1. HTTPS is enabled (required for service workers)
2. Browser console for registration errors
3. DevTools → Application → Service Workers shows registration

**Solution:**
- Service workers only work on HTTPS or localhost
- GitHub Pages provides HTTPS automatically
- Cloudflare proxy provides HTTPS

### Audio Not Playing Offline on iOS

**Check:**
1. `rangeRequests: true` is set in vite.config.js
2. Cache includes status code 206 in `cacheableResponse.statuses`
3. Audio was played at least once while online (to cache it)

**Solution:**
- The current config includes all necessary iOS fixes
- Ensure users play audio files at least once while online

### "Field Ready" Never Shows

**Possible causes:**
1. Audio files haven't been accessed yet
2. Network errors preventing caching
3. Service worker not registered

**Solution:**
- Play through audio files while online to cache them
- Check browser console for errors
- Verify service worker is active in DevTools

### Cache Not Updating

**Check:**
1. Service worker update interval (set to 1 hour)
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Clear cache in DevTools

**Solution:**
- Wait for automatic update check
- Use "Update Now" button when it appears
- Clear site data in DevTools if needed

## File Structure

```
baseball-soundboard/
├── vite.config.js              # PWA configuration
├── src/
│   ├── hooks/
│   │   └── useServiceWorker.js # Service worker hook
│   ├── components/
│   │   └── OfflineStatus.jsx   # Status indicator UI
│   └── App.jsx                 # Includes OfflineStatus
├── public/
│   ├── manifest.json           # PWA manifest
│   └── audio/                  # Audio files (cached on-demand)
└── dev-dist/
    └── sw.js                   # Generated service worker (dev)
```

## Technical Details

### Service Worker Lifecycle

1. **Registration:** Service worker registers on page load
2. **Installation:** Downloads and caches precache assets
3. **Activation:** Takes control of the page
4. **Runtime Caching:** Caches audio files as they're requested
5. **Update Check:** Checks for updates every hour

### Cache Strategy Details

**CacheFirst (Audio):**
```
Request → Check Cache → Return if found
                     → Fetch from network if not found
                     → Store in cache
                     → Return response
```

**StaleWhileRevalidate (Manifests/Assets):**
```
Request → Check Cache → Return cached version immediately
                     → Fetch from network in background
                     → Update cache with new version
```

### Range Request Handling

For iOS/Safari audio playback:
```
1. Browser requests: Range: bytes=0-1023
2. Service worker intercepts request
3. Retrieves full audio file from cache
4. Slices requested byte range
5. Returns 206 Partial Content response
```

## Performance Considerations

- **Initial Load:** ~2-3 seconds (includes service worker registration)
- **Cached Load:** <1 second (served from cache)
- **Audio Playback:** Instant (no network delay)
- **Cache Size:** ~100-200MB (depends on audio files accessed)

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 45+ | ✅ Full |
| Safari | 11.1+ | ✅ Full (with range requests) |
| Firefox | 44+ | ✅ Full |
| Edge | 17+ | ✅ Full |
| iOS Safari | 11.3+ | ✅ Full (with range requests) |

## Additional Resources

- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Best Practices](https://web.dev/pwa-checklist/)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify service worker status in DevTools
3. Review this documentation
4. Check GitHub Issues for similar problems