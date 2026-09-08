import { useEffect } from 'react';
import './Results.css';

export default function Results() {
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
  }, []);

  const totalTeams = 50;

  const renderSkeletonRow = (index) => {
    // 0 to 44 are top 45 (green), 45 to 49 are waitlist 5 (yellow)
    const isTop = index < 45;
    const rowClass = isTop ? 'skeleton-row top-team' : 'skeleton-row wait-team';

    return (
      <div key={index} className={`${rowClass} reveal`} style={{ transitionDelay: `${Math.min(index * 0.02, 0.5)}s` }}>
        <div className="row-number">{index + 1}</div>
        <div className="row-content">
          <div className="shimmer-block skeleton-title"></div>
          <div className="shimmer-block skeleton-text"></div>
        </div>
        <div className="row-badge">
          <div className="shimmer-block skeleton-badge"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="results-page page-enter">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="results-header reveal">
          <h1 className="section-title">Final Results</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            SIH 2026 Internal Hackathon at SRMU
          </p>
          <div className="results-banner">
            ✅ All evaluations have concluded. The final list is being updated.
          </div>
        </div>

        <section className="results-section">
          <div className="results-list">
            {Array.from({ length: totalTeams }).map((_, i) => renderSkeletonRow(i))}
          </div>
        </section>
      </div>
    </div>
  );
}
