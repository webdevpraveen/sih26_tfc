import { useEffect, useState } from 'react';
import './Results.css';

export default function Results() {
  const [copied, setCopied] = useState(false);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalTeams = 50;

  const renderSkeletonRow = (index) => {
    const rank = index + 1;
    const isTop = rank <= 45;
    const rowClass = isTop ? 'skeleton-row top-team' : 'skeleton-row wait-team';

    return (
      <div
        key={index}
        className={`${rowClass} reveal`}
        style={{ transitionDelay: `${Math.min(index * 0.015, 0.4)}s` }}
      >
        <div className="row-rank-box">
          <span className="rank-number">{rank < 10 ? `0${rank}` : rank}</span>
        </div>

        <div className="row-content">
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-text"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="results-page page-enter">
      <div className="container results-container">

        {/* ═══════════════════════════════════════════
            OFFICIAL INSTITUTIONAL HEADER
            ═══════════════════════════════════════════ */}
        <header className="official-results-header reveal">
          {/* Institutional Badges & Logos Row */}
          <div className="official-branding-row">
            <div className="header-logo-card sih-card">
              <img src="/sih-logos/sih.png" alt="Smart India Hackathon Logo" className="official-logo-img sih-brand-logo" />
            </div>
            <div className="header-badge-center">
              <span className="gov-initiative-tag">
                <span className="shield-icon">🏛️</span>
                <span className="gov-text-full">MINISTRY OF EDUCATION &amp; AICTE INITIATIVE</span>
                <span className="gov-text-mobile">MoE &amp; AICTE INITIATIVE</span>
              </span>
              <span className="internal-round-pill">
                OFFICIAL INTERNAL SCREENING ROUND
              </span>
            </div>
            <div className="header-logo-card srmu-card">
              <img src="/logos/srmu-crest.png" alt="SRMU Official Emblem" className="official-logo-img srmu-brand-logo" />
            </div>
          </div>

          {/* Main Titles */}
          <div className="header-title-block">
            <h1 className="main-official-title">
              Internal Round — Smart India Hackathon
            </h1>
            <h2 className="university-official-title">
              Shri Ramswaroop Memorial University
            </h2>
            <p className="official-location-tag">
              Lucknow - Deva Road, Uttar Pradesh &bull; Institution Screening Committee
            </p>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            WAIT FOR RESULT ANNOUNCEMENT — SAND CLOCK SHOWCASE
            ═══════════════════════════════════════════ */}
        <section className="announcement-card-section reveal">
          <div className="announcement-card">

            {/* Ambient Background Glow Effect */}
            <div className="card-ambient-glow"></div>

            {/* Top Status Bar on Announcement Card */}
            <div className="announcement-top-bar">
              <div className="live-status-chip">
                <span className="pulsing-live-dot"></span>
                <span className="live-chip-text">
                  <span className="chip-text-desktop">STATUS: EVALUATION CONCLUDED &bull; COMPILATION IN PROGRESS</span>
                  <span className="chip-text-mobile">EVALUATION CONCLUDED &bull; COMPILING</span>
                </span>
              </div>
              <button onClick={handleShare} className="share-btn" title="Copy Official Results Link">
                {copied ? '✓ Link Copied' : '🔗 Share'}
              </button>
            </div>

            <div className="announcement-body">
              {/* Left Column: Animated Sand Clock (Hourglass) */}
              <div className="hourglass-showcase">
                <div className="hourglass-pedestal">
                  <div className="hourglass-wrapper">
                    {/* SVG Hourglass */}
                    <svg
                      viewBox="0 0 120 160"
                      className="hourglass-svg"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Sand Gradient */}
                        <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="35%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>

                        {/* Metallic Gold Trim Gradient */}
                        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#b45309" />
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>

                        {/* Dark Frame Gradient */}
                        <linearGradient id="darkFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#334155" />
                          <stop offset="50%" stopColor="#1e293b" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>

                        {/* Glass Reflection Gradient */}
                        <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                          <stop offset="30%" stopColor="rgba(255,255,255,0.25)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>

                        {/* Top Bulb Mask */}
                        <clipPath id="topBulbClip">
                          <path d="M 32 25 C 32 52, 54 68, 58 78 L 62 78 C 66 68, 88 52, 88 25 Z" />
                        </clipPath>

                        {/* Bottom Bulb Mask */}
                        <clipPath id="bottomBulbClip">
                          <path d="M 58 82 C 54 92, 32 108, 32 135 L 88 135 C 88 108, 66 92, 62 82 Z" />
                        </clipPath>
                      </defs>

                      {/* Ambient Halo behind hourglass */}
                      <ellipse cx="60" cy="80" rx="46" ry="56" fill="rgba(245, 158, 11, 0.18)" className="hourglass-inner-glow" />

                      {/* Top Wood/Gold Plate */}
                      <rect x="22" y="14" width="76" height="8" rx="4" fill="url(#goldTrim)" />
                      <rect x="28" y="20" width="64" height="4" rx="2" fill="url(#darkFrame)" />

                      {/* Side Support Pillars */}
                      <rect x="25" y="22" width="4.5" height="116" rx="2" fill="url(#darkFrame)" stroke="#475569" strokeWidth="0.5" />
                      <rect x="90.5" y="22" width="4.5" height="116" rx="2" fill="url(#darkFrame)" stroke="#475569" strokeWidth="0.5" />

                      {/* Center Pillar Knobs */}
                      <rect x="23.5" y="76" width="7.5" height="7" rx="2" fill="url(#goldTrim)" />
                      <rect x="89" y="76" width="7.5" height="7" rx="2" fill="url(#goldTrim)" />

                      {/* Glass Body Contour with Strong Contrast */}
                      <path
                        d="M 32 24 C 32 52, 56 70, 58 80 C 56 90, 32 108, 32 136 L 88 136 C 88 108, 64 90, 62 80 C 64 70, 88 52, 88 24 Z"
                        fill="rgba(241, 245, 249, 0.45)"
                        stroke="#64748b"
                        strokeWidth="2.8"
                      />

                      {/* ── TOP BULB SAND ── */}
                      <g clipPath="url(#topBulbClip)">
                        <rect
                          x="30"
                          y="24"
                          width="60"
                          height="56"
                          fill="url(#sandGradient)"
                          className="sand-top-drain"
                        />
                        <ellipse cx="60" cy="27" rx="26" ry="5" fill="#fde68a" className="sand-top-lip" />
                      </g>

                      {/* ── SAND STREAM (CONTINUOUS FLOW) ── */}
                      <line
                        x1="60"
                        y1="78"
                        x2="60"
                        y2="132"
                        stroke="url(#sandGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="sand-stream-flow"
                      />

                      {/* Micro Particles falling */}
                      <circle cx="60" cy="85" r="1.8" fill="#fef08a" className="sand-particle p-1" />
                      <circle cx="60.5" cy="100" r="2.2" fill="#f59e0b" className="sand-particle p-2" />
                      <circle cx="59.5" cy="115" r="1.8" fill="#d97706" className="sand-particle p-3" />

                      {/* ── BOTTOM BULB SAND MOUND ── */}
                      <g clipPath="url(#bottomBulbClip)">
                        <path
                          d="M 26 136 Q 60 96 94 136 Z"
                          fill="url(#sandGradient)"
                          className="sand-bottom-heap"
                        />
                      </g>

                      {/* Dynamic Micro Splashes */}
                      <circle cx="55" cy="128" r="1.5" fill="#fde68a" className="sand-splash-dot s-1" />
                      <circle cx="65" cy="129" r="1.4" fill="#fbbf24" className="sand-splash-dot s-2" />

                      {/* Glass Curved Reflections & Highlights */}
                      <path
                        d="M 36 28 C 36 50, 52 64, 55 74"
                        stroke="url(#glassReflection)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M 36 130 C 36 112, 52 96, 55 86"
                        stroke="url(#glassReflection)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Bottom Wood/Gold Plate */}
                      <rect x="28" y="136" width="64" height="4" rx="2" fill="url(#darkFrame)" />
                      <rect x="22" y="138" width="76" height="8" rx="4" fill="url(#goldTrim)" />
                    </svg>

                    {/* Orbiting Ring */}
                    <div className="hourglass-orbit"></div>
                  </div>
                  <div className="hourglass-shadow"></div>
                </div>
              </div>

              {/* Right Column: Announcement Message & Official Protocol */}
              <div className="announcement-content">
                <div className="announcement-badge-line">
                  <span className="official-hourglass-pill">
                    ⏳ OFFICIAL SELECTION PROTOCOL
                  </span>
                </div>

                <h3 className="announcement-title">
                  Wait for Result Announcement
                </h3>

                <p className="announcement-desc">
                  The technical jury across all domain presentation tracks has formally concluded evaluations for the
                  <strong> SIH 2026 Internal Round</strong>. The consolidated evaluation ledger for the <strong>50 Nominated Teams</strong> is
                  currently undergoing final institutional administrative sign-off.
                </p>

                {/* Evaluation Pipeline Progress Track */}
                <div className="pipeline-steps">
                  <div className="pipeline-step completed">
                    <span className="step-icon">✓</span>
                    <div className="step-info">
                      <span className="step-name">Pitch Evaluations</span>
                      <span className="step-status">100% Completed</span>
                    </div>
                  </div>
                  <div className="pipeline-arrow">&rarr;</div>
                  <div className="pipeline-step completed">
                    <span className="step-icon">✓</span>
                    <div className="step-info">
                      <span className="step-name">Score Normalization</span>
                      <span className="step-status">Verified by Jury</span>
                    </div>
                  </div>
                  <div className="pipeline-arrow">&rarr;</div>
                  <div className="pipeline-step active">
                    <span className="step-icon step-pulse">⏳</span>
                    <div className="step-info">
                      <span className="step-name">Institutional Sign-off</span>
                      <span className="step-status">In Final Stages</span>
                    </div>
                  </div>
                </div>

                {/* Meta Highlights Row (Centered) */}
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <span className="highlight-number text-green">45</span>
                    <span className="highlight-label">Shortlisted Teams</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-number text-yellow">05</span>
                    <span className="highlight-label">Waitlisted Teams</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PROVISIONAL STANDINGS (50 SKELETON TEAMS LIST)
            ═══════════════════════════════════════════ */}
        <section className="results-list-section reveal">
          <div className="list-section-header">
            <div className="list-title-group">
              <h3 className="list-section-title">
                Qualifiers - SIH 2026 Internal Round
              </h3>
            </div>
          </div>

          <div className="results-list">
            {Array.from({ length: totalTeams }).map((_, i) => renderSkeletonRow(i))}
          </div>
        </section>

      </div>
    </div>
  );
}
