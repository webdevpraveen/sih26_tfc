import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { defaultTimeline } from '../data/themes';
import RegistrationModal from '../components/RegistrationModal';
import './Timeline.css';

const Countdown = ({ targetDate }) => {
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

  if (timeLeft.expired) return <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'red', fontWeight: 'bold' }}>Registration Closed</div>;

  return (
    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'var(--sih-orange-dark)', fontWeight: 'bold', background: 'var(--sih-orange)', color: 'white', padding: '4px 10px', borderRadius: '15px', alignItems: 'center', width: 'fit-content' }}>
      ⏳ Ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default function Timeline() {
  const { data: firestoreTimeline, loading } = useFirestore('timeline');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const timeline = firestoreTimeline.length > 0
    ? firestoreTimeline.sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultTimeline;

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [timeline]);

  return (
    <div className="timeline-page page-enter">
      <div className="container">
        <div className="timeline-header">
          <h1 className="section-title">SIH'26 Timeline</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Important dates and milestones for the Internal SIH Hackathon
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {timeline.map((event, i) => (
            <div
              key={event.id || i}
              className="timeline-item reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-item-content">
                <div className="timeline-date">{event.date}</div>
                <h3 className="timeline-event-title">{event.title}</h3>
                <p className="timeline-event-desc">{event.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <span className={`timeline-status-badge status-${event.status || 'upcoming'}`}>
                      <span style={{ 
                        width: 6, height: 6, borderRadius: '50%', 
                        background: 'currentColor', display: 'inline-block' 
                      }}></span>
                      {event.status || 'Upcoming'}
                    </span>
                    {event.link && (
                      <button 
                        onClick={() => setIsRegistrationModalOpen(true)} 
                        className="timeline-action-link"
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Register Now →
                      </button>
                    )}
                    {event.title && event.title.includes('Internal Hackathon') && (
                      <Link 
                        to="/slots" 
                        className="timeline-action-link"
                        style={{ border: 'none', textDecoration: 'none', fontWeight: 'bold' }}
                      >
                        View Slots →
                      </Link>
                    )}
                  </div>
                  {event.title === 'Internal Team Registration' && (
                    <Countdown targetDate="2026-09-04T23:59:59" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
        registrationLink="https://forms.gle/ZbCWyiSGveuNrS7m9/" 
      />
    </div>
  );
}
