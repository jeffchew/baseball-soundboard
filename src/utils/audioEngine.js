/**
 * Singleton Audio Engine with fade controls for managing audio playback.
 * Handles foreground audio (songs, sounds, walkups) and background music with smooth fading.
 * Supports sequence playback with stop callbacks and audio type tracking for confirmation dialogs.
 */
class AudioEngine {
  /**
   * Creates or returns the singleton AudioEngine instance.
   * Initializes audio state including active audio, background audio, and fade intervals.
   */
  constructor() {
    if (AudioEngine.instance) {
      return AudioEngine.instance;
    }
    
    this.activeAudio = null;
    this.backgroundAudio = null;
    this.isInitialized = false;
    this.fadeInterval = null;
    this.backgroundFadeInterval = null;
    this.sequenceStopCallback = null;
    this.currentAudioType = null; // Track type: 'song', 'pregame', 'anthem', 'walkup', 'sound'
    
    AudioEngine.instance = this;
  }

  /**
   * Initializes the audio context by playing a silent audio clip.
   * Required for mobile browsers to unlock audio playback.
   * @returns {Promise<boolean>} True if initialization succeeded, false otherwise
   */
  async initialize() {
    if (this.isInitialized) return true;
    
    try {
      // Create a dummy audio element and play it to unlock audio
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      await audio.play();
      audio.pause();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  /**
   * Plays an audio file with optional fade-in, start time, and initial delay.
   * Automatically stops any currently playing audio before starting new playback.
   * Supports Bluetooth speaker wake-up with initial delay feature.
   * Includes retry logic for failed audio loads.
   * @param {string} file - Path to the audio file to play
   * @param {Object} options - Playback options
   * @param {number} [options.startTime=0] - Time in seconds to start playback from
   * @param {boolean} [options.fadeIn=false] - Whether to fade in the audio
   * @param {boolean} [options.isSequence=false] - Whether this is part of a sequence
   * @param {string} [options.audioType=null] - Type of audio: 'song', 'pregame', 'anthem', 'walkup', 'sound'
   * @param {number} [options.initialDelay=0] - Delay in seconds before starting playback (for Bluetooth wake-up)
   * @param {number} [options.retryCount=0] - Internal retry counter (do not set manually)
   * @returns {HTMLAudioElement|Object} The audio element or a proxy object if using initial delay
   */
  play(file, options = {}) {
    const { startTime = 0, fadeIn = false, isSequence = false, audioType = null, initialDelay = 0, retryCount = 0 } = options;
    
    // Store the audio type for confirmation checks
    this.currentAudioType = audioType;
    
    // Immediately stop any currently playing audio (no fade)
    if (this.activeAudio) {
      // Only call sequence stop callback if this is NOT part of a sequence
      if (this.sequenceStopCallback && !isSequence) {
        this.sequenceStopCallback();
        this.sequenceStopCallback = null;
      }
      
      // Clear any fade intervals
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      
      // Immediately stop the audio
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    
    // Helper function to start playback with retry logic
    const startPlayback = () => {
      // Create new audio element
      this.activeAudio = new Audio(file);
      this.activeAudio.currentTime = startTime;
      
      // Add error handler with retry logic (max 3 retries)
      this.activeAudio.addEventListener('error', (e) => {
        console.error(`Audio load error (attempt ${retryCount + 1}/3):`, e);
        
        if (retryCount < 2) {
          console.log(`Retrying audio load in ${(retryCount + 1) * 500}ms...`);
          setTimeout(() => {
            // Retry with incremented counter
            this.play(file, { ...options, retryCount: retryCount + 1 });
          }, (retryCount + 1) * 500); // Exponential backoff: 500ms, 1000ms
        } else {
          console.error('Audio load failed after 3 attempts');
          // Clear the failed audio
          if (this.activeAudio) {
            this.activeAudio = null;
            this.currentAudioType = null;
          }
        }
      });
      
      // Add stalled handler for network issues
      this.activeAudio.addEventListener('stalled', () => {
        console.warn('Audio playback stalled, attempting to resume...');
      });
      
      if (fadeIn) {
        this.activeAudio.volume = 0;
        this.activeAudio.play().catch(err => {
          console.error('Play failed:', err);
        });
        this.fadeIn(this.activeAudio, 1.0, 1200);
      } else {
        this.activeAudio.volume = 1.0;
        this.activeAudio.play().catch(err => {
          console.error('Play failed:', err);
        });
      }
      
      return this.activeAudio;
    };
    
    // If there's an initial delay, play silent audio first to wake up Bluetooth speakers
    if (initialDelay > 0) {
      // Create a silent audio element to wake up the Bluetooth connection
      const silentAudio = new Audio();
      silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      silentAudio.volume = 0.01; // Very low volume
      
      // Create a proxy object that will forward event handlers to the actual audio when it's ready
      const audioProxy = {
        _handlers: {},
        set onended(handler) {
          this._handlers.onended = handler;
        },
        get onended() {
          return this._handlers.onended;
        }
      };
      
      // Play silent audio immediately
      silentAudio.play().then(() => {
        // After delay, stop silent audio and play actual sound
        setTimeout(() => {
          silentAudio.pause();
          const actualAudio = startPlayback();
          // Transfer any event handlers that were set on the proxy
          if (audioProxy._handlers.onended) {
            actualAudio.onended = audioProxy._handlers.onended;
          }
        }, initialDelay * 1000);
      }).catch(() => {
        // If silent audio fails, just use regular delay
        setTimeout(() => {
          const actualAudio = startPlayback();
          if (audioProxy._handlers.onended) {
            actualAudio.onended = audioProxy._handlers.onended;
          }
        }, initialDelay * 1000);
      });
      
      return audioProxy;
    } else {
      return startPlayback();
    }
  }

  /**
   * Stops the currently playing audio with a smooth fade-out.
   * Triggers any registered sequence stop callback.
   * @param {number} [duration=500] - Fade-out duration in milliseconds
   */
  stop() {
    // Call sequence stop callback if registered
    if (this.sequenceStopCallback) {
      this.sequenceStopCallback();
      this.sequenceStopCallback = null;
    }
    
    if (this.activeAudio) {
      this.fadeOut(this.activeAudio, 500, () => {
        if (this.activeAudio) {
          this.activeAudio.pause();
          this.activeAudio.currentTime = 0;
          this.activeAudio = null;
          this.currentAudioType = null;
        }
      });
    }
  }

  /**
   * Gets the type of currently playing audio.
   * @returns {string|null} The audio type ('song', 'pregame', 'anthem', 'walkup', 'sound') or null
   */
  getCurrentAudioType() {
    return this.currentAudioType;
  }

  /**
   * Checks if the currently playing audio requires user confirmation before stopping.
   * Long-form audio types (songs, pregame, anthem) require confirmation.
   * @returns {boolean} True if confirmation is required, false otherwise
   */
  requiresStopConfirmation() {
    return ['song', 'pregame', 'anthem'].includes(this.currentAudioType);
  }

  /**
   * Registers a callback function to be called when a sequence is stopped.
   * Used to coordinate stopping multi-step audio sequences.
   * @param {Function} callback - Function to call when sequence is stopped
   */
  setSequenceStopCallback(callback) {
    this.sequenceStopCallback = callback;
  }

  /**
   * Clears the registered sequence stop callback.
   */
  clearSequenceStopCallback() {
    this.sequenceStopCallback = null;
  }

  /**
   * Gradually increases audio volume from 0 to target volume over specified duration.
   * Uses 60 steps for smooth fading.
   * @param {HTMLAudioElement} audio - The audio element to fade in
   * @param {number} targetVolume - Target volume level (0.0 to 1.0)
   * @param {number} duration - Fade duration in milliseconds
   */
  fadeIn(audio, targetVolume, duration) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const steps = 60;
    const stepDuration = duration / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;
    
    this.fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, stepDuration);
  }

  /**
   * Gradually decreases audio volume to 0 over specified duration.
   * Uses 30 steps for smooth fading.
   * @param {HTMLAudioElement} audio - The audio element to fade out
   * @param {number} duration - Fade duration in milliseconds
   * @param {Function} [callback] - Optional callback to execute when fade completes
   */
  fadeOut(audio, duration, callback) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const steps = 30;
    const stepDuration = duration / steps;
    const startVolume = audio.volume;
    const volumeDecrement = startVolume / steps;
    let currentStep = 0;
    
    this.fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - (volumeDecrement * currentStep), 0);
      
      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (callback) callback();
      }
    }, stepDuration);
  }

  /**
   * Plays looping background music at specified volume with fade-in.
   * Automatically stops any currently playing background music.
   * @param {string} file - Path to the background music file
   * @param {number} [volume=0.3] - Target volume level (0.0 to 1.0)
   * @param {number} [startTime=0] - Time in seconds to start playback from
   * @returns {HTMLAudioElement} The background audio element
   */
  playBackground(file, volume = 0.3, startTime = 0) {
    if (this.backgroundAudio) {
      this.stopBackground();
    }
    
    this.backgroundAudio = new Audio(file);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.currentTime = startTime;
    this.backgroundAudio.volume = 0;
    this.backgroundAudio.play();
    this.fadeIn(this.backgroundAudio, volume, 1000);
    
    return this.backgroundAudio;
  }

  /**
   * Reduces background music volume (ducking) to make foreground audio more prominent.
   * @param {number} [targetVolume=0.1] - Target volume level (0.0 to 1.0)
   * @param {number} [duration=500] - Fade duration in milliseconds
   */
  duckBackground(targetVolume = 0.1, duration = 500) {
    if (this.backgroundAudio) {
      this.fadeBackgroundTo(targetVolume, duration);
    }
  }

  /**
   * Restores background music volume to normal level after ducking.
   * @param {number} [targetVolume=0.3] - Target volume level (0.0 to 1.0)
   * @param {number} [duration=500] - Fade duration in milliseconds
   */
  restoreBackground(targetVolume = 0.3, duration = 500) {
    if (this.backgroundAudio) {
      this.fadeBackgroundTo(targetVolume, duration);
    }
  }

  /**
   * Fades background music to a specific volume level.
   * Used internally by duckBackground and restoreBackground.
   * @param {number} targetVolume - Target volume level (0.0 to 1.0)
   * @param {number} duration - Fade duration in milliseconds
   */
  fadeBackgroundTo(targetVolume, duration) {
    if (this.backgroundFadeInterval) {
      clearInterval(this.backgroundFadeInterval);
    }
    
    const steps = 30;
    const stepDuration = duration / steps;
    const startVolume = this.backgroundAudio.volume;
    const volumeDiff = targetVolume - startVolume;
    const volumeIncrement = volumeDiff / steps;
    let currentStep = 0;
    
    this.backgroundFadeInterval = setInterval(() => {
      currentStep++;
      this.backgroundAudio.volume = Math.max(0, Math.min(1, startVolume + (volumeIncrement * currentStep)));
      
      if (currentStep >= steps) {
        clearInterval(this.backgroundFadeInterval);
        this.backgroundFadeInterval = null;
      }
    }, stepDuration);
  }

  /**
   * Stops background music with a smooth fade-out.
   */
  stopBackground() {
    if (this.backgroundAudio) {
      this.fadeOut(this.backgroundAudio, 500, () => {
        if (this.backgroundAudio) {
          this.backgroundAudio.pause();
          this.backgroundAudio.currentTime = 0;
          this.backgroundAudio = null;
        }
      });
    }
  }

  /**
   * Checks if foreground audio is currently playing.
   * @returns {boolean} True if audio is playing, false otherwise
   */
  isPlaying() {
    return this.activeAudio !== null && !this.activeAudio.paused;
  }

  /**
   * Gets the currently active foreground audio element.
   * @returns {HTMLAudioElement|null} The active audio element or null if none is playing
   */
  getCurrentAudio() {
    return this.activeAudio;
  }
}

// Export singleton instance
export default new AudioEngine();


