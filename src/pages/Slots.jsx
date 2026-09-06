import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import './Slots.css';

export default function Slots() {
  const { data: slots, loading } = useFirestore('slots');
  const [activeDay, setActiveDay] = useState(1);

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
  }, [slots, activeDay]);

  // Group slots: Venue → Time → teams
  const venueGroups = useMemo(() => {
    const daySlots = slots
      .filter((s) => s.day === activeDay)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const venueMap = {};
    daySlots.forEach((slot) => {
      const venue = slot.venue || 'Unknown';
      const time = slot.time || 'TBD';
      if (!venueMap[venue]) venueMap[venue] = {};
      if (!venueMap[venue][time]) venueMap[venue][time] = { time, track: slot.track, slots: [] };
      venueMap[venue][time].slots.push(slot);
    });

    // Sort venues and times
    const venueOrder = ['B1-007', 'B1-207', 'B2-305'];
    const timeOrder = ['12:00 PM TO 02:00 PM', '02:00 PM TO 04:00 PM'];

    return venueOrder
      .filter((v) => venueMap[v])
      .map((venue) => ({
        venue,
        timeSlots: timeOrder
          .filter((t) => venueMap[venue][t])
          .map((t) => venueMap[venue][t]),
      }));
  }, [slots, activeDay]);

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

  const trackColorClass = (track) => {
    const num = parseInt(String(track).replace(/\D/g, '')) || 1;
    return `track-${Math.min(num, 6)}`;
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
          <button
            className={`slots-day-tab${activeDay === 1 ? ' active' : ''}`}
            onClick={() => setActiveDay(1)}
          >
            📅 Day 1 — 7th Sept
          </button>
          <button
            className={`slots-day-tab${activeDay === 2 ? ' active' : ''}`}
            onClick={() => setActiveDay(2)}
          >
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

        {/* Venue Sections */}
        {venueGroups.length > 0 ? (
          venueGroups.map((venueGroup) => (
            <div key={venueGroup.venue} className="slots-venue-section reveal">
              <div className="slots-venue-header">
                <span className="slots-venue-badge">🏛️ {venueGroup.venue}</span>
              </div>

              {venueGroup.timeSlots.map((timeSlot) => (
                <div key={timeSlot.time} className="slots-timeslot-section">
                  <div className="slots-timeslot-header">
                    <span className="slots-meta-chip">🕐 {timeSlot.time}</span>
                    <span className={`slots-track-badge ${trackColorClass(timeSlot.track)}`}>
                      {timeSlot.track}
                    </span>
                    <span className="slots-meta-chip">{timeSlot.slots.length} Teams</span>
                  </div>

                  <div className="slots-table-wrap">
                    <table className="slots-table">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>#</th>
                          <th>Team Name</th>
                          <th>Team Leader</th>
                          <th style={{ width: '100px' }}>Track</th>
                          <th style={{ width: '120px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlot.slots.map((slot, i) => (
                          <tr key={slot.id}>
                            <td className="slots-sno">{i + 1}</td>
                            <td className="slots-team-name">{slot.teamName}</td>
                            <td className="slots-leader-name">{slot.leaderName}</td>
                            <td>
                              <span className={`slots-track-badge-sm ${trackColorClass(slot.track)}`}>
                                {slot.track}
                              </span>
                            </td>
                            <td>
                              <span className={`slot-status-badge slot-status-${slot.status || 'pending'}`}>
                                <span className="status-dot"></span>
                                {slot.status || 'pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-state-icon" style={{ fontSize: '3rem' }}>📋</div>
            <div className="empty-state-text" style={{ marginTop: '12px', color: 'var(--text-muted)' }}>
              No slots scheduled for this day yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
