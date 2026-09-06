import { useState, useMemo, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

const STATUS_CYCLE = ['pending', 'done', 'absent'];
const STATUS_LABELS = { pending: 'Upcoming', done: '✅ Done', absent: '❌ Absent' };
const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
  done: { bg: '#d1fae5', color: '#059669', border: '#6ee7b7' },
  absent: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

export default function ManageSlots() {
  const { data: slots, addItem, updateItem, deleteItem } = useFirestore('slots');
  const [activeDay, setActiveDay] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [form, setForm] = useState({
    teamName: '', leaderName: '', track: 'Track 1', venue: 'B1-007',
    time: '12:00 PM TO 02:00 PM', day: 1, status: 'pending',
  });

  // Group and sort slots by track for active day
  const trackGroups = useMemo(() => {
    const daySlots = slots
      .filter((s) => s.day === activeDay)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

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
  }, [slots, activeDay]);

  // Stats for active day
  const stats = useMemo(() => {
    const daySlots = slots.filter((s) => s.day === activeDay);
    return {
      total: daySlots.length,
      done: daySlots.filter((s) => s.status === 'done').length,
      pending: daySlots.filter((s) => s.status === 'pending').length,
      absent: daySlots.filter((s) => s.status === 'absent').length,
    };
  }, [slots, activeDay]);

  // Toggle status
  const cycleStatus = useCallback(async (slot) => {
    const currentIdx = STATUS_CYCLE.indexOf(slot.status || 'pending');
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    await updateItem(slot.id, { status: nextStatus });
  }, [updateItem]);

  // Drag and drop handlers
  const handleDragStart = (slot) => setDragItem(slot);
  const handleDragOver = (e, slot) => { e.preventDefault(); setDragOverItem(slot); };
  const handleDragEnd = () => { setDragItem(null); setDragOverItem(null); };

  const handleDrop = useCallback(async (e, targetSlot) => {
    e.preventDefault();
    if (!dragItem || dragItem.id === targetSlot.id || dragItem.track !== targetSlot.track) {
      setDragItem(null);
      setDragOverItem(null);
      return;
    }

    // Get all slots in this track, sorted by order
    const trackSlots = slots
      .filter((s) => s.track === dragItem.track && s.day === activeDay)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const fromIdx = trackSlots.findIndex((s) => s.id === dragItem.id);
    const toIdx = trackSlots.findIndex((s) => s.id === targetSlot.id);

    if (fromIdx === -1 || toIdx === -1) return;

    // Reorder
    const reordered = [...trackSlots];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Update order in Firestore
    const updates = reordered.map((s, i) => updateItem(s.id, { order: i + 1 }));
    await Promise.all(updates);

    setDragItem(null);
    setDragOverItem(null);
  }, [dragItem, slots, activeDay, updateItem]);

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
    // Remove undefined keys
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this slot?')) {
      await deleteItem(id);
    }
  };

  // Bulk actions
  const bulkUpdateStatus = async (status) => {
    const daySlots = slots.filter((s) => s.day === activeDay);
    await Promise.all(daySlots.map((s) => updateItem(s.id, { status })));
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Slots</h1>
        <button className="admin-add-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm ? '✕ Close' : '+ Add Slot'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '24px' }}>
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
                <option value="B1-007">B1-007</option>
                <option value="B1-207">B1-207</option>
                <option value="B2-305">B2-305</option>
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
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="submit" className="admin-add-btn">{editingId ? '💾 Update Slot' : '+ Add Slot'}</button>
            <button type="button" className="admin-add-btn" style={{ background: 'var(--bg-surface-light)', color: 'var(--text-secondary)' }} onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {/* Day Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setActiveDay(1)}
          className="admin-add-btn"
          style={activeDay === 1 ? {} : { background: 'var(--bg-surface-light)', color: 'var(--text-secondary)' }}
        >
          Day 1 — 7th Sept
        </button>
        <button
          onClick={() => setActiveDay(2)}
          className="admin-add-btn"
          style={activeDay === 2 ? {} : { background: 'var(--bg-surface-light)', color: 'var(--text-secondary)' }}
        >
          Day 2 — 8th Sept
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        {[
          { icon: '📋', value: stats.total, label: 'Total Slots' },
          { icon: '✅', value: stats.done, label: 'Done' },
          { icon: '⏳', value: stats.pending, label: 'Upcoming' },
          { icon: '❌', value: stats.absent, label: 'Absent' },
        ].map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon">{stat.icon}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Track Sections */}
      {trackGroups.map((group) => (
        <div key={group.track} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
            <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'var(--sih-blue)', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
              {group.track}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              🏛️ {group.venue} • 🕐 {group.time}
            </span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Team Name</th>
                  <th>Leader</th>
                  <th style={{ width: '140px' }}>Status</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.slots.map((slot, i) => (
                  <tr
                    key={slot.id}
                    draggable
                    onDragStart={() => handleDragStart(slot)}
                    onDragOver={(e) => handleDragOver(e, slot)}
                    onDrop={(e) => handleDrop(e, slot)}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor: 'grab',
                      opacity: dragItem?.id === slot.id ? 0.4 : 1,
                      background: dragOverItem?.id === slot.id ? 'rgba(14, 165, 233, 0.08)' : undefined,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700 }}>
                      ⠿ {i + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{slot.teamName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{slot.leaderName}</td>
                    <td>
                      <button
                        onClick={() => cycleStatus(slot)}
                        style={{
                          background: STATUS_COLORS[slot.status || 'pending'].bg,
                          color: STATUS_COLORS[slot.status || 'pending'].color,
                          border: `1px solid ${STATUS_COLORS[slot.status || 'pending'].border}`,
                          padding: '5px 14px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {STATUS_LABELS[slot.status || 'pending']}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEdit(slot)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(slot.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {trackGroups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem' }}>📋</div>
          <p style={{ marginTop: '12px' }}>No slots for Day {activeDay}. Click "+ Add Slot" to start.</p>
        </div>
      )}
    </div>
  );
}
