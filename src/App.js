import { useState, useEffect, useCallback } from 'react';
import LoginPage   from './components/LoginPage';
import Sidebar     from './components/Sidebar';
import OverviewPage  from './pages/OverviewPage';
import MerchantsPage from './pages/MerchantsPage';
import WebhooksPage  from './pages/WebhooksPage';
import { fetchWebhookLogs, fetchMerchants } from './api';
 
// ── Fallback demo data (used when API is unreachable) ────────
const DEMO_MERCHANTS = [
  {
    _id: 'm1',
    merchantName:     'TechPay Solutions',
    callbackUrl:      'https://techpay.io/callback',
    merchantUsername: 'techpay_user',
    merchantId:       'TECH001',
    clientId:         'CLI_TECH001',
    createdAt:        '2026-05-10T08:00:00Z',
  },
  {
    _id: 'm2',
    merchantName:     'SwiftGate Finance',
    callbackUrl:      'https://swiftgate.com/wh',
    merchantUsername: 'swiftgate_adm',
    merchantId:       'SWG002',
    clientId:         'CLI_SWG002',
    createdAt:        '2026-05-14T12:30:00Z',
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
    provider: 'NSDL',
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

// ── Page meta ────────────────────────────────────────────────
const PAGE_META = {
  overview:  { title: 'Dashboard Overview',      sub: 'Real-time payment gateway status' },
  merchants: { title: 'Merchant Management',     sub: 'Manage and onboard payment merchants' },
  webhooks:  { title: 'Webhook Event Logs',      sub: 'Callback delivery and processing history' },
};

export default function App() {
  const [authed,    setAuthed]    = useState(false);
  const [page,      setPage]      = useState('overview');
  const [merchants, setMerchants] = useState(DEMO_MERCHANTS);
  const [logs,      setLogs]      = useState(DEMO_LOGS);
  const [loading,   setLoading]   = useState(false);

  // Load data from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [logRes, mRes] = await Promise.allSettled([
        fetchWebhookLogs(),
        fetchMerchants(),
      ]);
      if (logRes.status === 'fulfilled') setLogs(logRes.value.data);
      if (mRes.status  === 'fulfilled') setMerchants(mRes.value.data);
    } catch {
      // silently keep demo data
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  const meta = PAGE_META[page];

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        logCount={logs.length}
        onLogout={() => setAuthed(false)}
      />

      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="page-title">{meta.title}</div>
            <div className="page-subtitle">{meta.sub}</div>
          </div>
          <div className="topbar-right">
            <div className="status-dot" />
            <span className="status-label">
              {loading ? 'Loading…' : 'System Operational'}
            </span>
          </div>
        </div>

        {/* Pages */}
        <div className="content">
          {page === 'overview'  && <OverviewPage  merchants={merchants} logs={logs} />}
          {page === 'merchants' && <MerchantsPage merchants={merchants} setMerchants={setMerchants} logs={logs} />}
          {page === 'webhooks'  && <WebhooksPage  logs={logs} merchants={merchants} onRefresh={loadData} />}
        </div>
      </div>
    </div>
  );
}
