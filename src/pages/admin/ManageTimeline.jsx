import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function ManageTimeline() {
  const { data: events, addItem, updateItem, deleteItem } = useFirestore('timeline');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    date: '', title: '', description: '', status: 'upcoming', order: 0
  });
  const [deleting, setDeleting] = useState(null);

  const sorted = [...events].sort((a, b) => (a.order || 0) - (b.order || 0));

  const resetForm = () => {
    setForm({ date: '', title: '', description: '', status: 'upcoming', order: events.length });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date.trim()) return;

    const data = {
      date: form.date.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      order: parseInt(form.order) || 0,
    };

    if (editId) {
      await updateItem(editId, data);
    } else {
      await addItem(data);
    }
    resetForm();
  };

  const handleEdit = (event) => {
    setForm({
      date: event.date || '',
      title: event.title || '',
      description: event.description || '',
      status: event.status || 'upcoming',
      order: event.order || 0,
    });
    setEditId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    await deleteItem(id);
    setDeleting(null);
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Timeline</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, animation: 'fadeInUp 0.3s ease' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 5 - 10 AUG 2026"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Internal Team Registration"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Brief description of the event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ minHeight: 70 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">
                {editId ? '💾 Update Event' : '+ Add Event'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Event</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <tr key={event.id}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  #{event.order || 0}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--sih-cyan)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {event.date}
                </td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {event.title}
                </td>
                <td>
                  <span className={`badge badge-${
                    event.status === 'active' ? 'success' :
                    event.status === 'completed' ? 'cyan' : 'blue'
                  }`}>
                    {event.status || 'upcoming'}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-action-btn admin-edit-btn" onClick={() => handleEdit(event)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="admin-action-btn admin-delete-btn"
                      onClick={() => handleDelete(event.id)}
                      disabled={deleting === event.id}
                    >
                      {deleting === event.id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No timeline events yet. Click "Add Event" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
