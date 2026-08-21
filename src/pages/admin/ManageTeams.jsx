import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function ManageTeams() {
  const { data: teams, addItem, updateItem, deleteItem } = useFirestore('teams');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    teamName: '', psId: '', problemTitle: '', theme: '', members: '', leaderName: ''
  });
  const [deleting, setDeleting] = useState(null);

  const resetForm = () => {
    setForm({ teamName: '', psId: '', problemTitle: '', theme: '', members: '', leaderName: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.teamName.trim()) return;

    const membersArray = form.members
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    // Put leader first
    const allMembers = form.leaderName.trim()
      ? [form.leaderName.trim(), ...membersArray.filter(m => m !== form.leaderName.trim())]
      : membersArray;

    const data = {
      teamName: form.teamName.trim(),
      psId: form.psId.trim(),
      problemTitle: form.problemTitle.trim(),
      theme: form.theme.trim(),
      members: allMembers,
    };

    if (editId) {
      await updateItem(editId, data);
    } else {
      await addItem(data);
    }
    resetForm();
  };

  const handleEdit = (team) => {
    setForm({
      teamName: team.teamName || '',
      psId: team.psId || '',
      problemTitle: team.problemTitle || '',
      theme: team.theme || '',
      members: (team.members || []).slice(1).join(', '),
      leaderName: (team.members || [])[0] || '',
    });
    setEditId(team.id);
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
        <h1 className="admin-page-title">Manage Teams</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Team'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, animation: 'fadeInUp 0.3s ease' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Code Warriors"
                  value={form.teamName}
                  onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Team Leader Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Rahul Sharma"
                  value={form.leaderName}
                  onChange={(e) => setForm({ ...form, leaderName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Problem Statement ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., SIH260001"
                  value={form.psId}
                  onChange={(e) => setForm({ ...form, psId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Statement Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Smart Traffic Management"
                  value={form.problemTitle}
                  onChange={(e) => setForm({ ...form, problemTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Theme</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Smart Automation"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Other Members (comma separated)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g., Priya Singh, Amit Kumar, Neha Gupta, Rohit Verma, Sneha Patel"
                value={form.members}
                onChange={(e) => setForm({ ...form, members: e.target.value })}
                style={{ minHeight: 70 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">
                {editId ? '💾 Update Team' : '+ Add Team'}
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
              <th>Team Name</th>
              <th>PS ID</th>
              <th>Members</th>
              <th>Theme</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {team.teamName}
                </td>
                <td>
                  <span className="ps-theme-badge" style={{ fontSize: '0.8rem' }}>
                    {team.psId || '—'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem' }}>
                    {team.members?.length || 0} members
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{team.theme || '—'}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-action-btn admin-edit-btn" onClick={() => handleEdit(team)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="admin-action-btn admin-delete-btn"
                      onClick={() => handleDelete(team.id)}
                      disabled={deleting === team.id}
                    >
                      {deleting === team.id ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No teams registered yet. Click "Add Team" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
