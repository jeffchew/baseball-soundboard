import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'baseball-soundboard-playcounts';
const TIMESTAMP_KEY = 'baseball-soundboard-playcounts-timestamp';
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Custom hook to manage play counts for audio files
 * Persists data in localStorage and auto-clears after 24 hours
 */
export function usePlayCount() {
  const [playCounts, setPlayCounts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const timestamp = localStorage.getItem(TIMESTAMP_KEY);
      
      // Check if data exists and is less than 24 hours old
      if (stored && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < ONE_DAY_MS) {
          return JSON.parse(stored);
        } else {
          // Data is older than 24 hours, clear it
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TIMESTAMP_KEY);
        }
      }
      
      return {};
    } catch (error) {
      console.error('Failed to load play counts:', error);
      return {};
    }
  });

  // Save to localStorage whenever playCounts changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playCounts));
      // Update timestamp whenever we save
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to save play counts:', error);
    }
  }, [playCounts]);

  /**
   * Increments the play count for a specific audio file.
   * @param {string} fileId - The unique identifier of the audio file
   */
  const incrementPlayCount = useCallback((fileId) => {
    setPlayCounts(prev => ({
      ...prev,
      [fileId]: (prev[fileId] || 0) + 1
    }));
  }, []);

  /**
   * Gets the current play count for a specific audio file.
   * @param {string} fileId - The unique identifier of the audio file
   * @returns {number} The number of times the file has been played (0 if never played)
   */
  const getPlayCount = useCallback((fileId) => {
    return playCounts[fileId] || 0;
  }, [playCounts]);

  /**
   * Resets all play counts to zero and clears localStorage.
   * Used to start fresh tracking after 24 hours or manual reset.
   */
  const resetPlayCounts = useCallback(() => {
    setPlayCounts({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  }, []);

  /**
   * Resets the play count for a specific audio file to zero.
   * @param {string} fileId - The unique identifier of the audio file
   */
  const resetPlayCount = useCallback((fileId) => {
    setPlayCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[fileId];
      return newCounts;
    });
  }, []);

  return {
    playCounts,
    incrementPlayCount,
    getPlayCount,
    resetPlayCounts,
    resetPlayCount
  };
}

