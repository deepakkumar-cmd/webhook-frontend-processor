import { useState } from 'react';
import { Spinner } from './Common';

const ADMIN_USER = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASSWORD || 'admin@123';

export default function LoginPage({ onLogin }) {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
        onLogin();
      } else {
        setError(`Invalid credentials. Use ${ADMIN_USER} / ${ADMIN_PASS}`);
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">
            <div className="logo-icon">P</div>
            <div>
              <div className="logo-text">Pay<span>In</span></div>
            </div>
          </div>
          <p className="login-subtitle">Admin Control Panel · Secure Access</p>
        </div>

        <div className="login-form">
          {error && <div className="login-error">⚠ {error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            className="btn btn-primary login-btn"
            onClick={handleSubmit}
            disabled={loading || !form.username || !form.password}
          >
            {loading ? <><Spinner /> Authenticating…</> : 'Sign In to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
