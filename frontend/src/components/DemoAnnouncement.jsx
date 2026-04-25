import { useState, useEffect } from 'react';
import './DemoAnnouncement.css';

export const DemoAnnouncement = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="demo-announcement">
      <div className="demo-content">
        <span className="demo-icon">🔔</span>
        <div className="demo-text">
          <strong>Demo Mode:</strong> Your session will expire in <span className="time">{timeDisplay}</span>
        </div>
      </div>
    </div>
  );
};
