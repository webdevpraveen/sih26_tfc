import { useState, useMemo, useEffect } from 'react';
import { fetchTeamsFromSheet } from '../services/sheetService';
import './Teams.css';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = useMemo(() => {
    if (!search) return teams;
    const s = search.toLowerCase();
    return teams.filter((t) => {
      const teamName = String(t["Team Name"] || "").toLowerCase();
      const member1 = String(t["Member 1 (Leader)"] || "").toLowerCase();
      const member2 = String(t["Member 2"] || "").toLowerCase();
      const member3 = String(t["Member 3"] || "").toLowerCase();
      const member4 = String(t["Member 4"] || "").toLowerCase();
      const member5 = String(t["Member 5"] || "").toLowerCase();
      const member6 = String(t["Member 6"] || "").toLowerCase();
      const psId = String(t["PS ID"] || "").toLowerCase();
      
      return (
        teamName.includes(s) ||
        member1.includes(s) ||
        member2.includes(s) ||
        member3.includes(s) ||
        member4.includes(s) ||
        member5.includes(s) ||
        member6.includes(s) ||
        psId.includes(s)
      );
    });
  }, [teams, search]);

  const totalMembers = teams.length * 6; // Assuming exactly 6 members per team as per guidelines

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
          <h1 className="section-title">Registered Teams</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Teams participating in SIH 2026 Internal Hackathon at SRMU
          </p>
        </div>



        {/* Search */}
        <div className="teams-search-bar">
          <span className="teams-search-icon">🔍</span>
          <input
            type="text"
            className="teams-search"
            placeholder="Search teams or members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Teams Grid */}
        {filtered.length > 0 ? (
          <div className="teams-grid">
            {filtered.map((team, i) => {
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
                            {member} {j === 0 && '👑'}
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
              {teams.length === 0
                ? 'No teams registered yet. Stay tuned!'
                : 'No teams found matching your search.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
