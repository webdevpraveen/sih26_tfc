import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import './Slots.css';

export default function Slots() {
  const { data: slots, loading } = useFirestore('slots');
  const [activeDay, setActiveDay] = useState(1);
  const [activeVenue, setActiveVenue] = useState('all');

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
  }, [slots, activeDay, activeVenue]);

  // Get unique venues
  const venues = useMemo(() => {
    const v = [...new Set(slots.filter((s) => s.day === activeDay).map((s) => s.venue))];
    return ['B1-007', 'B1-207', 'B2-305'].filter((x) => v.includes(x));
  }, [slots, activeDay]);

  // Filter and group: venue → time → sorted teams
  const sections = useMemo(() => {
    let daySlots = slots.filter((s) => s.day === activeDay);
    if (activeVenue !== 'all') daySlots = daySlots.filter((s) => s.venue === activeVenue);

    const timeOrder = ['10:30 AM TO 12:30 PM', '12:00 PM TO 02:00 PM', '12:30 PM TO 02:30 PM', '02:00 PM TO 04:00 PM', '02:30 PM TO 04:30 PM'];
    const grouped = {};

    daySlots.forEach((slot) => {
      const key = `${slot.venue}___${slot.time}`;
      if (!grouped[key]) grouped[key] = { venue: slot.venue, time: slot.time, track: slot.track, slots: [] };
      grouped[key].slots.push(slot);
    });

    // Sort each group by order
    Object.values(grouped).forEach((g) => g.slots.sort((a, b) => (a.order || 0) - (b.order || 0)));

    // Sort groups: by venue then by time
    return Object.values(grouped).sort((a, b) => {
      const venueOrder = ['B1-007', 'B1-207', 'B2-305'];
      const vi = venueOrder.indexOf(a.venue) - venueOrder.indexOf(b.venue);
      if (vi !== 0) return vi;
      return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
    });
  }, [slots, activeDay, activeVenue]);

  // Summary stats
  const summary = useMemo(() => {
    const daySlots = slots.filter((s) => s.day === activeDay);
    return {
      total: daySlots.length,
      done: daySlots.filter((s) => s.status === 'done').length,
      pending: daySlots.filter((s) => s.status === 'pending').length,
      absent: daySlots.filter((s) => s.status === 'absent').length,
    };
  }, [slots, activeDay]);

  const trackColor = (track) => {
    const colors = { 
      'Track 1': '#ec4899', 'Track 2': '#8b5cf6', 'Track 3': '#06b6d4', 
      'Track 4': '#10b981', 'Track 5': '#f59e0b', 'Track 6': '#ef4444',
      'Track 7': '#3b82f6', 'Track 8': '#8b5cf6', 'Track 9': '#14b8a6',
      'Track 10': '#f43f5e', 'Track 11': '#6366f1', 'Track 12': '#d946ef',
      'Track 13': '#84cc16'
    };
    return colors[track] || '#64748b';
  };

  const statusIcon = (status) => {
    if (status === 'done') return '✅';
    if (status === 'absent') return '❌';
    return '⏳';
  };

  if (loading) {
    return (
      <div className="slots-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slots-page page-enter">
      <div className="container">
        <div className="slots-header">
          <h1 className="section-title">Evaluation Slots</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Internal Hackathon — 7th & 8th September 2026
          </p>
        </div>

        {/* Day Tabs */}
        <div className="slots-day-tabs">
          <button className={`slots-day-tab${activeDay === 1 ? ' active' : ''}`} onClick={() => setActiveDay(1)}>
            📅 Day 1 — 7th Sept
          </button>
          <button className={`slots-day-tab${activeDay === 2 ? ' active' : ''}`} onClick={() => setActiveDay(2)}>
            📅 Day 2 — 8th Sept
          </button>
        </div>

        {/* Summary Stats */}
        <div className="slots-summary">
          <div className="slots-summary-card">
            <span className="slots-summary-value total">{summary.total}</span>
            <span className="slots-summary-label">Total</span>
          </div>
          <div className="slots-summary-card">
            <span className="slots-summary-value done">{summary.done}</span>
            <span className="slots-summary-label">Done ✅</span>
          </div>
          <div className="slots-summary-card">
            <span className="slots-summary-value pending">{summary.pending}</span>
            <span className="slots-summary-label">Pending ⏳</span>
          </div>
          <div className="slots-summary-card">
            <span className="slots-summary-value absent">{summary.absent}</span>
            <span className="slots-summary-label">Absent ❌</span>
          </div>
        </div>

        {/* Venue Filter */}
        <div className="slots-venue-filter">
          <button className={`slots-venue-btn${activeVenue === 'all' ? ' active' : ''}`} onClick={() => setActiveVenue('all')}>
            All Venues
          </button>
          {venues.map((v) => (
            <button key={v} className={`slots-venue-btn${activeVenue === v ? ' active' : ''}`} onClick={() => setActiveVenue(v)}>
              🏛️ {v}
            </button>
          ))}
        </div>

        {/* Sections */}
        {sections.length > 0 ? (
          sections.map((section, idx) => (
            <div key={idx} className="slots-section reveal">
              {/* Section Header */}
              <div className="slots-section-bar" style={{ borderLeftColor: trackColor(section.track) }}>
                <div className="slots-section-info">
                  <span className="slots-section-venue">🏛️ {section.venue}</span>
                  <span className="slots-section-divider">•</span>
                  <span className="slots-section-time">🕐 {section.time}</span>
                  <span className="slots-section-divider">•</span>
                  <span className="slots-section-track" style={{ background: trackColor(section.track) }}>
                    {section.track}
                  </span>
                  <span className="slots-section-count">{section.slots.length} teams</span>
                </div>
              </div>

              {/* Team List */}
              <div className="slots-list">
                {section.slots.map((slot, i) => (
                  <div
                    key={slot.id}
                    className={`slots-list-item status-${slot.status || 'pending'}`}
                  >
                    <div className="slots-list-left">
                      <div className="slots-list-number">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="slots-list-info">
                        <div className="slots-list-team">{slot.teamName}</div>
                        <div className="slots-list-leader">
                          <span style={{ opacity: 0.6 }}>Leader:</span> {slot.leaderName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="slots-list-right">
                      <div className={`slots-status-badge badge-${slot.status || 'pending'}`}>
                        {statusIcon(slot.status)} <span className="status-text">{slot.status || 'pending'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem' }}>📋</div>
            <div style={{ marginTop: '12px', color: 'var(--text-muted)' }}>
              No slots scheduled for this day yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
