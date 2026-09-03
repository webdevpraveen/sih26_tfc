import { useState, useEffect } from 'react';

export default function Countdown({ targetDate, style }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          expired: false
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold', ...style }}>Registration Closed</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 'bold', background: 'var(--sih-orange)', color: 'white', padding: '6px 12px', borderRadius: '20px', alignItems: 'center', width: 'fit-content', boxShadow: '0 4px 12px rgba(242, 101, 34, 0.3)', ...style }}>
      Ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
}
