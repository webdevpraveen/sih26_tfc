import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function ManageNotices() {
  const { data: notices, addItem, updateItem, deleteItem } = useFirestore('notices');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'normal' });
  const [deleting, setDeleting] = useState(null);

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'normal' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    if (editId) {
      await updateItem(editId, form);
    } else {
      await addItem(form);
    }
    resetForm();
  };

  const handleEdit = (notice) => {
    setForm({ title: notice.title, description: notice.description, priority: notice.priority || 'normal' });
    setEditId(notice.id);
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
        <h1 className="admin-page-title">Manage Notices</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Notice'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, animation: 'fadeInUp 0.3s ease' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Notice title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Detailed description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">
                {editId ? '💾 Update Notice' : '+ Add Notice'}
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
              <th>Title</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: 300 }}>
                  {notice.title}
                </td>
                <td>
                  <span className={`badge badge-${
                    notice.priority === 'urgent' ? 'danger' :
                    notice.priority === 'important' ? 'warning' : 'blue'
                  }`}>
                    {notice.priority || 'normal'}
                  </span>
                </td>
                <td>{notice.createdAt?.toDate?.()?.toLocaleDateString('en-IN') || '—'}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-action-btn admin-edit-btn" onClick={() => handleEdit(notice)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="admin-action-btn admin-delete-btn"
                      onClick={() => handleDelete(notice.id)}
                      disabled={deleting === notice.id}
                    >
                      {deleting === notice.id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No notices yet. Click "Add Notice" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
