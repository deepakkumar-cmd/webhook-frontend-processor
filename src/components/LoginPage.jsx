// frontend/src/components/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from './Common';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import mainLogo from '../assets/main_logo.png'; // If logo is in src/assets/


export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await login(form);
      if (response.success) {
        localStorage.setItem('admin_token', response.token);
        authLogin(); // Update auth state
        navigate('/overview'); // Redirect to overview page
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          {/* Add main logo here */}
          <img 
            src={mainLogo} 
            alt="PayIn Logo" 
            className="login-main-logo"
          />
          <div className="logo-mark">
            {/* <div className="logo-icon">P</div>
            <div>
              <div className="logo-text">Pay<span>In</span></div>
            </div> */}
          </div>
          <p className="login-subtitle">Admin Control Panel · Secure Access</p>
        </div>

        <div className="login-form">
          {error && <div className="login-error">⚠ {error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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