import { useState, useEffect } from 'react';

/**
 * Hook providing live updating current date/time object every second
 */
export function useLiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
}
