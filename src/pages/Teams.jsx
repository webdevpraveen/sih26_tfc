import { useState, useMemo, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import './Teams.css';

export default function Teams() {
  const { data: teams, loading } = useFirestore('teams');
  const [search, setSearch] = useState('');

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
    return teams.filter(
      (t) =>
        t.teamName?.toLowerCase().includes(s) ||
        t.psId?.toLowerCase().includes(s) ||
        t.problemTitle?.toLowerCase().includes(s) ||
        t.members?.some((m) => m.toLowerCase().includes(s))
    );
  }, [teams, search]);

  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);

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

        {/* Stats */}
        <div className="teams-stats">
          <div className="teams-stat">
            <div className="teams-stat-number">{teams.length}</div>
            <div className="teams-stat-label">Teams</div>
          </div>
          <div className="teams-stat">
            <div className="teams-stat-number">{totalMembers}</div>
            <div className="teams-stat-label">Participants</div>
          </div>
        </div>

        {/* Search */}
        <div className="teams-search-bar">
          <span className="teams-search-icon">🔍</span>
          <input
            type="text"
            className="teams-search"
            placeholder="Search teams, members, or problem statements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Teams Grid */}
        {filtered.length > 0 ? (
          <div className="teams-grid">
            {filtered.map((team, i) => (
              <div
                key={team.id}
                className="team-card reveal"
                style={{ transitionDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <div className="team-card-header">
                  <h3 className="team-name">{team.teamName}</h3>
                  {team.psId && <span className="team-ps-id">{team.psId}</span>}
                </div>

                {team.problemTitle && (
                  <div className="team-problem">
                    <div className="team-problem-label">Problem Statement</div>
                    {team.problemTitle}
                  </div>
                )}

                {team.members && team.members.length > 0 && (
                  <div className="team-members-section">
                    <div className="team-members-title">
                      Members ({team.members.length})
                    </div>
                    <div className="team-members-list">
                      {team.members.map((member, j) => (
                        <span
                          key={j}
                          className={`team-member${j === 0 ? ' leader' : ''}`}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {team.theme && (
                  <span className="team-theme-badge">{team.theme}</span>
                )}
              </div>
            ))}
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
