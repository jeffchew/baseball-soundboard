import { useState, useEffect } from 'react';

const STORAGE_KEY = 'baseball-soundboard-player-order';

/**
 * Custom hook to manage player order with localStorage persistence
 * Order persists until localStorage is manually cleared
 */
export function usePlayerOrder(players) {
  const [playerOrder, setPlayerOrder] = useState(() => {
    // Initialize from localStorage or default to original order
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const savedOrder = JSON.parse(stored);
        // Validate that saved order contains all current player IDs
        const currentIds = players.map(p => p.id);
        const savedIds = savedOrder.map(p => p.id);
        
        // If all IDs match, use saved order
        if (currentIds.length === savedIds.length && 
            currentIds.every(id => savedIds.includes(id))) {
          return savedOrder;
        }
      }
    } catch (error) {
      console.error('Error loading player order from localStorage:', error);
    }
    
    // Default: original order from config
    return [...players];
  });

  // Save to localStorage whenever playerOrder changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerOrder));
    } catch (error) {
      console.error('Error saving player order to localStorage:', error);
    }
  }, [playerOrder]);

  return [playerOrder, setPlayerOrder];
}

// Made with Bob
