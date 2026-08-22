import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sihThemes, defaultTimeline } from '../data/themes';
import { useFirestore } from '../hooks/useFirestore';
import RegistrationModal from '../components/RegistrationModal';
import './Home.css';

export default function Home() {
  const sectionRefs = useRef([]);
  const { data: notices } = useFirestore('notices');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Generate particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${4 + Math.random() * 4}s`,
    opacity: 0.1 + Math.random() * 0.3,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="page-enter">
      {/* ══════ Hero Section ══════ */}
      <section className="hero" id="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Internal Hackathon 2026
            </div>

            <h1 className="hero-title">
              Turn Ideas Into <span className="hero-title-highlight">Impact</span>
            </h1>
            
            <p className="hero-description">
              Join the brightest minds at SRMU to build, solve, and innovate. 
              Tackle real-world problems through technology, collaboration, and creative thinking.
            </p>

            <div className="hero-actions">
              <button onClick={() => setIsRegistrationModalOpen(true)} className="hero-register-btn" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}>
                Register
              </button>
              <a href="https://sih.gov.in/sih2026PS" target="_blank" rel="noopener noreferrer" className="hero-explore-btn">
                Explore Problems
              </a>
            </div>

            <div className="hero-club-tag">
              <span>Organized by </span>
              <strong>Tech Fusion Club, SRMU</strong>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-wrapper">
              {/* Abstract Lightbulb / Circuit SVG */}
              <img src="/sih-logos/sih.png" alt="SIH 2026" className="hero-image" style={{ width: '100%', maxWidth: '400px', height: 'auto', display: 'block', margin: '0 auto' }} />
              <div className="floating-tfc-logo">
                <img src="/sih-logos/tfclogo.png" alt="Tech Fusion Club" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ Notice Ticker ══════ */}
      {notices && notices.length > 0 && (
        <div className="notice-ticker">
          <div className="notice-ticker-label">📢 LATEST</div>
          <div className="notice-ticker-content">
            {notices.slice(0, 5).map((notice, i) => (
              <div key={notice.id || i} className="notice-ticker-item">
                <strong>{notice.title}</strong> — {notice.description?.substring(0, 80)}
                {notice.description?.length > 80 ? '...' : ''}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {notices.slice(0, 5).map((notice, i) => (
              <div key={`dup-${i}`} className="notice-ticker-item">
                <strong>{notice.title}</strong> — {notice.description?.substring(0, 80)}
                {notice.description?.length > 80 ? '...' : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ About Section ══════ */}
      <section className="about-section section" id="about">
        <div className="about-bg"></div>
        <div className="about-pixel-art">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pixel-block" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
        <div className="container about-content">
          <h2 className="about-title reveal">ABOUT SIH 2026</h2>
          <div className="about-text reveal reveal-delay-1">
            <p>
              Smart India Hackathon (SIH) is a premier nationwide initiative designed to engage 
              students in solving some of the most pressing challenges faced in everyday life. 
              Launched to foster a culture of innovation and practical problem-solving, SIH provides 
              a dynamic platform for students to develop and showcase their creative solutions to 
              real-world problems.
            </p>
            <p>
              Since its inception, SIH has garnered significant success in promoting out-of-the-box 
              thinking among young minds, particularly engineering students from across India. 
              Each edition has built on the previous one, refining its approach and expanding its impact. 
              The hackathon not only offers students an opportunity to showcase their skills but also 
              encourages collaboration with industry experts, government agencies, and other stakeholders.
            </p>
          </div>
          <div className="about-stats reveal reveal-delay-2">
            <div className="about-stat">
              <div className="about-stat-number">17+</div>
              <div className="about-stat-label">Themes</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">634+</div>
              <div className="about-stat-label">Problem Statements</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">36</div>
              <div className="about-stat-label">Hours Hackathon</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">₹1L+</div>
              <div className="about-stat-label">Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ Themes Section ══════ */}
      <section className="themes-section section" id="themes">
        <div className="themes-bg-skyline"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header reveal" style={{ textAlign: 'center' }}>
            <h2 className="section-title" style={{ color: 'var(--sih-orange)', textTransform: 'uppercase' }}>Themes</h2>
            <p className="section-subtitle" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              No problem is too big... No idea is too small
            </p>
          </div>
          <div className="themes-carousel-container">
            <button className="theme-scroll-btn left" onClick={() => {
              document.querySelector('.themes-carousel').scrollBy({ left: -350, behavior: 'smooth' });
            }}>
              &larr;
            </button>
            <div className="themes-carousel">
              {sihThemes.map((theme, i) => (
                <div
                  key={theme.id}
                  className="theme-card reveal"
                  style={{ transitionDelay: `${Math.min(i * 0.05, 0.5)}s` }}
                >
                  <div className="theme-card-icon-wrapper">
                    <span className="theme-card-icon">{theme.icon}</span>
                  </div>
                  <h3 className="theme-card-title">{theme.title}</h3>
                  <p className="theme-card-desc">{theme.description}</p>
                </div>
              ))}
            </div>
            <button className="theme-scroll-btn right" onClick={() => {
              document.querySelector('.themes-carousel').scrollBy({ left: 350, behavior: 'smooth' });
            }}>
              &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ══════ Timeline Preview ══════ */}
      <section className="timeline-preview section" id="timeline-preview">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Event Timeline</h2>
            <p className="section-subtitle">
              Key milestones from registration to the Grand Finale
            </p>
          </div>
          <div className="timeline-preview-track reveal reveal-delay-1">
            {defaultTimeline.map((event, i) => (
              <div key={i} className="timeline-preview-item">
                <div className="timeline-preview-dot"></div>
                <div className="timeline-preview-date">{event.date}</div>
                <div className="timeline-preview-title">{event.title}</div>
              </div>
            ))}
          </div>
          <div className="timeline-preview-cta reveal reveal-delay-2">
            <Link to="/timeline" className="btn btn-secondary">
              View Full Timeline →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ Contact Section ══════ */}
      <section className="contact-section section" id="contact">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Contact & Coordinators</h2>
            <p className="section-subtitle">
              Get in touch with the organizers for any queries
            </p>
          </div>
          <div className="contact-grid">
            <div className="contact-card reveal reveal-delay-1">
              <div className="contact-card-icon">🏫</div>
              <div className="contact-card-label">Faculty Coordinators</div>
              <div className="contact-card-value" style={{ fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left', display: 'inline-block' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Er. Abhishek Kumar Saxena</strong><br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Incharge Technical & Social Media Society</span>
                </div>
                <div>
                  <strong>Er. Sunny Kumar</strong><br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>SPoC SIH 2026</span>
                </div>
              </div>
            </div>
            
            <div className="contact-card reveal reveal-delay-2">
              <div className="contact-card-icon">👨‍💻</div>
              <div className="contact-card-label">For More Details Contact</div>
              <div className="contact-card-sub" style={{ marginBottom: '12px', color: 'var(--sih-orange)', fontWeight: '600' }}>
                Joint Secretaries
              </div>
              <div className="contact-card-value" style={{ fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left', display: 'inline-block' }}>
                <div style={{ marginBottom: '8px' }}><strong>Kushagra Dev Upadhyay</strong><br/>📞 6393745098</div>
                <div style={{ marginBottom: '8px' }}><strong>Prateek Singh</strong><br/>📞 8924046121</div>
                <div><strong>Jahnvi Pandey</strong><br/>📞 7523800560</div>
              </div>
            </div>
            
            <div className="contact-card reveal reveal-delay-3">
              <div className="contact-card-icon">📍</div>
              <div className="contact-card-label">Contact & Venue</div>
              <div className="contact-card-value" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                <a href="mailto:techfusionclub@srmu.ac.in" style={{ color: 'inherit', textDecoration: 'none' }}>
                  techfusionclub@srmu.ac.in
                </a>
              </div>
              <div className="contact-card-sub">
                SRMU Campus<br/>
                Lucknow-Deva Road, Barabanki, UP
              </div>
            </div>
          </div>
        </div>
      </section>

      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
        registrationLink="https://forms.gle/ZbCWyiSGveuNrS7m9/" 
      />
    </div>
  );
}
