// frontend/src/App.js
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import MerchantsPage from './pages/MerchantsPage';
import WebhooksPage from './pages/WebhooksPage';
import LambdaWebhooksPage from './pages/LambdaWebhooksPage';
import { fetchWebhookLogs, fetchMerchants } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';

// ── Fallback demo data (used when API is unreachable) ────────
const DEMO_MERCHANTS = [
  {
    _id: 'm1',
    merchantName: 'TechPay Solutions',
    callbackUrl: 'https://techpay.io/callback',
    merchantUsername: 'techpay_user',
    merchantId: 'TECH001',
    clientId: 'CLI_TECH001',
    createdAt: '2026-05-10T08:00:00Z',
  },
  {
    _id: 'm2',
    merchantName: 'SwiftGate Finance',
    callbackUrl: 'https://swiftgate.com/wh',
    merchantUsername: 'swiftgate_adm',
    merchantId: 'SWG002',
    clientId: 'CLI_SWG002',
    createdAt: '2026-05-14T12:30:00Z',
  },
];

const DEMO_LOGS = [
  {
    _id: '6a102e9ab245f2cd8fedf58b',
    provider: 'NSDL',
    webhook_id: '4761ed2c-ab0d-41f4-83d0-6a22fd2c48c5',
    external_ref_id: 'TXN123',
    merchant_order_id: 'REF123',
    response: { status: 'PROCESSED' },
    status: 'PROCESSED',
    retry_count: 2,
    received_at: '2026-05-22T10:23:22.928Z',
    created_at: '2026-05-22T10:23:22.928Z',
    updated_at: '2026-05-22T10:23:24.684Z',
    last_attempt_at: '2026-05-22T10:23:24.684Z',
    processed_at: '2026-05-22T10:23:24.684Z',
    error_message: 'Processed and callback sent successfully',
    client_id: 'CLI_TECH001',
  },
  {
    _id: '6a1034cde76774ed488115ff',
    provider: 'NSD1L',
    webhook_id: 'c2f42ae1-0a44-465a-b8a8-b1195fe052ad',
    external_ref_id: 'TXN123',
    merchant_order_id: 'REF123',
    response: { status: 'PROCESSED' },
    status: 'PROCESSED',
    retry_count: 2,
    received_at: '2026-05-22T10:49:49.231Z',
    created_at: '2026-05-22T10:49:49.231Z',
    updated_at: '2026-05-22T10:49:50.997Z',
    last_attempt_at: '2026-05-22T10:49:50.997Z',
    processed_at: '2026-05-22T10:49:50.997Z',
    error_message: 'Processed and callback sent successfully',
    client_id: 'CLI_SWG002',
  },
  {
    _id: '6a1034cde76774ed4881abcd',
    provider: 'HDFC',
    webhook_id: 'd3f53bf2-1b55-476b-94e1-c2306gd3590e',
    external_ref_id: 'TXN456',
    merchant_order_id: 'REF456',
    response: { status: 'FAILED' },
    status: 'FAILED',
    retry_count: 3,
    received_at: '2026-05-21T08:10:00.000Z',
    created_at: '2026-05-21T08:10:00.000Z',
    updated_at: '2026-05-21T08:10:05.000Z',
    last_attempt_at: '2026-05-21T08:10:05.000Z',
    processed_at: null,
    error_message: 'Callback timeout',
    client_id: 'CLI_TECH001',
  },
];

// ── Page titles ────────────────────────────────────────────────
const PAGE_TITLES = {
  overview: 'Dashboard Overview',
  merchants: 'Merchant Management',
  webhooks: 'Webhook Event Logs',
  'lambda-webhooks': 'Lambda Webhook Logs',
};

const PAGE_SUBTITLES = {
  overview: 'Real-time payment gateway status',
  merchants: 'Manage and onboard payment merchants',
  webhooks: 'Callback delivery and processing history',
  'lambda-webhooks': 'AWS Lambda and NSDL webhook events',
};

// Main App Content (Protected)
function AppContent() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [merchants, setMerchants] = useState(DEMO_MERCHANTS);
  const [logs, setLogs] = useState(DEMO_LOGS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Function to clear backend cache
  const clearBackendCache = async () => {
    try {
      await fetch('http://localhost:5000/api/webhook/clear-cache', {
        method: 'POST'
      }).catch(() => { });
    } catch (error) {
      console.log('Cache clear not available');
    }
  };

  // Load data from backend
  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (forceRefresh) {
        await clearBackendCache();
      }

      const [logRes, mRes] = await Promise.allSettled([
        fetchWebhookLogs(),
        fetchMerchants(),
      ]);

      if (logRes.status === 'fulfilled') {
        const logsData = logRes.value?.data || [];
        setLogs(logsData.length > 0 ? logsData : DEMO_LOGS);
      }
      if (mRes.status === 'fulfilled') {
        const merchantsData = mRes.value?.data || [];
        setMerchants(merchantsData.length > 0 ? merchantsData : DEMO_MERCHANTS);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await clearBackendCache();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const pageTitle = PAGE_TITLES[currentPage] || 'Dashboard';
  const pageSubtitle = PAGE_SUBTITLES[currentPage] || '';

  return (
    <div className="app">
      <Sidebar
        page={currentPage}
        setPage={setCurrentPage}
        logCount={logs.length}
        onLogout={handleLogout}
      />

      <div className="main">
        {/* Top bar with refresh button */}
        <div className="topbar">
          <div>
            <div className="page-title">{pageTitle}</div>
            <div className="page-subtitle">{pageSubtitle}</div>
          </div>
          <div className="topbar-right">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => loadData(true)}
              style={{ marginRight: '12px' }}
            >
              ↻ Refresh
            </button>
            <div className="status-dot" />
            <span className="status-label">
              {loading ? 'Loading…' : 'System Operational'}
            </span>
          </div>
        </div>

        {/* Pages */}
        <div className="content">
          {currentPage === 'overview' && <OverviewPage merchants={merchants} logs={logs} onRefresh={() => loadData(true)} />}
          {currentPage === 'merchants' && (
            <MerchantsPage
              merchants={merchants}
              setMerchants={setMerchants}
              logs={logs}
              onRefresh={() => loadData(true)}
            />
          )}
          {currentPage === 'webhooks' && <WebhooksPage logs={logs} merchants={merchants} onRefresh={() => loadData(true)} />}
          {currentPage === 'lambda-webhooks' && <LambdaWebhooksPage logs={logs} merchants={merchants} onRefresh={() => loadData(true)} />}
        </div>
      </div>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Main App
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/overview" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchants"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/webhooks"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lambda-webhooks"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AuthProvider>
  );
}