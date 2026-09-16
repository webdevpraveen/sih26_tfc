import { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { selectedTeams } from '../data/resultsData';
import ShareCardModal from '../components/ShareCardModal';
import './Results.css';

export default function Results() {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamForShare, setSelectedTeamForShare] = useState(null);

  // Gentle minimal confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      const colors = ['#10b981', '#f59e0b', '#f26522', '#2563eb', '#34d399'];

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.65, x: 0.25 },
        colors,
        ticks: 200,
        gravity: 0.75,
        scalar: 0.85,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.65, x: 0.75 },
        colors,
        ticks: 200,
        gravity: 0.75,
        scalar: 0.85,
        disableForReducedMotion: true,
      });
    }, 450);

    return () => clearTimeout(timer);
  }, []);

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

  // Real-time filtered list
  const filteredTeams = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return selectedTeams;
    return selectedTeams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(query) ||
        team.leaderName.toLowerCase().includes(query)
    );
  }, [searchTerm]);

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
              <span className="internal-round-pill official-published-pill">
                OFFICIAL RESULTS PUBLISHED
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
            OFFICIAL RESULTS DECLARED CELEBRATION CARD
            ═══════════════════════════════════════════ */}
        <section className="announcement-card-section reveal">
          <div className="announcement-card published-card">

            {/* Ambient Background Glow Effect */}
            <div className="card-ambient-glow published-glow"></div>

            {/* Top Status Bar */}
            <div className="announcement-top-bar">
              <div className="live-status-chip published-chip">
                <span className="pulsing-live-dot published-dot"></span>
                <span className="live-chip-text published-chip-text">
                  <span className="chip-text-desktop">STATUS: OFFICIAL SELECTION LIST DECLARED &bull; 100 TEAMS QUALIFIED</span>
                  <span className="chip-text-mobile">100 TEAMS OFFICIALLY SELECTED</span>
                </span>
              </div>
              <button onClick={handleShare} className="share-btn" title="Copy Official Results Link">
                {copied ? 'Link Copied' : 'Share Results'}
              </button>
            </div>

            <div className="announcement-body published-body">
              {/* Left Column: Official Trophy Emblem */}
              <div className="official-trophy-showcase">
                <div className="trophy-badge-halo">
                  <div className="trophy-emblem-circle">
                    <span className="trophy-huge-icon">🏆</span>
                    <span className="trophy-ribbon-tag">SELECTED</span>
                  </div>
                  <div className="trophy-pedestal-text">SIH 2026</div>
                </div>
              </div>

              {/* Right Column: Official Statement */}
              <div className="announcement-content">
                <div className="announcement-badge-line">
                  <span className="official-declaration-pill">
                    SELECTION DECLARATION
                  </span>
                </div>

                <h3 className="announcement-title">
                  SIH 2026 – Selected Teams
                </h3>

                <p className="announcement-desc">
                  Heartiest congratulations to all the innovators! Following thorough multi-track jury evaluations
                  and institutional committee assessments, the following <strong>100 Teams</strong> have officially
                  been selected in the <strong>Internal Round of Smart India Hackathon 2026</strong> at Shri Ramswaroop Memorial University.
                </p>

                {/* Evaluation Protocol Status Track */}
                <div className="pipeline-steps">
                  <div className="pipeline-step completed">
                    <span className="step-icon">✓</span>
                    <div className="step-info">
                      <span className="step-name">Pitch Evaluations</span>
                      <span className="step-status">100% Concluded</span>
                    </div>
                  </div>
                  <div className="pipeline-arrow">&rarr;</div>
                  <div className="pipeline-step completed">
                    <span className="step-icon">✓</span>
                    <div className="step-info">
                      <span className="step-name">Jury Verification</span>
                      <span className="step-status">Scores Certified</span>
                    </div>
                  </div>
                  <div className="pipeline-arrow">&rarr;</div>
                  <div className="pipeline-step completed final-approved">
                    <span className="step-icon">✓</span>
                    <div className="step-info">
                      <span className="step-name">Result Declaration</span>
                      <span className="step-status">Officially Published</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            OFFICIAL 100 SELECTED TEAMS DIRECTORY
            ═══════════════════════════════════════════ */}
        <section className="results-list-section reveal">
          <div className="list-section-header">
            <div className="list-title-group">
              <h3 className="list-section-title">
                List of Selected Teams in Internal Round SIH 2026
              </h3>
              <p className="list-section-subtitle">
                Listed strictly in accordance with institutional committee selection order. Use search to locate your team quickly.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="results-search-wrapper">
              <div className="search-input-box">
                <svg className="search-svg-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Team Name or Leader Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="results-search-input"
                  aria-label="Search selected teams"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Teams Table / Cards List */}
          {filteredTeams.length === 0 ? (
            <div className="empty-search-state">
              <div className="empty-search-icon-wrap">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h4>No matching teams found</h4>
              <p>We couldn't find any team or leader matching "<strong>{searchTerm}</strong>".</p>
              <button onClick={() => setSearchTerm('')} className="reset-search-btn">
                Clear Filter &amp; View All 100 Teams
              </button>
            </div>
          ) : (
            <div className="teams-ledger">
              <div className="ledger-header-row">
                <div className="col-team">Team Name</div>
                <div className="col-leader">Team Leader Name</div>
                <div className="col-status">Status</div>
              </div>

              <div className="ledger-body">
                {filteredTeams.map((team) => (
                  <div key={team.rank} className="team-ledger-row">
                    <div className="col-team">
                      <div className="team-name-text">
                        {team.teamName}
                      </div>
                      <div className="leader-mobile-sub">
                        <span className="leader-mobile-label">Leader:</span> {team.leaderName}
                      </div>
                    </div>

                    <div className="col-leader">
                      <span className="leader-name-text">{team.leaderName}</span>
                    </div>

                    <div className="col-status">
                      <span className="status-selected-pill">
                        Selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedTeamForShare(team)}
                        className="team-share-btn"
                        title="Generate & Download Selection Card"
                        aria-label={`Share card for ${team.teamName}`}
                      >
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>

      <ShareCardModal
        team={selectedTeamForShare}
        isOpen={Boolean(selectedTeamForShare)}
        onClose={() => setSelectedTeamForShare(null)}
      />
    </div>
  );
}
