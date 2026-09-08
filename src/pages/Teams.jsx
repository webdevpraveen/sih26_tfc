import { useState, useEffect } from 'react';
import { fetchTeamsFromSheet } from '../services/sheetService';
import './Teams.css';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teams from Google Sheet
  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      const data = await fetchTeamsFromSheet();
      setTeams(data);
      setLoading(false);
    };
    loadTeams();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [teams]);



  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page page-enter">
      <div className="container">
        <div className="teams-header">
          <h1 className="section-title">Our Innovators</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            The brilliant minds who participated in the SIH 2026 Internal Hackathon at SRMU
          </p>
          {!loading && teams.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1', textShadow: '0 0 30px #f2652266' }}>
                {teams.length}
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '3px', marginTop: '0.5rem', fontWeight: '600' }}>
                Total Teams Registered
              </div>
            </div>
          )}
        </div>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="teams-grid">
            {teams.map((team, i) => {
              const members = [
                team["Member 1 (Leader)"],
                team["Member 2"],
                team["Member 3"],
                team["Member 4"],
                team["Member 5"],
                team["Member 6"]
              ].filter(Boolean); // Filter out empty/undefined

              const isVerified = team["Verified"] === true || team["Verified"] === "TRUE" || team["Verified"] === "true";

              return (
                <div
                  key={i}
                  className={`team-card reveal ${isVerified ? 'verified-card' : 'unverified-card'}`}
                  style={{ transitionDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                >
                  <div className="team-card-header">
                    <h3 className="team-name">{team["Team Name"]}</h3>
                    {isVerified ? (
                      <span className="verification-badge badge-verified">✅ Verified</span>
                    ) : (
                      <span className="verification-badge badge-unverified">⏳ Unverified</span>
                    )}
                  </div>

                  {!isVerified && (
                    <div className="unverified-note">
                      <strong>Verification Pending:</strong> Your documents are currently under review by the documentation team.
                    </div>
                  )}

                  {members.length > 0 && (
                    <div className="team-members-section">
                      <div className="team-members-title">
                        Members ({members.length})
                      </div>
                      <div className="team-members-list">
                        {members.map((member, j) => (
                          <span
                            key={j}
                            className={`team-member${j === 0 ? ' leader' : ''}`}
                          >
                            {member} {j === 0 && ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">
              No teams registered yet. Stay tuned!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
