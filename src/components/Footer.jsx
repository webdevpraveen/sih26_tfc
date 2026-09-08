import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="footer-brand-logos">
                <img src="/sih-logos/leftbanner.png" alt="SRMU SIH 2026" className="footer-left-banner" />
              </div>
              <p className="footer-brand-text">
                Empowering students to solve the most pressing challenges
                of our time through innovation, collaboration, and technology.
                Organized by Tech Fusion Club, SRMU.
              </p>
              <div className="footer-partner-logos">
                <img src="/sih-logos/rightbanner.png" alt="Ministry of Education & SIH Partners" className="footer-right-banner" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-link-list">
                <Link to="/" className="footer-link">→ Home</Link>
                <Link to="/results" className="footer-link">→ Results</Link>
                <a href="https://docs.google.com/presentation/d/1zfTdID53p_wxCmviVm_itbp7XmPOmuu1/" target="_blank" rel="noopener noreferrer" className="footer-link">→ PPT Format Template</a>
                <Link to="/timeline" className="footer-link">→ Timeline</Link>
                <Link to="/teams" className="footer-link">→ Our Innovators (Teams)</Link>
                <Link to="/notices" className="footer-link">→ Notices & Alerts</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="footer-heading">Contact Us</h3>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <div>
                  Shri Ramswaroop Memorial University,<br />
                  Lucknow-Deva Road, Barabanki,<br />
                  Uttar Pradesh - 225003
                </div>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">🏫</span>
                <div>
                  <div className="footer-contact-label">Organized By</div>
                  Tech Fusion Club, SRMU
                </div>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📧</span>
                <div>
                  <div className="footer-contact-label">Email</div>
                  techfusionclub@srmu.ac.in
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2026 Smart India Hackathon '26 — <span className="footer-brand-highlight">Tech Fusion Club</span>. All rights reserved.
            </p>
            <p className="footer-developer">
              Designed and Developed by <a href="https://praveenksingh.vercel.app" target="_blank" rel="noopener noreferrer"><strong>PraveenSingh</strong></a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
