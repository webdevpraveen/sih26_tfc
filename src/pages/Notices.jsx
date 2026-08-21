import { useState, useMemo } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import './Notices.css';

export default function Notices() {
  const { data: notices, loading } = useFirestore('notices');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notices;
    return notices.filter((n) => n.priority === filter);
  }, [notices, filter]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="notices-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notices-page page-enter">
      <div className="container">
        <div className="notices-header">
          <h1 className="section-title">Notices & Alerts</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Stay updated with the latest announcements and important information
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="notice-filter-tabs">
          {['all', 'normal', 'important', 'urgent'].map((f) => (
            <button
              key={f}
              className={`notice-filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Notices List */}
        {filtered.length > 0 ? (
          <div className="notices-list">
            {filtered.map((notice) => (
              <div
                key={notice.id}
                className={`notice-card priority-${notice.priority || 'normal'}`}
              >
                <div className="notice-card-top">
                  <h3 className="notice-title">{notice.title}</h3>
                  <span className="notice-priority-badge">
                    <span className={`badge badge-${
                      notice.priority === 'urgent' ? 'danger' :
                      notice.priority === 'important' ? 'warning' : 'blue'
                    }`}>
                      {notice.priority || 'normal'}
                    </span>
                  </span>
                </div>
                <p className="notice-description">{notice.description}</p>
                <div className="notice-meta">
                  <span className="notice-date">
                    🕐 {formatDate(notice.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <div className="empty-state-text">
              {notices.length === 0
                ? 'No notices posted yet. Check back soon!'
                : 'No notices match the selected filter.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
