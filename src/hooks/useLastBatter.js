import { useState, useEffect } from 'react';

const STORAGE_KEY = 'baseball-soundboard-last-batter';

/**
 * Custom hook to track the last batter (player whose walkup was played)
 * Persists to localStorage and provides a clear function
 */
export function useLastBatter() {
  const [lastBatterId, setLastBatterId] = useState(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored;
      }
    } catch (error) {
      console.error('Error loading last batter from localStorage:', error);
    }
    return null;
  });

  // Save to localStorage whenever lastBatterId changes
  useEffect(() => {
    try {
      if (lastBatterId) {
        localStorage.setItem(STORAGE_KEY, lastBatterId);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving last batter to localStorage:', error);
    }
  }, [lastBatterId]);

  /**
   * Clear the last batter tracking
   */
  const clearLastBatter = () => {
    setLastBatterId(null);
  };

  return [lastBatterId, setLastBatterId, clearLastBatter];
}

// Made with Bob
