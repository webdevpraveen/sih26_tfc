import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { defaultTimeline } from '../data/themes';
import RegistrationModal from '../components/RegistrationModal';
import './Timeline.css';

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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
        onProceed={() => window.open('https://forms.gle/ZbCWyiSGveuNrS7m9/', '_blank')} 
      />
    </div>
  );
}
