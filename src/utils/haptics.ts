// Haptic feedback utility for mobile devices

// Get haptics enabled state from localStorage
const getHapticsEnabled = (): boolean => {
  const stored = localStorage.getItem('hapticsEnabled');
  return stored === null ? true : stored === 'true'; // Default to enabled
};

// Set haptics enabled state in localStorage
export const setHapticsEnabled = (enabled: boolean): void => {
  localStorage.setItem('hapticsEnabled', String(enabled));
};

export const haptics = {
  // Light tap feedback
  light: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate(10);
    }
  },
  
  // Medium tap feedback
  medium: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate(20);
    }
  },
  
  // Strong tap feedback
  heavy: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate(30);
    }
  },
  
  // Success pattern
  success: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  
  // Error pattern
  error: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate([30, 50, 30]);
    }
  },
  
  // Selection feedback (for toggles, switches)
  selection: () => {
    if ('vibrate' in navigator && getHapticsEnabled()) {
      navigator.vibrate(15);
    }
  }
};