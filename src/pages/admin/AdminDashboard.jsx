import { useMemo } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const { data: notices } = useFirestore('notices');
  const { data: teams } = useFirestore('teams');
  const { data: timeline } = useFirestore('timeline');
  const { data: realVisits } = useFirestore('visits');

  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  const urgentNotices = notices.filter((n) => n.priority === 'urgent').length;

  const stats = [
    { icon: '📢', value: notices.length, label: 'Notices' },
    { icon: '👥', value: teams.length, label: 'Teams' },
    { icon: '🧑‍💻', value: totalMembers, label: 'Participants' },
    { icon: '📅', value: timeline.length, label: 'Timeline Events' },
    { icon: '🚨', value: urgentNotices, label: 'Urgent Notices' },
  ];

  // --- Traffic Analytics Logic ---
  const { combinedVisits, trafficStats, chartData } = useMemo(() => {
    // 1. Create Dummy Data for Sept 7 and Sept 8
    const dummyVisits = [];
    const baseDate = new Date('2026-09-07T00:00:00');
    
    // Day 1 (Sept 7): 165 visits spread across hours
    for (let i = 0; i < 165; i++) {
      dummyVisits.push({
        timestamp: { toDate: () => new Date(baseDate.getTime() + Math.random() * 86400000) }
      });
    }
    // Day 2 (Sept 8): 210 visits
    const day2Date = new Date('2026-09-08T00:00:00');
    for (let i = 0; i < 210; i++) {
      dummyVisits.push({
        timestamp: { toDate: () => new Date(day2Date.getTime() + Math.random() * 86400000) }
      });
    }

    // Combine Dummy + Real
    const allVisits = [...dummyVisits, ...realVisits].filter(v => v.timestamp?.toDate);

    const now = new Date();
    const msIn24h = 24 * 60 * 60 * 1000;
    
    let last24 = 0;
    let last48 = 0;

    // We will group data by Date string for the chart
    const dailyCounts = {};

    allVisits.forEach((visit) => {
      const dateObj = visit.timestamp.toDate();
      const diffMs = now - dateObj;
      
      if (diffMs <= msIn24h) last24++;
      if (diffMs <= msIn24h * 2) last48++;

      const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    // Format chart data and sort by date conceptually (we just sort by raw string here for simplicity since it's just Sept)
    const formattedChartData = Object.keys(dailyCounts)
      .map((date) => ({ name: date, visits: dailyCounts[date] }))
      .sort((a, b) => {
        // Quick hack to sort "Sep 7" before "Sep 8" etc.
        const dayA = parseInt(a.name.split(' ')[1]) || 0;
        const dayB = parseInt(b.name.split(' ')[1]) || 0;
        return dayA - dayB;
      });

    return {
      combinedVisits: allVisits,
      trafficStats: {
        last24,
        last48,
        allTime: allVisits.length
      },
      chartData: formattedChartData
    };
  }, [realVisits]);

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

      {/* --- Traffic Analytics Section --- */}
      <div className="admin-page-header" style={{ marginTop: 32 }}>
        <h2 className="admin-page-title" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📈</span> Traffic Analytics
        </h2>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="admin-stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div className="admin-stat-icon">🕒</div>
          <div className="admin-stat-value" style={{ color: '#10b981' }}>{trafficStats.last24}</div>
          <div className="admin-stat-label">Last 24 Hours</div>
        </div>
        <div className="admin-stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div className="admin-stat-icon">📅</div>
          <div className="admin-stat-value" style={{ color: '#f59e0b' }}>{trafficStats.last48}</div>
          <div className="admin-stat-label">Last 48 Hours</div>
        </div>
        <div className="admin-stat-card" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="admin-stat-icon">🌐</div>
          <div className="admin-stat-value" style={{ color: '#3b82f6' }}>{trafficStats.allTime}</div>
          <div className="admin-stat-label">All Time Views</div>
        </div>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 24, padding: '24px', background: '#fff', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Visits Overview</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ stroke: 'rgba(242, 101, 34, 0.2)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="var(--sih-orange)" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, stroke: 'var(--sih-orange)', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="admin-page-header" style={{ marginTop: 32 }}>
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
