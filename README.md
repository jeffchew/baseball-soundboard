# Baseball Soundboard

A mobile-optimized React soundboard for youth baseball games, featuring player walk-ups, sound effects, and music management.

## Features

- **Player Lineup**: Grid of player buttons with walk-up music
- **Automated Lineup Sequence**: Play through entire lineup with background music ducking
- **Soundboard**: Quick access to situational sound effects
- **Music Player**: Full-length tracks for breaks and warm-ups
- **Singleton Audio Engine**: Only one track plays at a time
- **Smooth Transitions**: Fade-in/fade-out effects for professional sound
- **Mobile Optimized**: Large touch targets, no zoom, PWA support
- **Yankee Stadium Theme**: Dark navy color scheme

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your audio files to the `/public/audio/` directory:
   - `/public/audio/walkups/` - Player walk-up clips
   - `/public/audio/sounds/` - Quick sound effects
   - `/public/audio/songs/` - Full-length tracks
   - `/public/audio/pregame/` - Background loops

3. Update audio configuration in `src/config.js`

4. Run development server:
```bash
npm run dev
```

## Deployment to GitHub Pages

1. Update `vite.config.js` with your repository name:
```javascript
base: '/your-repo-name/'
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

## Audio File Structure

```
public/
└── audio/
    ├── walkups/
    │   ├── player1.mp3
    │   ├── player2.mp3
    │   └── ...
    ├── sounds/
    │   ├── charge.mp3
    │   ├── strike3.mp3
    │   └── ...
    ├── songs/
    │   ├── song1.mp3
    │   └── ...
    └── pregame/
        ├── background1.mp3
        └── ...
```

## Configuration

Edit `src/config.js` to customize:
- Player names and numbers
- Audio file paths
- Start times and fade-in settings
- Sound effects and songs

## Browser Compatibility

- Requires user interaction to initialize audio (browser security)
- Click "Initialize Audio" button before playing sounds
- Best experienced on mobile devices in landscape mode
- Add to home screen for full-screen PWA experience