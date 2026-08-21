import { useFirestore } from '../../hooks/useFirestore';

export default function AdminDashboard() {
  const { data: notices } = useFirestore('notices');
  const { data: teams } = useFirestore('teams');
  const { data: timeline } = useFirestore('timeline');

  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  const urgentNotices = notices.filter((n) => n.priority === 'urgent').length;

  const stats = [
    { icon: '📢', value: notices.length, label: 'Notices' },
    { icon: '👥', value: teams.length, label: 'Teams' },
    { icon: '🧑‍💻', value: totalMembers, label: 'Participants' },
    { icon: '📅', value: timeline.length, label: 'Timeline Events' },
    { icon: '🚨', value: urgentNotices, label: 'Urgent Notices' },
  ];

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon">{stat.icon}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Notices */}
      <div className="admin-page-header" style={{ marginTop: 16 }}>
        <h2 className="admin-page-title" style={{ fontSize: '1.2rem' }}>Recent Notices</h2>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {notices.slice(0, 5).map((notice) => (
              <tr key={notice.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{notice.title}</td>
                <td>
                  <span className={`badge badge-${
                    notice.priority === 'urgent' ? 'danger' :
                    notice.priority === 'important' ? 'warning' : 'blue'
                  }`}>
                    {notice.priority || 'normal'}
                  </span>
                </td>
                <td>{notice.createdAt?.toDate?.()?.toLocaleDateString('en-IN') || '—'}</td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No notices yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
