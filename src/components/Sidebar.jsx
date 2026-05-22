export default function Sidebar({ page, setPage, logCount, onLogout }) {
  const navItems = [
    { id: 'overview',  label: 'Overview',      icon: '◈' },
    { id: 'merchants', label: 'Merchants',     icon: '⬡' },
    { id: 'webhooks',  label: 'Webhook Logs',  icon: '⌁', badge: logCount },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">P</div>
          <div>
            <div className="logo-text">Pay<span>In</span></div>
            <div className="logo-sub">Admin Console</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge !== undefined && (
              <span className="nav-badge">{n.badge}</span>
            )}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 16 }}>System</div>
        <div className="nav-item">
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">◎</span>
          <span>API Keys</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">AD</div>
          <div>
            <div className="user-name">Administrator</div>
            <div className="user-role">Super Admin</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">⏻</button>
        </div>
      </div>
    </div>
  );
}
