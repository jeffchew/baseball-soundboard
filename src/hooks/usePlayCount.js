import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'baseball-soundboard-playcounts';

/**
 * Custom hook to manage play counts for audio files
 * Persists data in localStorage indefinitely until manually cleared
 */
export function usePlayCount() {
  const [playCounts, setPlayCounts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        return JSON.parse(stored);
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
   * Used for manual reset only.
   */
  const resetPlayCounts = useCallback(() => {
    setPlayCounts({});
    localStorage.removeItem(STORAGE_KEY);
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

