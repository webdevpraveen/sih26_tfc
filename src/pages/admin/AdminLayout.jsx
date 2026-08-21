import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/notices', icon: '📢', label: 'Manage Notices' },
    { to: '/admin/teams', icon: '👥', label: 'Manage Teams' },
    { to: '/admin/timeline', icon: '📅', label: 'Manage Timeline' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">⚡ SIH 2026 Admin</div>
          <div className="admin-sidebar-sub">SRMU Control Panel</div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            Logged in as: {user?.email}
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

      {/* Mobile Toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
    </div>
  );
}
