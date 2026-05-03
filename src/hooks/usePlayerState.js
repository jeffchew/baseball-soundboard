import { useState, useEffect } from 'react';

const STORAGE_KEY = 'baseball-soundboard-player-states';
const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Custom hook to manage player enabled/disabled state with localStorage persistence
 * Data automatically expires after 7 days
 */
export function usePlayerState(players) {
  const [enabledPlayers, setEnabledPlayers] = useState(() => {
    // Initialize from localStorage or default to all enabled
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        const now = Date.now();
        
        // Check if data has expired (older than 7 days)
        if (now - timestamp < EXPIRY_DURATION) {
          // Data is still valid, use it
          return data;
        } else {
          // Data expired, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading player states from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Default: all players enabled
    return players.reduce((acc, player) => {
      acc[player.id] = true;
      return acc;
    }, {});
  });

  // Save to localStorage whenever enabledPlayers changes
  useEffect(() => {
    try {
      const dataToStore = {
        data: enabledPlayers,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving player states to localStorage:', error);
    }
  }, [enabledPlayers]);

  // Check for expiry on mount and set up periodic checks
  useEffect(() => {
    const checkExpiry = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { timestamp } = JSON.parse(stored);
          const now = Date.now();
          
          if (now - timestamp >= EXPIRY_DURATION) {
            // Data expired, reset to all enabled
            localStorage.removeItem(STORAGE_KEY);
            setEnabledPlayers(
              players.reduce((acc, player) => {
                acc[player.id] = true;
                return acc;
              }, {})
            );
          }
        }
      } catch (error) {
        console.error('Error checking player state expiry:', error);
      }
    };

    // Check immediately on mount
    checkExpiry();

    // Check every hour
    const interval = setInterval(checkExpiry, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [players]);

  return [enabledPlayers, setEnabledPlayers];
}

