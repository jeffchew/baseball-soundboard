// Singleton Audio Engine with fade controls
class AudioEngine {
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
    
    AudioEngine.instance = this;
  }

  // Initialize audio context (required for mobile browsers)
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

  // Play audio with optional fade-in and start time
  play(file, options = {}) {
    const { startTime = 0, fadeIn = false, isSequence = false } = options;
    
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
    
    // Create new audio element
    this.activeAudio = new Audio(file);
    this.activeAudio.currentTime = startTime;
    
    if (fadeIn) {
      this.activeAudio.volume = 0;
      this.activeAudio.play();
      this.fadeIn(this.activeAudio, 1.0, 1200);
    } else {
      this.activeAudio.volume = 1.0;
      this.activeAudio.play();
    }
    
    return this.activeAudio;
  }

  // Smooth stop with fade-out
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
        }
      });
    }
  }

  // Register a callback to stop sequences
  setSequenceStopCallback(callback) {
    this.sequenceStopCallback = callback;
  }

  // Clear sequence stop callback
  clearSequenceStopCallback() {
    this.sequenceStopCallback = null;
  }

  // Fade in audio over specified duration
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

  // Fade out audio over specified duration
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

  // Play background music at specified volume
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

  // Duck background music (reduce volume)
  duckBackground(targetVolume = 0.1, duration = 500) {
    if (this.backgroundAudio) {
      this.fadeBackgroundTo(targetVolume, duration);
    }
  }

  // Restore background music volume
  restoreBackground(targetVolume = 0.3, duration = 500) {
    if (this.backgroundAudio) {
      this.fadeBackgroundTo(targetVolume, duration);
    }
  }

  // Fade background to specific volume
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

  // Stop background music
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

  // Check if audio is currently playing
  isPlaying() {
    return this.activeAudio !== null && !this.activeAudio.paused;
  }

  // Get current audio element
  getCurrentAudio() {
    return this.activeAudio;
  }
}

// Export singleton instance
export default new AudioEngine();


