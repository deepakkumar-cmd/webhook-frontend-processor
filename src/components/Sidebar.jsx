// frontend/src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Icons = {
  overview: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  merchants: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5"/><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
      <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  ),
  webhook: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 10a4 4 0 1 0 0-4 4 4 0 0 0 0 4z"/><path d="M13 6H7a4 4 0 0 0 0 8h1"/>
      <path d="M11 14a4 4 0 1 0 0 4 4 4 0 0 0 0-4z"/><path d="M11 18h6a4 4 0 0 0 0-8h-1"/>
    </svg>
  ),
  logout: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  power: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
    </svg>
  ),
};

export default function Sidebar({ page, setPage, logCount, onLogout }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Icons.overview, path: '/overview' },
    { id: 'merchants', label: 'Merchants', icon: Icons.merchants, path: '/merchants' },
    { id: 'lambda-webhooks', label: 'Webhook', icon: Icons.webhook, path: '/lambda-webhooks', badge: logCount },
  ];

  const handleNavigation = (item) => {
    setPage(item.id);
    navigate(item.path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="PayIn Logo" className="sidebar-logo-img" />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: '24px' }}>System</div>
        <div className="nav-item" onClick={onLogout}>
          <span className="nav-icon">{Icons.logout}</span>
          <span className="nav-label">Logout</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Administrator</div>
            <div className="user-role">Super Admin</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            {Icons.power}
          </button>
        </div>
      </div>
    </div>
  );
}