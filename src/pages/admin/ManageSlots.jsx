import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import './ManageSlots.css';

const STATUS_CYCLE = ['pending', 'done', 'absent'];
const STATUS_LABELS = { pending: 'Upcoming', done: '✅ Done', absent: '❌ Absent' };
const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
  done: { bg: '#d1fae5', color: '#059669', border: '#6ee7b7' },
  absent: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

const VENUES = ['B1-007', 'B1-207', 'B2-305'];

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateFmt = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="ms-live-clock">
      <span className="ms-live-dot"></span>
      <span className="ms-live-label">LIVE</span>
      <span className="ms-clock-time">{fmt}</span>
      <span className="ms-clock-date">{dateFmt}</span>
    </div>
  );
}

export default function ManageSlots() {
  const { data: slots, addItem, updateItem, deleteItem } = useFirestore('slots');
  const [activeDay, setActiveDay] = useState(1);
  const [activeVenue, setActiveVenue] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [form, setForm] = useState({
    teamName: '', leaderName: '', track: 'Track 1', venue: 'B1-007',
    time: '12:00 PM TO 02:00 PM', day: 1, status: 'pending',
  });

  // Group and sort slots by track for active day + venue
  const trackGroups = useMemo(() => {
    let daySlots = slots
      .filter((s) => s.day === activeDay)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (activeVenue !== 'all') {
      daySlots = daySlots.filter((s) => s.venue === activeVenue);
    }

    const groups = {};
    daySlots.forEach((slot) => {
      const track = slot.track || 'Unassigned';
      if (!groups[track]) {
        groups[track] = { track, venue: slot.venue, time: slot.time, slots: [] };
      }
      groups[track].slots.push(slot);
    });

    return Object.values(groups).sort((a, b) => {
      const numA = parseInt(a.track.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.track.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [slots, activeDay, activeVenue]);

  // Stats for active day + venue
  const stats = useMemo(() => {
    let daySlots = slots.filter((s) => s.day === activeDay);
    if (activeVenue !== 'all') {
      daySlots = daySlots.filter((s) => s.venue === activeVenue);
    }
    return {
      total: daySlots.length,
      done: daySlots.filter((s) => s.status === 'done').length,
      pending: daySlots.filter((s) => s.status === 'pending').length,
      absent: daySlots.filter((s) => s.status === 'absent').length,
    };
  }, [slots, activeDay, activeVenue]);

  // Toggle status
  const cycleStatus = useCallback(async (slot) => {
    const currentIdx = STATUS_CYCLE.indexOf(slot.status || 'pending');
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    await updateItem(slot.id, { status: nextStatus });
  }, [updateItem]);

  // Move slot up/down
  const moveSlot = async (slot, direction) => {
    const trackSlots = slots
      .filter((s) => s.track === slot.track && s.day === activeDay)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = trackSlots.findIndex((s) => s.id === slot.id);
    if (idx === -1) return;
    const reordered = [...trackSlots];
    if (direction === 'up' && idx > 0) {
      [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    } else if (direction === 'down' && idx < trackSlots.length - 1) {
      [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    } else {
      return;
    }
    await Promise.all(reordered.map((s, i) => updateItem(s.id, { order: i + 1 })));
  };

  // Form handlers
  const resetForm = () => {
    setForm({ teamName: '', leaderName: '', track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', day: activeDay, status: 'pending' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.teamName.trim()) return;
    const slotData = {
      ...form,
      day: Number(form.day),
      order: editingId ? undefined : (slots.filter((s) => s.day === Number(form.day) && s.track === form.track).length + 1),
    };
    Object.keys(slotData).forEach((k) => slotData[k] === undefined && delete slotData[k]);
    if (editingId) {
      await updateItem(editingId, slotData);
    } else {
      await addItem(slotData);
    }
    resetForm();
  };

  const handleEdit = (slot) => {
    setForm({
      teamName: slot.teamName || '',
      leaderName: slot.leaderName || '',
      track: slot.track || 'Track 1',
      venue: slot.venue || 'B1-007',
      time: slot.time || '',
      day: slot.day || 1,
      status: slot.status || 'pending',
    });
    setEditingId(slot.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this slot?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="page-enter ms-page">
      {/* Header with live clock */}
      <div className="ms-header">
        <h1 className="admin-page-title">Manage Slots</h1>
        <LiveClock />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form ms-form" style={{ marginBottom: '24px' }}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Team Name *</label>
              <input className="admin-form-input" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Team Leader</label>
              <input className="admin-form-input" value={form.leaderName} onChange={(e) => setForm({ ...form, leaderName: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Track</label>
              <select className="admin-form-input" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
                {[...Array(13)].map((_, i) => <option key={i + 1} value={`Track ${i + 1}`}>Track {i + 1}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Venue</label>
              <select className="admin-form-input" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}>
                {VENUES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Timing</label>
              <select className="admin-form-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="10:30 AM TO 12:30 PM">10:30 AM – 12:30 PM</option>
                <option value="12:00 PM TO 02:00 PM">12:00 PM – 02:00 PM</option>
                <option value="12:30 PM TO 02:30 PM">12:30 PM – 02:30 PM</option>
                <option value="02:00 PM TO 04:00 PM">02:00 PM – 04:00 PM</option>
                <option value="02:30 PM TO 04:30 PM">02:30 PM – 04:30 PM</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Day</label>
              <select className="admin-form-input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
                <option value={1}>Day 1 (7th Sept)</option>
                <option value={2}>Day 2 (8th Sept)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select className="admin-form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Upcoming</option>
                <option value="done">Done</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-add-btn">{editingId ? '💾 Update Slot' : '+ Add Slot'}</button>
            <button type="button" className="admin-add-btn" style={{ background: 'var(--bg-surface-light)', color: 'var(--text-secondary)' }} onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {/* Day Tabs + Venue Filter */}
      <div className="ms-filters">
        <div className="ms-day-tabs">
          <button onClick={() => setActiveDay(1)} className={`ms-tab-btn${activeDay === 1 ? ' active' : ''}`}>
            📅 Day 1 — 7th Sept
          </button>
          <button onClick={() => setActiveDay(2)} className={`ms-tab-btn${activeDay === 2 ? ' active' : ''}`}>
            📅 Day 2 — 8th Sept
          </button>
          <button className="ms-add-slot-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
            {showForm ? '✕' : '+'}
          </button>
        </div>
        <div className="ms-venue-tabs">
          <button onClick={() => setActiveVenue('all')} className={`ms-venue-btn${activeVenue === 'all' ? ' active' : ''}`}>
            All Venues
          </button>
          {VENUES.map((v) => (
            <button key={v} onClick={() => setActiveVenue(v)} className={`ms-venue-btn${activeVenue === v ? ' active' : ''}`}>
              🏛️ {v}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="ms-stats">
        {[
          { icon: '📋', value: stats.total, label: 'Total', cls: '' },
          { icon: '✅', value: stats.done, label: 'Done', cls: 'done' },
          { icon: '⏳', value: stats.pending, label: 'Upcoming', cls: 'pending' },
          { icon: '❌', value: stats.absent, label: 'Absent', cls: 'absent' },
        ].map((stat, i) => (
          <div key={i} className={`ms-stat-card ${stat.cls}`}>
            <span className="ms-stat-icon">{stat.icon}</span>
            <span className="ms-stat-value">{stat.value}</span>
            <span className="ms-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Track Sections */}
      {trackGroups.map((group) => (
        <div key={group.track} className="ms-track-group">
          <div className="ms-track-header">
            <span className="ms-track-badge">{group.track}</span>
            <span className="ms-track-meta">🏛️ {group.venue} • 🕐 {group.time}</span>
            <span className="ms-track-count">{group.slots.length} teams</span>
          </div>

          <div className="ms-card-list">
            {group.slots.map((slot, i) => (
              <div
                key={slot.id}
                className={`ms-slot-card status-${slot.status || 'pending'}`}
              >
                <div className="ms-slot-main">
                  <span className="ms-slot-num">{i + 1}</span>
                  <span className="ms-slot-name">{slot.teamName}</span>
                </div>
                <div className="ms-slot-actions">
                  <button
                    onClick={() => cycleStatus(slot)}
                    className="ms-status-btn"
                    style={{
                      background: STATUS_COLORS[slot.status || 'pending'].bg,
                      color: STATUS_COLORS[slot.status || 'pending'].color,
                      border: `1px solid ${STATUS_COLORS[slot.status || 'pending'].border}`,
                    }}
                  >
                    {STATUS_LABELS[slot.status || 'pending']}
                  </button>
                  <button onClick={() => moveSlot(slot, 'up')} className="ms-icon-btn" title="Move Up">🔼</button>
                  <button onClick={() => moveSlot(slot, 'down')} className="ms-icon-btn" title="Move Down">🔽</button>

                  {/* Desktop: direct buttons */}
                  <div className="ms-desktop-actions">
                    <button onClick={() => handleEdit(slot)} className="ms-icon-btn" title="Edit">✏️</button>
                    <button onClick={() => handleDelete(slot.id)} className="ms-icon-btn" title="Delete">🗑️</button>
                  </div>

                  {/* Mobile: three-dot toggle */}
                  <div className="ms-mobile-actions">
                    {menuOpenId !== slot.id ? (
                      <button onClick={() => setMenuOpenId(slot.id)} className="ms-icon-btn ms-dots-btn">⋮</button>
                    ) : (
                      <div className="ms-inline-menu">
                        <button onClick={() => { handleEdit(slot); setMenuOpenId(null); }} className="ms-icon-btn">✏️</button>
                        <button onClick={() => { handleDelete(slot.id); setMenuOpenId(null); }} className="ms-icon-btn">🗑️</button>
                        <button onClick={() => setMenuOpenId(null)} className="ms-icon-btn ms-close-btn">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {trackGroups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem' }}>📋</div>
          <p style={{ marginTop: '12px' }}>No slots found. {activeVenue !== 'all' ? 'Try "All Venues" or ' : ''}Click "+ Add Slot" to start.</p>
        </div>
      )}
    </div>
  );
}
