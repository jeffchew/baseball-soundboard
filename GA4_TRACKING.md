# GA4 Event Tracking Documentation

## Overview
GA4 event tracking has been implemented across all audio playback in the Baseball Soundboard app.

## Event Structure
All audio playback events use the same event name with different parameters:

**Event Name:** `play_audio`

**Parameters:**
- `audio_type`: The category of audio being played
- `audio_name`: The display name/label of the audio
- `audio_id`: The unique identifier for the audio file
- `player_number`: (walkups only) The player's jersey number

## Audio Types Tracked

### 1. Songs (Music Tab)
- **audio_type:** `song`
- **Tracks:** All songs from the Music tab
- **Example:**
  ```javascript
  {
    audio_type: 'song',
    audio_name: 'Sweet Caroline',
    audio_id: 'sweet-caroline'
  }
  ```

### 2. Sounds (Soundboard Tab)
- **audio_type:** `sound`
- **Tracks:** All sound effects from the Soundboard tab
- **Example:**
  ```javascript
  {
    audio_type: 'sound',
    audio_name: 'Charge Organ',
    audio_id: 'charge-organ'
  }
  ```

### 3. Walkups (Lineup Tab)
- **audio_type:** `walkup`
- **Tracks:** Individual player walkup music when clicked
- **Example:**
  ```javascript
  {
    audio_type: 'walkup',
    audio_name: 'Jasper Chew',
    audio_id: 'walkup-8',
    player_number: '8'
  }
  ```

### 4. Pregame Intros (Lineup Tab)
- **audio_type:** `pregame_intro`
- **Tracks:** All pregame intro announcements (Lake Monsters intro, player intros, intro end)
- **Example:**
  ```javascript
  {
    audio_type: 'pregame_intro',
    audio_name: 'Intro 08 Jasper Chew',
    audio_id: 'intro-8'
  }
  ```

### 5. Pregame Background Music (Lineup Tab)
- **audio_type:** `pregame_background`
- **Tracks:** Background music that plays during the pregame sequence
- **Example:**
  ```javascript
  {
    audio_type: 'pregame_background',
    audio_name: 'Centerfield',
    audio_id: 'song4'
  }
  ```

## Viewing Events in GA4

### Real-time Reports
1. Go to GA4 → Reports → Realtime
2. Look for `play_audio` events
3. Click on the event to see parameter details

### Custom Reports
1. Go to GA4 → Explore
2. Create a new exploration
3. Add `Event name` dimension (filter to `play_audio`)
4. Add custom dimensions: `audio_type`, `audio_name`, `audio_id`
5. Add `Event count` as metric

### Recommended Custom Dimensions
To get the most out of this tracking, register these custom dimensions in GA4:
1. `audio_type` - Shows which category of audio is most popular
2. `audio_name` - Shows which specific songs/sounds are played most
3. `audio_id` - Unique identifier for tracking
4. `player_number` - (for walkups) Shows which players are most popular

## Testing
To verify events are firing:
1. Open your app in a browser
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Filter by "collect" or "google-analytics"
5. Play any audio
6. Look for network requests containing `en=play_audio`

Alternatively, use the GA4 DebugView:
1. Install Google Analytics Debugger Chrome extension
2. Enable it
3. Go to GA4 → Configure → DebugView
4. Play audio in your app
5. See events appear in real-time

## Implementation Files
- `src/components/MusicTab.jsx` - Song tracking
- `src/components/SoundboardTab.jsx` - Sound effect tracking
- `src/components/LineupTab.jsx` - Walkup and pregame intro tracking