import { useEffect, useRef } from 'react';

interface UseAutoResetProps {
  resetTimeoutMs?: number;
  onReset: () => void;
  isActive?: boolean;
}

export function useAutoReset({ 
  resetTimeoutMs = 30000, // 30 seconds default
  onReset, 
  isActive = true 
}: UseAutoResetProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isActive) {
      timeoutRef.current = setTimeout(() => {
        onReset();
      }, resetTimeoutMs);
    }
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      resetTimer();
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isActive, resetTimeoutMs]);

  // Reset timer on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (isActive) {
        resetTimer();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearTimer();
    };
  }, [isActive, resetTimeoutMs]);

  return {
    resetTimer,
    clearTimer
  };
}