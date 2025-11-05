import { useState, useEffect } from 'react';

interface AutoResetIndicatorProps {
  isActive: boolean;
  resetTimeoutMs: number;
  onReset: () => void;
}

export function AutoResetIndicator({ isActive, resetTimeoutMs, onReset }: AutoResetIndicatorProps) {
  const [timeLeft, setTimeLeft] = useState(resetTimeoutMs);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleContinue = () => {
    setTimeLeft(resetTimeoutMs);
    setIsVisible(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      setIsPaused(false);
      return;
    }

    setTimeLeft(resetTimeoutMs);
    
    const interval = setInterval(() => {
      if (isPaused) return; // Don't count down when paused
      
      setTimeLeft((prev) => {
        const newTime = prev - 1000;
        
        // Show indicator when 10 seconds or less remaining and pause the timer
        if (newTime <= 10000 && newTime > 0) {
          setIsVisible(true);
          setIsPaused(true);
          return newTime; // Keep the current time, don't continue countdown
        }
        
        if (newTime <= 0) {
          onReset();
          return resetTimeoutMs;
        }
        
        return newTime;
      });
    }, 1000);

    // Reset timer on user activity (only when not paused)
    const handleUserActivity = () => {
      if (!isPaused) {
        setTimeLeft(resetTimeoutMs);
        setIsVisible(false);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isActive, resetTimeoutMs, onReset, isPaused]);

  if (!isActive) {
    return null;
  }

  const secondsLeft = Math.ceil(timeLeft / 1000);

  if (!isVisible) {
    // Show small timer indicator in corner
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">
              {secondsLeft}s
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show full modal when warning
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-6xl">⏰</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Still here?</h2>
          <p className="text-gray-600 mb-4">
            Session was about to reset in {secondsLeft} seconds
          </p>
          <p className="text-sm text-gray-500">
            Click continue to keep using the app
          </p>
        </div>
        
        <button
          onClick={handleContinue}
          className="bg-gradient-to-br from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-8 px-16 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Continue Session
        </button>
      </div>
    </div>
  );
}