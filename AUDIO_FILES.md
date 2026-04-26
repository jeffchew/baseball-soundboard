# Audio Files Reference

This document lists all audio files currently configured in the soundboard.

## Player Walk-ups (13 players)

1. **Gabriel Zaro** (#1) - `Walk up 01 Gabriel Zaro.mp3`
2. **Henry Ullrich** (#2) - `Walk up 02 Henry Ullrich.mp3`
3. **Sameer Doshi** (#3) - `Walk up 03 Sameer Doshi.mp3`
4. **Oliver Tang** (#4) - `Walk up 04 Oliver Tang.mp3`
5. **Ilyaas Khanshab** (#5) - `Walk up 05 Ilyaas Khanshab.mp3`
6. **Xavier Xia** (#6) - `Walk up 06 Xavier Xia.mp3`
7. **Hunter Smith** (#7) - `Walk up 07 Hunter Smith.mp3`
8. **Jasper Chew** (#8) - `Walk up 08 Jasper Chew.mp3`
9. **Ryan Shin** (#9) - `Walk up 09 Ryan Shin.mp3`
10. **Stan Schmidt** (#10) - `Walk up 10 Stan Schmidt.mp3`
11. **Devin Bedi** (#11) - `Walk up 11 Devin Bedi.mp3`
12. **Nicholas Teseo** (#12) - `Walk up 12 Nicholas Teseo.mp3`
13. **Liam OConnor** (#13) - `Walk up 13 Liam OConnor.mp3`

## Sound Effects (18 sounds)

- 007 James Bond Theme
- Calvary Charge
- Charge! (Organ)
- Cinematic Riser
- Drums 1-6 (6 variations)
- I'm Walkin' (Fats Domino)
- Imperial Siren
- Jaws Theme
- Let's Go (Organ)
- Greek Chant (Organ)
- PC Richard Whistle
- Take a Walk
- Walk Like a Man

## Songs (46 tracks)

### Classic Rock
- Back In Black
- Crazy Train
- Enter Sandman
- Eye of the Tiger
- Hells Bells
- Highway to Hell
- Kickstart My Heart
- Livin' on a Prayer
- Paradise City
- Shoot To Thrill
- Sweet Child O' Mine
- Thunderstruck
- Walk This Way
- Welcome To The Jungle
- You Shook Me All Night Long

### Hip Hop / Rap
- All I Do Is Win
- Empire State of Mind
- Lose Yourself
- No Sleep 'Til Brooklyn
- Sabotage
- Seven Nation Army
- Shook Ones, Pt. II
- Trap Queen (Clean)
- We Ready

### Pop / Dance
- 24K Magic
- Can't Stop The Feeling!
- Smooth Criminal
- Uptown Funk

### Baseball Classics
- Centerfield
- Sweet Caroline
- Take Me Out To The Ball Game

### Other
- Are You Gonna Go My Way
- Baba O'Riley
- Believer
- Blitzkrieg Bop
- Crazy Little Thing Called Love
- Don't Stop 'til You Get Enough
- I Believe That We Will Win
- Jump Around
- New York Groove
- Rick Astley - Never Gonna Give You Up
- Steve's Lava Chicken (Jack Black)
- The Imperial March
- Theme From New York, New York
- We Will Rock You
- YMCA

## Pregame Intros (15 files)

Individual player intro announcements:
- Intro 01-13 (matching each player)
- Intro End
- Intro Lake Monsters (team intro)

## File Organization

```
public/audio/
├── walkups/     (13 files) - Player-specific walk-up music
├── sounds/      (18 files) - Quick sound effects
├── songs/       (46 files) - Full-length tracks
└── pregame/     (15 files) - Intro announcements
```

**Total Files**: 92 audio files

## Usage Notes

- **Walk-ups**: Automatically play in sequence with "Start Lineup Sequence" button
- **Sounds**: Quick-play buttons for instant effects
- **Songs**: Full tracks with fade-in for warm-ups and breaks
- **Pregame**: Individual intro announcements (can be used separately or in sequence)

## Updating Files

To add, remove, or modify audio files:

1. Add/remove files in the appropriate `/public/audio/` subdirectory
2. Update [`src/config.js`](src/config.js) with the new file information
3. Rebuild: `npm run build`
4. Deploy: `git push`

## File Format

All files are MP3 format for maximum compatibility across browsers and devices.