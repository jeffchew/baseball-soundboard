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

**Event Name:** `audio_complete`

**Parameters:**
- `audio_type`: The category of audio that completed
- `audio_name`: The display name/label of the audio
- `audio_id`: The unique identifier for the audio file
- `duration_seconds`: How long the audio played (in seconds)
- `player_number`: (walkups only) The player's jersey number

**Event Name:** `tab_view`

**Parameters:**
- `tab_name`: The name of the tab viewed ('lineup', 'soundboard', or 'music')

## Events Tracked

### Navigation Events

#### Tab View
- **Event Name:** `tab_view`
- **Tracks:** When users switch between tabs
- **Parameters:**
  - `tab_name`: 'lineup', 'soundboard', or 'music'
- **Example:**
  ```javascript
  {
    tab_name: 'music'
  }
  ```

## Audio Playback Events

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

## Cache Management Tracking

### Preload Start Event
- **Event Name:** `preload_audio_start`
- **Tracks:** When users click the "Preload All Audio" button
- **Parameters:**
  - `total_files`: Number of audio files to be preloaded
- **Example:**
  ```javascript
  {
    total_files: 150
  }
  ```

### Audio Completion Event
- **Event Name:** `audio_complete`
- **Tracks:** When audio finishes playing naturally (not stopped manually)
- **Applies to:** Songs, sounds, and walkups
- **Parameters:**
  - `audio_type`: Type of audio ('song', 'sound', 'walkup')
  - `audio_name`: Name of the audio
  - `audio_id`: Unique identifier
  - `duration_seconds`: How long it played
  - `player_number`: (walkups only) Player number
- **Example:**
  ```javascript
  {
    audio_type: 'song',
    audio_name: 'Sweet Caroline',
    audio_id: 'sweet-caroline',
    duration_seconds: 45
  }
  ```

### Preload Complete Event
- **Event Name:** `preload_audio_complete`
- **Tracks:** When audio preloading finishes (success or failure)
- **Parameters:**
  - `total_files`: Total number of files attempted
  - `success_count`: Number of files successfully cached
  - `fail_count`: Number of files that failed to cache
  - `success_rate`: Percentage of successful caches (0-100)
- **Example:**
  ```javascript
  {
    total_files: 150,
    success_count: 148,
    fail_count: 2,
    success_rate: 99
  }
  ```

### Clear Cache Event
- **Event Name:** `clear_audio_cache`
- **Tracks:** When users clear all cached audio files
- **Parameters:**
  - `files_cleared`: Number of files removed from cache
- **Example:**
  ```javascript
  {
    files_cleared: 148
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

**For Navigation:**
1. `tab_name` - Which tabs users visit most

**For Audio Playback:**
2. `audio_type` - Shows which category of audio is most popular
3. `audio_name` - Shows which specific songs/sounds are played most
4. `audio_id` - Unique identifier for tracking
5. `player_number` - (for walkups) Shows which players are most popular
6. `duration_seconds` - How long audio played

**For Cache Management:**
7. `total_files` - Number of files in preload operation
8. `success_count` - Files successfully cached
9. `fail_count` - Files that failed to cache
10. `success_rate` - Percentage success rate
11. `files_cleared` - Number of files cleared from cache

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
- `src/App.jsx` - Tab navigation tracking
- `src/components/MusicTab.jsx` - Song tracking with duration
- `src/components/SoundboardTab.jsx` - Sound effect tracking with duration
- `src/components/LineupTab.jsx` - Walkup and pregame intro tracking with duration
- `src/components/PreloadAudio.jsx` - Audio preload tracking
- `src/components/Header.jsx` - Cache clear tracking

## Key Insights You Can Track

### Navigation & Usage Patterns
- Which tabs do users visit most?
- Which songs are most popular?
- Which sound effects get used most?
- Which players' walkups are played most often?
- Do users prefer certain pregame background music?
- How long do users typically play each audio type?
- Do users listen to full songs or stop them early?

### Offline Readiness
- What percentage of users preload audio?
- What's the average success rate for preloading?
- Are there specific files that consistently fail to cache?
- How often do users clear their cache?
- What's the typical cache size when users clear it?

### User Engagement
- How many audio plays per session?
- Which tab (Music/Soundboard/Lineup) is used most?
- Do users complete the full pregame sequence?