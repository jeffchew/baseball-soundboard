# Baseball Soundboard - Setup Guide

## Quick Start

This soundboard is ready to use! Follow these steps to get started:

### 1. Add Your Audio Files

Place your audio files in the appropriate directories under `/public/audio/`:

```
public/audio/
├── walkups/     # Player walk-up music (premixed announcements + music)
├── sounds/      # Quick sound effects (Charge!, Strike Three, etc.)
├── songs/       # Full-length tracks for breaks
└── pregame/     # Background loops for announcements
```

**Recommended Audio Format:**
- Format: MP3
- Bitrate: 128-192 kbps (good quality, reasonable file size)
- Sample Rate: 44.1 kHz

### 2. Configure Your Audio

Edit `src/config.js` to match your audio files:

```javascript
export const audioConfig = {
  walkups: [
    { 
      id: 1, 
      label: 'John Smith',    // Player name
      number: '12',           // Jersey number
      file: '/audio/walkups/player1.mp3', 
      startTime: 0,           // Start at beginning
      fadeIn: true            // Smooth fade-in
    },
    // Add more players...
  ],
  
  sounds: [
    { 
      id: 'charge', 
      label: 'Charge!', 
      file: '/audio/sounds/charge.mp3', 
      startTime: 0, 
      fadeIn: false           // Instant play for SFX
    },
    // Add more sounds...
  ],
  
  songs: [
    { 
      id: 'song1', 
      label: 'Warm Up Song', 
      file: '/audio/songs/warmup.mp3', 
      startTime: 0, 
      fadeIn: true 
    },
    // Add more songs...
  ],
  
  pregame: [
    { 
      id: 'bg1', 
      label: 'Background Music', 
      file: '/audio/pregame/background.mp3', 
      startTime: 0, 
      fadeIn: true 
    },
  ],
};
```

### 3. Test Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173`)

### 4. Deploy to GitHub Pages

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Features Explained

### Initialize Audio Button
- **Why?** Browsers require user interaction before playing audio
- **When?** Click this once when you first open the app
- **What?** Unlocks audio playback for the session

### Lineup Tab
- **Player Buttons**: Click any player to play their walk-up music
- **Start Lineup Sequence**: Automatically plays through all players with background music
  - Background music plays at 30% volume
  - Ducks to 10% when player walk-up plays
  - 2-second pause between players

### Soundboard Tab
- Quick access to situational sound effects
- Instant playback (no fade-in)
- Perfect for in-game moments

### Music Tab
- Full-length tracks for warm-ups and breaks
- Smooth fade-in for professional sound

### STOP Button
- Always visible at bottom of screen
- Smooth 500ms fade-out
- Stops all audio (main + background)

## Audio Engine Features

### Singleton Pattern
- Only one audio track plays at a time
- Starting new audio automatically stops previous
- Prevents audio overlap and confusion

### Fade Controls
- **Fade In**: 1.2 second ramp from 0 to full volume
- **Fade Out**: 500ms smooth transition to silence
- **Background Ducking**: Automatic volume reduction during announcements

### Start Time Offset
- Skip intros or start at specific points
- Set `startTime` in seconds in config.js
- Example: `startTime: 5` starts 5 seconds into the track

## Mobile Optimization

### Touch Targets
- Large buttons (minimum 44x44 points)
- Easy to tap in bright sunlight
- No accidental clicks

### Viewport Settings
- Prevents zooming (fixed viewport)
- Full-screen experience
- Status bar styling for iOS

### PWA Support
- Add to home screen
- Runs like a native app
- Offline-capable (once loaded)

## Customization

### Colors (Yankee Stadium Theme)
Edit `tailwind.config.js`:
```javascript
colors: {
  'yankee-navy': '#001c43',    // Primary background
  'yankee-slate': '#2c3e50',   // Button background
  'yankee-gray': '#34495e',    // Hover state
  'yankee-light': '#7f8c8d',   // Disabled text
}
```

### Button Sizes
Edit component files in `src/components/`:
- `LineupTab.jsx` - Player grid layout
- `SoundboardTab.jsx` - Sound effect buttons
- `MusicTab.jsx` - Song list items

### Tab Names
Edit `src/components/Header.jsx`:
```javascript
const tabs = [
  { id: 'lineup', label: 'Lineup' },
  { id: 'soundboard', label: 'Soundboard' },
  { id: 'music', label: 'Music' },
];
```

## Troubleshooting

### Audio Won't Play
1. Click "Initialize Audio" button first
2. Check browser console for errors
3. Verify audio files exist at specified paths
4. Try different audio format (MP3 recommended)
5. Check file permissions

### Buttons Not Responding
1. Ensure JavaScript is enabled
2. Check for console errors
3. Try refreshing the page
4. Clear browser cache

### Layout Issues on Mobile
1. Ensure viewport meta tag is present in index.html
2. Test in mobile browser (not desktop responsive mode)
3. Check for CSS conflicts

### Deployment Issues
1. Verify GitHub Pages is enabled
2. Check GitHub Actions for build errors
3. Ensure `base` path in vite.config.js is correct
4. Wait a few minutes for DNS propagation (custom domains)

## File Size Recommendations

- **Walk-ups**: 15-30 seconds, ~500KB-1MB each
- **Sound Effects**: 2-5 seconds, ~50-200KB each
- **Songs**: 2-4 minutes, ~3-6MB each
- **Background**: 30-60 seconds (looping), ~1-2MB

**Total recommended**: Keep under 50MB for fast loading

## Browser Compatibility

✅ **Fully Supported:**
- Chrome/Edge (Desktop & Mobile)
- Safari (Desktop & iOS)
- Firefox (Desktop & Mobile)

⚠️ **Limited Support:**
- Older browsers (IE11 and below)
- Browsers with JavaScript disabled

## Performance Tips

1. **Optimize Audio Files**
   - Use 128-192 kbps MP3
   - Trim silence from start/end
   - Normalize volume levels

2. **Reduce File Count**
   - Combine similar sounds
   - Use startTime to play different parts of same file

3. **Test on Target Device**
   - Test on actual mobile device
   - Check in bright sunlight
   - Verify touch targets are large enough

## Support

For issues or questions:
1. Check this guide and DEPLOYMENT.md
2. Review browser console for errors
3. Verify audio file paths and formats
4. Test with sample audio files first

## Next Steps

1. ✅ Add your audio files
2. ✅ Update config.js with your data
3. ✅ Test locally with `npm run dev`
4. ✅ Deploy to GitHub Pages
5. ✅ Test on mobile device
6. ✅ Share with your team!

Enjoy your baseball soundboard! ⚾🎵