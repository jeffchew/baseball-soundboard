import { useState, useEffect } from 'react';

/**
 * Custom hook to detect device type and platform
 * @returns {Object} Device information
 * @returns {boolean} isIOS - True if device is iPhone/iPad/iPod
 * @returns {boolean} isAndroid - True if device is Android
 * @returns {boolean} isMobile - True if device is mobile (iOS or Android)
 * @returns {string} platform - 'ios', 'android', or 'desktop'
 * @returns {string} userAgent - Full user agent string
 */
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        platform: 'desktop',
        userAgent: ''
      };
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Check for Android devices
    const isAndroid = /android/i.test(userAgent);
    
    // Determine if mobile
    const isMobile = isIOS || isAndroid;
    
    // Determine platform
    let platform = 'desktop';
    if (isIOS) platform = 'ios';
    else if (isAndroid) platform = 'android';
    
    return {
      isIOS,
      isAndroid,
      isMobile,
      platform,
      userAgent
    };
  });

  useEffect(() => {
    // Re-check on mount in case of SSR or initial render issues
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    
    let platform = 'desktop';
    if (isIOS) platform = 'ios';
    else if (isAndroid) platform = 'android';
    
    setDeviceInfo({
      isIOS,
      isAndroid,
      isMobile,
      platform,
      userAgent
    });
  }, []);

  return deviceInfo;
}

/**
 * Utility function to detect device type (can be used outside of React components)
 * @returns {Object} Device information
 */
export function detectDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      platform: 'desktop',
      userAgent: ''
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;
  
  let platform = 'desktop';
  if (isIOS) platform = 'ios';
  else if (isAndroid) platform = 'android';
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    platform,
    userAgent
  };
}

