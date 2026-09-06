import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: 'https://sih.gov.in/sih2026PS', label: 'Problem Statements', external: true },
    { to: '/timeline', label: 'Timeline' },
    { to: '/teams', label: 'Teams' },
    { to: '/slots', label: 'Slots' },
    { to: '/notices', label: 'Notices' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left Logos */}
        <div className="navbar-logos">
          <NavLink to="/">
            <img src="/sih-logos/leftbanner.png" alt="SRMU SIH 2026" className="navbar-left-banner" />
          </NavLink>
        </div>

        {/* Nav Links */}
        <div className={`navbar-links${mobileOpen ? ' open' : ''}`}>
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Right Side Logos */}
        <div className="navbar-right-logos">
          <img src="/sih-logos/rightbanner.png" alt="Ministry of Education & SIH Partners" className="navbar-right-banner" />
        </div>

        {/* Hamburger */}
        <button
          className={`navbar-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  );
}
