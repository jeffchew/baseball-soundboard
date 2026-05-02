# Offline Cache Testing Guide

This guide will help you validate that the PWA offline caching is working correctly for the Lake Monsters soundboard.

## Quick Validation Checklist

- [ ] Service worker registered successfully
- [ ] "Offline Ready" status appears in header
- [ ] Audio files cached in browser storage
- [ ] App loads while offline
- [ ] Audio plays while offline
- [ ] iOS/Safari audio works from cache

## Method 1: Browser DevTools (Recommended)

### Chrome/Edge DevTools

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open DevTools** (F12 or Cmd+Option+I)

3. **Check Service Worker Registration:**
   - Go to **Application** tab → **Service Workers**
   - You should see: `http://localhost:5173/dev-sw.js?dev-sw` (dev mode)
   - Status should be: **activated and is running**
   - Click "Update" to force a refresh if needed

4. **Verify Cache Storage:**
   - Go to **Application** tab → **Cache Storage**
   - You should see these caches:
     - `workbox-precache-v2-http://localhost:5173/` (or similar)
     - `audio-cache` (appears after playing audio)
     - `manifest-cache` (if using JSON manifests)
     - `assets-cache`

5. **Test Audio Caching:**
   - Click "Initialize Audio" button
   - Play several audio files from different tabs
   - Go back to **Cache Storage** → **audio-cache**
   - You should see the .mp3 files you played listed there
   - Each entry shows the full URL (e.g., `http://localhost:5173/audio/songs/Sweet Caroline.mp3`)

6. **Simulate Offline Mode:**
   - In DevTools, go to **Network** tab
   - Check the **Offline** checkbox (top of Network panel)
   - Refresh the page (Cmd+R / Ctrl+R)
   - The app should still load
   - Play audio files you previously played - they should work!

7. **Verify Network Requests:**
   - With **Offline** unchecked, clear the Network log
   - Play an audio file you've already cached
   - In the Network tab, look for the audio request
   - The **Size** column should show **(ServiceWorker)** or **(disk cache)**
   - This confirms it's being served from cache, not the network

### Safari DevTools (macOS/iOS)

1. **Enable Developer Menu:**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"

2. **Open Web Inspector:**
   - Develop → Show Web Inspector (Cmd+Option+I)

3. **Check Service Worker:**
   - Go to **Storage** tab → **Service Workers**
   - Should show registered service worker

4. **Check Cache:**
   - **Storage** tab → **Cache Storage**
   - Verify caches are present

5. **Test Offline:**
   - Develop → Disable Caches (to test fresh)
   - Play audio files
   - Turn on Airplane Mode on your Mac/iPhone
   - Refresh and test audio playback

## Method 2: Visual Status Indicator

The app includes a built-in status indicator in the header:

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Watch the status button:**
   - Initially shows: 🌐 **Caching...** (blue)
   - After playing audio: 📶 **Offline Ready** (green with pulse)

3. **Click the status button** to expand details:
   - Shows "All audio cached for offline use"
   - Shows "Ready for game day!" when fully cached

4. **The green pulse animation** confirms offline readiness

## Method 3: Network Throttling Test

Test with poor network conditions (simulates ballpark WiFi):

1. **Open DevTools** → **Network** tab

2. **Select throttling profile:**
   - Click dropdown that says "No throttling"
   - Select **Slow 3G** or **Fast 3G**

3. **Test performance:**
   - First play: Audio loads slowly from network
   - Second play: Audio plays instantly from cache
   - Network tab shows **(ServiceWorker)** for cached files

## Method 4: Airplane Mode Test (Real Offline)

The ultimate test - actual offline mode:

### Desktop (Mac/Windows)

1. **Load the app while online:**
   ```bash
   npm run dev
   ```

2. **Use the app normally:**
   - Click "Initialize Audio"
   - Play 5-10 different audio files
   - Wait for "Offline Ready" indicator

3. **Enable Airplane Mode:**
   - Mac: Control Center → Airplane Mode
   - Windows: Settings → Network → Airplane Mode

4. **Test offline functionality:**
   - Refresh the page (should still load)
   - Play previously played audio (should work)
   - Try playing new audio (will fail - expected)

### Mobile (iOS/Android)

1. **Visit the app on your phone** (use ngrok or deploy to test)

2. **Play several audio files** while online

3. **Enable Airplane Mode**

4. **Test:**
   - App should load from cache
   - Previously played audio should work
   - This validates iOS range request support

## Method 5: Production Deployment Test

Test on the actual deployed site:

1. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "Add PWA offline support"
   git push origin main
   ```

2. **Wait for deployment** (check GitHub Actions)

3. **Visit lakemonsters.jchew.com**

4. **Use the app:**
   - Play multiple audio files
   - Wait for "Offline Ready" status

5. **Test offline:**
   - Turn on Airplane Mode
   - Close and reopen the browser
   - Navigate to lakemonsters.jchew.com
   - App should load and audio should play

## Method 6: Cache Size Verification

Check how much storage is being used:

### Chrome

1. **DevTools** → **Application** → **Storage**
2. Look at **Usage** section
3. Shows total storage used by the site
4. Audio cache can be 100-200MB depending on files played

### Safari

1. **Web Inspector** → **Storage** tab
2. Shows storage quota and usage

## Expected Results

### ✅ Success Indicators

- Service worker shows "activated and is running"
- Cache Storage contains `audio-cache` with .mp3 files
- Network requests show **(ServiceWorker)** for cached files
- "Offline Ready" indicator appears (green with pulse)
- App loads in Airplane Mode
- Audio plays in Airplane Mode (previously played files)
- iOS/Safari can play cached audio

### ❌ Failure Indicators

- Service worker shows "redundant" or "error"
- No caches appear in Cache Storage
- Network always shows file size (not from cache)
- "Online Only" error indicator appears
- App doesn't load offline
- Audio fails to play offline

## Troubleshooting

### Service Worker Not Registering

**Problem:** No service worker in DevTools

**Solutions:**
1. Ensure you're using HTTPS or localhost
2. Check browser console for errors
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Clear site data and reload

### Audio Not Caching

**Problem:** audio-cache is empty after playing files

**Solutions:**
1. Check Network tab - are files loading?
2. Verify vite.config.js has correct cache rules
3. Check console for service worker errors
4. Ensure files are .mp3 or .m4a format

### Offline Mode Fails

**Problem:** App doesn't work in Airplane Mode

**Solutions:**
1. Ensure you played audio files while online first
2. Check that service worker is activated
3. Verify Cache Storage has the files
4. Try hard refresh before going offline

### iOS Audio Not Playing

**Problem:** Audio works on desktop but not iOS offline

**Solutions:**
1. Verify `rangeRequests: true` in vite.config.js
2. Check `cacheableResponse.statuses` includes 206
3. Test with Safari on Mac first
4. Ensure audio was played once while online

## Development vs Production

### Development Mode (`npm run dev`)

- Service worker: `dev-sw.js?dev-sw`
- Caching works but may be less aggressive
- Hot reload may interfere with caching
- Use for initial testing

### Production Mode (`npm run build && npm run preview`)

- Service worker: `sw.js`
- Full caching behavior
- Better for final validation
- Closer to deployed experience

## Testing Checklist for Game Day

Before the game, verify:

1. [ ] Deploy latest version to lakemonsters.jchew.com
2. [ ] Visit site on your phone while online
3. [ ] Click "Initialize Audio"
4. [ ] Play through all player walk-up songs
5. [ ] Play common sound effects
6. [ ] Wait for "Offline Ready" indicator
7. [ ] Enable Airplane Mode
8. [ ] Verify app loads
9. [ ] Test playing cached audio
10. [ ] Disable Airplane Mode before game starts

## Monitoring During Game

Watch for these indicators:

- **Green "Offline Ready"** = All good, fully cached
- **Blue "Caching..."** = Still loading files, stay online
- **Yellow "Update Ready"** = New version available (update after game)
- **Red "Online Only"** = Problem, may need network connection

## Cache Management

### Clear Cache (if needed)

**Chrome:**
1. DevTools → Application → Storage
2. Click "Clear site data"

**Safari:**
1. Develop → Empty Caches

**Manual:**
1. Close all tabs with the app
2. Reopen and hard refresh

### Update Service Worker

When you deploy a new version:
1. Users will see "Update Ready" indicator
2. Click "Update Now" button
3. Page reloads with new version
4. Cache rebuilds automatically

## Performance Metrics

Expected performance after caching:

- **Page Load:** <1 second (from cache)
- **Audio Start:** <100ms (instant from cache)
- **Cache Size:** 50-200MB (depends on usage)
- **Network Requests:** 0 (when offline)

## Additional Resources

- [Chrome DevTools Service Worker Guide](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [Safari Web Inspector Guide](https://webkit.org/web-inspector/)
- [PWA Testing Best Practices](https://web.dev/pwa-checklist/)