// Audio configuration for the baseball soundboard
// Cache busting version - automatically set to git commit hash at build time
const AUDIO_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : Date.now().toString();

// Helper function to add cache-busting parameter
const audioUrl = (path) => `${path}?v=${AUDIO_VERSION}`;

export const audioConfig = {
  // Pregame intro settings
  pregameBackgroundVolume: 0.50, // Volume for background music during pregame intro (0.0 to 1.0)
  
  // Player walk-up music (premixed ElevenLabs + music)
  walkups: [
    { id: 1, label: 'Gabriel Zaro', number: '1', file: audioUrl('/audio/walkups/Walk up 01 Gabriel Zaro.mp3'), startTime: 0, fadeIn: true },
    { id: 2, label: 'Henry Ullrich', number: '2', file: audioUrl('/audio/walkups/Walk up 02 Henry Ullrich.mp3'), startTime: 0, fadeIn: true },
    { id: 3, label: 'Sameer Doshi', number: '3', file: audioUrl('/audio/walkups/Walk up 03 Sameer Doshi.mp3'), startTime: 0, fadeIn: true },
    { id: 4, label: 'Oliver Tang', number: '4', file: audioUrl('/audio/walkups/Walk up 04 Oliver Tang.mp3'), startTime: 0, fadeIn: true },
    { id: 5, label: 'Ilyaas Khanshab', number: '5', file: audioUrl('/audio/walkups/Walk up 05 Ilyaas Khanshab.mp3'), startTime: 0, fadeIn: true },
    { id: 6, label: 'Xavier Xia', number: '6', file: audioUrl('/audio/walkups/Walk up 06 Xavier Xia.mp3'), startTime: 0, fadeIn: true },
    { id: 7, label: 'Hunter Smith', number: '7', file: audioUrl('/audio/walkups/Walk up 07 Hunter Smith.mp3'), startTime: 0, fadeIn: true },
    { id: 8, label: 'Jasper Chew', number: '8', file: audioUrl('/audio/walkups/Walk up 08 Jasper Chew.mp3'), startTime: 0, fadeIn: true },
    { id: 9, label: 'Ryan Shin', number: '9', file: audioUrl('/audio/walkups/Walk up 09 Ryan Shin.mp3'), startTime: 0, fadeIn: true },
    { id: 10, label: 'Stan Schmidt', number: '10', file: audioUrl('/audio/walkups/Walk up 10 Stan Schmidt.mp3'), startTime: 0, fadeIn: true },
    { id: 11, label: 'Devin Bedi', number: '11', file: audioUrl('/audio/walkups/Walk up 11 Devin Bedi.mp3'), startTime: 0, fadeIn: true },
    { id: 12, label: 'Nicholas Teseo', number: '12', file: audioUrl('/audio/walkups/Walk up 12 Nicholas Teseo.mp3'), startTime: 0, fadeIn: true },
    { id: 13, label: 'Liam OConnor', number: '13', file: audioUrl('/audio/walkups/Walk up 13 Liam OConnor.mp3'), startTime: 0, fadeIn: true },
  ],

  // Quick situational sound effects
  sounds: [
    // At Bat - Short clips for during at-bats
    { id: 'addams-family', label: 'Addams Family', file: audioUrl('/audio/sounds/addams_family_theme.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'imperial', label: 'Two Strikes', file: audioUrl('/audio/sounds/imperial_siren.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'mario-coin-atbat', label: 'Mario Coin', file: audioUrl('/audio/sounds/mario_coin.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'slide-whistle', label: 'Slide Whistle 1', file: audioUrl('/audio/sounds/slide_whistle.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'slide-whistle2', label: 'Slide Whistle 2', file: audioUrl('/audio/sounds/slide_whistle2.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'sonic-ring-atbat', label: 'Sonic Ring', file: audioUrl('/audio/sounds/sonic_ring.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'whistle-atbat', label: 'Whistle', file: audioUrl('/audio/sounds/whistle.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    { id: 'whistle', label: 'Strikeout', file: audioUrl('/audio/sounds/pc_richard_and_son_whi.mp3'), startTime: 0, fadeIn: false, category: 'at-bat' },
    
    // Hype - Crowd hype and energy sounds
    { id: 'baby-shark', label: 'Baby Shark', file: audioUrl('/audio/sounds/Baby Shark.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'calvary', label: 'Calvary Charge', file: audioUrl('/audio/sounds/Calvary Charge.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'charge', label: 'Charge!', file: audioUrl('/audio/sounds/Charge Organ.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'riser', label: 'Cinematic Riser', file: audioUrl('/audio/sounds/Cinematic-riser-boom.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums1', label: 'Drums 1', file: audioUrl('/audio/sounds/drums 1.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums2', label: 'Drums 2', file: audioUrl('/audio/sounds/drums 2.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums3', label: 'Drums 3', file: audioUrl('/audio/sounds/drums 3.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums4', label: 'Drums 4', file: audioUrl('/audio/sounds/drums 4.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums5', label: 'Drums 5', file: audioUrl('/audio/sounds/drums 5.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'drums6', label: 'Drums 6', file: audioUrl('/audio/sounds/drums 6.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'greek-chant', label: 'Greek Chant', file: audioUrl('/audio/sounds/organ-greek-chant (1).mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    { id: 'lets-go', label: "Let's Go", file: audioUrl('/audio/sounds/organ let_s go.mp3'), startTime: 0, fadeIn: false, category: 'hype' },
    
    // Walk - For when batter walks
    { id: 'james-bond', label: '007', file: audioUrl('/audio/sounds/007 James Bond Theme.mp3'), startTime: 36, fadeIn: true, category: 'walk' },
    { id: 'walkin', label: "I'm Walkin'", file: audioUrl('/audio/sounds/Fats Domino - I_m Walkin_.mp3'), startTime: 0, fadeIn: false, category: 'walk' },
    { id: 'jaws', label: 'Jaws Theme', file: audioUrl('/audio/sounds/Jaws - Theme.mp3'), startTime: 55, fadeIn: true, category: 'walk' },
    { id: 'song33', label: 'Smooth Criminal', file: audioUrl('/audio/songs/Smooth Criminal.mp3'), startTime: 13, fadeIn: true, category: 'walk' },
    { id: 'take-walk', label: 'Take a Walk', file: audioUrl('/audio/sounds/Take a Walk.mp3'), startTime: 90, fadeIn: true, category: 'walk' },
    { id: 'boots-walking', label: 'These Boots', file: audioUrl('/audio/sounds/These Boots Are Made For Walking.mp3'), startTime: 0, fadeIn: false, category: 'walk' },
    { id: 'walk-man', label: 'Walk Like a Man', file: audioUrl('/audio/sounds/Walk Like a Man.mp3'), startTime: 43, fadeIn: true, category: 'walk' },
    { id: 'song41', label: 'Walk This Way', file: audioUrl('/audio/songs/Walk This Way.mp3'), startTime: 60, fadeIn: true, category: 'walk' },
    
    // Victory Short - Quick celebration clips
    { id: 'boomshakalaka', label: 'Boomshakalaka', file: audioUrl('/audio/sounds/boomshakalaka.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'cowabunga', label: 'Cowabunga', file: audioUrl('/audio/sounds/tmnt_cowabunga.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'ff-victory', label: 'Final Fantasy Victory', file: audioUrl('/audio/sounds/final-fantasy-vii-victory-fanfare.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'hadouken', label: 'Hadouken', file: audioUrl('/audio/sounds/hadouken.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'mario-star', label: 'Mario Star Theme', file: audioUrl('/audio/sounds/mario_star_theme.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'mario-victory', label: 'Super Mario Victory', file: audioUrl('/audio/sounds/super_mario_victory.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'mega-man-x', label: 'Mega Man X', file: audioUrl('/audio/sounds/mega_man_x_victory.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'price-is-right', label: 'Price is Right', file: audioUrl('/audio/sounds/the_price_is_right.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'sonic-rings', label: 'Sonic Rings', file: audioUrl('/audio/sounds/sonic_rings_3x.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'zelda-item', label: 'Zelda 1', file: audioUrl('/audio/sounds/zelda_item.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    { id: 'zelda-item2', label: 'Zelda 2', file: audioUrl('/audio/sounds/zelda_item2.mp3'), startTime: 0, fadeIn: false, category: 'hit-short' },
    
    // Victory Long - Longer celebration clips
    { id: 'all-star', label: 'All Star', file: audioUrl('/audio/sounds/All Star.mp3'), startTime: 52, fadeIn: true, category: 'hit-long' },
    { id: 'cant-touch', label: "U Can't Touch This", file: audioUrl("/audio/sounds/U Can_t Touch This.mp3"), startTime: 0, fadeIn: false, category: 'hit-long' },
    { id: 'celebration', label: 'Celebration', file: audioUrl('/audio/sounds/Celebration.mp3'), startTime: 32, fadeIn: true, category: 'hit-long' },
    { id: 'dogs-out', label: 'Who Let the Dogs Out', file: audioUrl('/audio/sounds/Who Let The Dogs Out.mp3'), startTime: 0, fadeIn: false, category: 'hit-long' },
    { id: 'i-feel-good', label: 'I Got You (I Feel Good)', file: audioUrl('/audio/sounds/I Got You (I Feel Good).mp3'), startTime: 0, fadeIn: false, category: 'hit-long' },
    { id: 'level-up', label: 'Level Up', file: audioUrl('/audio/sounds/Level Up.mp3'), startTime: 6, fadeIn: true, category: 'hit-long' },
    { id: 'seinfeld', label: 'Seinfeld', file: audioUrl('/audio/sounds/seinfeld_opening.mp3'), startTime: 0, fadeIn: false, category: 'hit-long' },
    { id: 'whoomp', label: 'Whoomp! (There It Is)', file: audioUrl('/audio/sounds/Whoomp! (There It Is).mp3'), startTime: 30, fadeIn: true, category: 'hit-long' },
  ],

  // Full-length songs for between innings
  songs: [
    { id: 'song1', label: '24K Magic', file: audioUrl('/audio/songs/24K Magic.mp3'), startTime: 22, fadeIn: true },
    //{ id: 'song2', label: 'All I Do Is Win', file: audioUrl('/audio/songs/All I Do Is Win.mp3'), startTime: 0, fadeIn: true },
    { id: 'song2b', label: 'All Star', file: audioUrl('/audio/songs/All Star.mp3'), startTime: 15, fadeIn: true },
    { id: 'song3', label: 'Are You Gonna Go My Way', file: audioUrl('/audio/songs/Are You Gonna Go My Way.mp3'), startTime: 0, fadeIn: true },
    { id: 'song4', label: "Baba O'Riley", file: audioUrl('/audio/songs/Baba O_Riley.mp3'), startTime: 32, fadeIn: true },
    { id: 'song5', label: 'Back In Black', file: audioUrl('/audio/songs/Back In Black.mp3'), startTime: 5, fadeIn: true },
    { id: 'song5b', label: 'Bad To The Bone', file: audioUrl('/audio/songs/Bad To The Bone.mp3'), startTime: 5, fadeIn: true },
    //{ id: 'song6', label: 'Believer', file: audioUrl('/audio/songs/Believer.mp3'), startTime: 0, fadeIn: true },
    { id: 'song7', label: 'Blitzkrieg Bop', file: audioUrl('/audio/songs/Blitzkrieg Bop.mp3'), startTime: 0, fadeIn: true },
    { id: 'song7b', label: "Can't Hold Us", file: audioUrl('/audio/songs/Can_t Hold Us.mp3'), startTime: 0, fadeIn: true },
    { id: 'song8', label: "Can't Stop The Feeling!", file: audioUrl('/audio/songs/Can_t Stop The Feeling!.mp3'), startTime: 41, fadeIn: true },
    { id: 'song9', label: 'Centerfield', file: audioUrl('/audio/songs/Centerfield.mp3'), startTime: 0, fadeIn: true },
    { id: 'song10', label: 'Crazy Little Thing Called Love', file: audioUrl('/audio/songs/Crazy Little Thing Called Love.mp3'), startTime: 0, fadeIn: true },
    { id: 'song11', label: 'Crazy Train', file: audioUrl('/audio/songs/Crazy Train.mp3'), startTime: 0, fadeIn: true },
    { id: 'song12', label: "Don't Stop 'til You Get Enough", file: audioUrl('/audio/songs/Don_t Stop _til You Get Enough.mp3'), startTime: 14, fadeIn: true },
    { id: 'song13', label: 'Empire State of Mind', file: audioUrl('/audio/songs/Empire State Of Mind.mp3'), startTime: 54, fadeIn: true },
    //{ id: 'song14', label: 'Enter Sandman', file: audioUrl('/audio/songs/Enter Sandman.mp3'), startTime: 0, fadeIn: true },
    { id: 'song14b', label: 'Espresso', file: audioUrl('/audio/songs/Espresso.mp3'), startTime: 0, fadeIn: true },
    { id: 'song15', label: 'Eye of the Tiger', file: audioUrl('/audio/songs/Eye of the Tiger.mp3'), startTime: 0, fadeIn: true },
    //{ id: 'song16', label: 'Trap Queen', file: audioUrl('/audio/songs/Fetty Wap - Trap Queen (Clean).mp3'), startTime: 0, fadeIn: true },
    { id: 'song16b', label: 'Happy', file: audioUrl('/audio/songs/Happy.mp3'), startTime: 0, fadeIn: true },
    { id: 'song17', label: 'Hells Bells', file: audioUrl('/audio/songs/Hells Bells.mp3'), startTime: 19, fadeIn: true },
    { id: 'song18', label: 'Highway to Hell', file: audioUrl('/audio/songs/Highway to Hell.mp3'), startTime: 0, fadeIn: true },
    { id: 'song19', label: 'I Believe That We Will Win', file: audioUrl('/audio/songs/I Believe That We Will Win (World Anthem).mp3'), startTime: 0, fadeIn: true },
    { id: 'song20', label: "Steve's Lava Chicken", file: audioUrl('/audio/songs/Jack Black - Steve_s Lava Chicken.mp3'), startTime: 8, fadeIn: true },
    //{ id: 'song20b', label: "Steve's Lava Chicken (Extended)", file: audioUrl('/audio/songs/Jack Black - Steve_s Lava Chicken (Extended Version).mp3'), startTime: 0, fadeIn: true },
    { id: 'song21', label: 'Jump Around', file: audioUrl('/audio/songs/Jump Around.mp3'), startTime: 0, fadeIn: true },
    { id: 'song22', label: 'Kickstart My Heart', file: audioUrl('/audio/songs/Kickstart My Heart.mp3'), startTime: 0, fadeIn: true },
    { id: 'song23', label: "Livin' on a Prayer", file: audioUrl("/audio/songs/Livin on a Prayer.mp3"), startTime: 15, fadeIn: true },
    { id: 'song24', label: 'Lose Yourself', file: audioUrl('/audio/songs/Lose Yourself.mp3'), startTime: 30, fadeIn: true },
    { id: 'song25', label: 'New York Groove', file: audioUrl('/audio/songs/New York Groove.mp3'), startTime: 46, fadeIn: true },
    { id: 'song25b', label: "No Longer Bound (I'm Free)", file: audioUrl("/audio/songs/No Longer Bound (I_m Free).mp3"), startTime: 17, fadeIn: true },
    { id: 'song26', label: "No Sleep 'Til Brooklyn", file: audioUrl('/audio/songs/No Sleep _Til Brooklyn.mp3'), startTime: 0, fadeIn: true },
    { id: 'song27', label: 'Paradise City', file: audioUrl('/audio/songs/Paradise City.mp3'), startTime: 0, fadeIn: true },
    { id: 'song28', label: 'Never Gonna Give You Up', file: audioUrl('/audio/songs/Rick Astley - Never Gonna Give You Up.mp3'), startTime: 0, fadeIn: true },
    { id: 'song28b', label: 'Renegade', file: audioUrl('/audio/songs/Renegade.mp3'), startTime: 42, fadeIn: true },
    { id: 'song29', label: 'Sabotage', file: audioUrl('/audio/songs/Sabotage.mp3'), startTime: 0, fadeIn: true },
    { id: 'song30', label: 'Seven Nation Army', file: audioUrl('/audio/songs/Seven Nation Army.mp3'), startTime: 0, fadeIn: true },
    { id: 'song31', label: 'Shook Ones, Pt. II', file: audioUrl('/audio/songs/Shook Ones, Pt. II.mp3'), startTime: 23, fadeIn: true },
    { id: 'song31b', label: 'Shake It Off', file: audioUrl('/audio/songs/Shake It Off.mp3'), startTime: 0, fadeIn: true },
    { id: 'song32', label: 'Shoot To Thrill', file: audioUrl('/audio/songs/Shoot To Thrill.mp3'), startTime: 0, fadeIn: true },
    { id: 'song32b', label: 'Shooting Stars', file: audioUrl('/audio/songs/Shooting Stars.mp3'), startTime: 18, fadeIn: true },
    { id: 'song33', label: 'Smooth Criminal', file: audioUrl('/audio/songs/Smooth Criminal.mp3'), startTime: 13, fadeIn: true },
    { id: 'song33b', label: 'Summer Love', file: audioUrl('/audio/songs/Summer Love.mp3'), startTime: 0, fadeIn: true },
    { id: 'song33c', label: 'Swag Surfin', file: audioUrl('/audio/songs/Swag Surfin.mp3'), startTime: 0, fadeIn: true },
    { id: 'song34', label: 'Sweet Caroline', file: audioUrl('/audio/songs/Sweet Caroline.mp3'), startTime: 0, fadeIn: true },
    { id: 'song35', label: "Sweet Child O' Mine", file: audioUrl('/audio/songs/Sweet Child O_ Mine.mp3'), startTime: 0, fadeIn: true },
    { id: 'song35b', label: 'Sweet Home Alabama', file: audioUrl('/audio/songs/Sweet Home Alabama.mp3'), startTime: 15, fadeIn: true },
    { id: 'song36', label: 'Take Me Out To The Ball Game', file: audioUrl('/audio/songs/Take Me Out To The Ball Game.mp3'), startTime: 0, fadeIn: true },
    { id: 'song36b', label: 'The Final Countdown', file: audioUrl('/audio/songs/The Final Countdown.mp3'), startTime: 12, fadeIn: true },
    { id: 'song37', label: 'The Imperial March', file: audioUrl('/audio/songs/The Imperial March.mp3'), startTime: 0, fadeIn: true },
    { id: 'song38', label: 'Theme From New York, New York', file: audioUrl('/audio/songs/Theme From New York, New York.mp3'), startTime: 0, fadeIn: true },
    { id: 'song38b', label: 'Thunder', file: audioUrl('/audio/songs/Thunder.mp3'), startTime: 0, fadeIn: true },
    { id: 'song39', label: 'Thunderstruck', file: audioUrl('/audio/songs/Thunderstruck.mp3'), startTime: 0, fadeIn: true },
    { id: 'song40', label: 'Uptown Funk', file: audioUrl('/audio/songs/Uptown Funk.mp3'), startTime: 13, fadeIn: true },
    { id: 'song42', label: 'We Ready', file: audioUrl('/audio/songs/We Ready.mp3'), startTime: 0, fadeIn: true },
    { id: 'song43', label: 'We Will Rock You', file: audioUrl('/audio/songs/We Will Rock You.mp3'), startTime: 0, fadeIn: true },
    { id: 'song44', label: 'Welcome To The Jungle', file: audioUrl('/audio/songs/Welcome To The Jungle.mp3'), startTime: 0, fadeIn: true },
    { id: 'song44b', label: 'Whole Lotta Love', file: audioUrl('/audio/songs/Whole Lotta Love.mp3'), startTime: 0, fadeIn: true },
    { id: 'song45', label: 'YMCA', file: audioUrl('/audio/songs/YMCA.mp3'), startTime: 0, fadeIn: true },
    { id: 'song46', label: 'You Shook Me All Night Long', file: audioUrl('/audio/songs/You Shook Me All Night Long.mp3'), startTime: 0, fadeIn: true },
  ],

  // Selectable background music for pregame intro sequence
  pregameBackgroundOptions: [
    { id: 'song4', label: "Baba O'Riley", file: audioUrl('/audio/songs/Baba O_Riley.mp3'), startTime: 30, fadeIn: true },
    { id: 'song15', label: 'Eye of the Tiger', file: audioUrl('/audio/songs/Eye of the Tiger.mp3'), startTime: 0, fadeIn: true },
    { id: 'song5', label: 'Back In Black', file: audioUrl('/audio/songs/Back In Black.mp3'), startTime: 5, fadeIn: true },
    { id: 'song37', label: 'The Imperial March', file: audioUrl('/audio/songs/The Imperial March.mp3'), startTime: 0, fadeIn: true },
    { id: 'song44', label: 'Welcome To The Jungle', file: audioUrl('/audio/songs/Welcome To The Jungle.mp3'), startTime: 0, fadeIn: true },
    { id: 'song39', label: 'Thunderstruck', file: audioUrl('/audio/songs/Thunderstruck.mp3'), startTime: 0, fadeIn: true },
    { id: 'song21', label: 'Jump Around', file: audioUrl('/audio/songs/Jump Around.mp3'), startTime: 0, fadeIn: true },
  ],

  // Background loops for pregame announcements (player intros)
  pregame: [
    { id: 'intro-zaro', label: 'Gabriel Zaro Intro', file: audioUrl('/audio/pregame/Intro 01 Gabriel Zaro.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-ullrich', label: 'Henry Ullrich Intro', file: audioUrl('/audio/pregame/Intro 02 Henry Ullrich.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-doshi', label: 'Sameer Doshi Intro', file: audioUrl('/audio/pregame/Intro 03 Sameer Doshi.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-tang', label: 'Oliver Tang Intro', file: audioUrl('/audio/pregame/Intro 04 Oliver Tang.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-khanshab', label: 'Ilyaas Khanshab Intro', file: audioUrl('/audio/pregame/Intro 05 Ilyaas Khanshab.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-xia', label: 'Xavier Xia Intro', file: audioUrl('/audio/pregame/Intro 06 Xavier Xia.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-smith', label: 'Hunter Smith Intro', file: audioUrl('/audio/pregame/Intro 07 Hunter Smith.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-chew', label: 'Jasper Chew Intro', file: audioUrl('/audio/pregame/Intro 08 Jasper Chew.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-shin', label: 'Ryan Shin Intro', file: audioUrl('/audio/pregame/Intro 09 Ryan Shin.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-schmidt', label: 'Stan Schmidt Intro', file: audioUrl('/audio/pregame/Intro 10 Stan Schmidt.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-bedi', label: 'Devon Bedi Intro', file: audioUrl('/audio/pregame/Intro 11 Devon Bedi.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-teseo', label: 'Nicholas Teseo Intro', file: audioUrl('/audio/pregame/Intro 12 Nicholas Teseo.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-oconnor', label: 'Liam OConnor Intro', file: audioUrl('/audio/pregame/Intro 13 Liam OConnor.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-end', label: 'Intro End', file: audioUrl('/audio/pregame/Intro end.mp3'), startTime: 0, fadeIn: false },
    { id: 'intro-monsters', label: 'Lake Monsters Intro', file: audioUrl('/audio/pregame/Intro Lake Monsters lineup.mp3'), startTime: 0, fadeIn: false },
    { id: 'national-anthem', label: 'National Anthem', file: audioUrl('/audio/pregame/National Anthem.mp3'), startTime: 0, fadeIn: false },
  ],
};

// Made with Bob
