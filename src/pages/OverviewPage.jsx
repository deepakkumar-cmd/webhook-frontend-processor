import { fmt } from '../utils';
import { StatusTag } from '../components/Common';

export default function OverviewPage({ merchants, logs }) {
  const processed = logs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length;
  const failed    = logs.filter((l) => (l.status || l.response?.status) === 'FAILED').length;
  const avgRetry  = logs.length
    ? (logs.reduce((a, l) => a + (l.retry_count || 0), 0) / logs.length).toFixed(1)
    : 0;

  const stats = [
    { label: 'Total Merchants',    value: merchants.length, color: 'blue',  icon: '🏪', change: 'Active accounts' },
    { label: 'Webhooks Received',  value: logs.length,      color: 'blue',  icon: '📡', change: 'All time' },
    { label: 'Processed',          value: processed,        color: 'green', icon: '✓',  change: `${logs.length ? Math.round((processed / logs.length) * 100) : 0}% success rate` },
    { label: 'Failed',             value: failed,           color: 'red',   icon: '⚠',  change: `Avg ${avgRetry} retries` },
  ];

  return (
    <>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className={`stat-card ${s.color}`} key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent webhooks */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Webhooks</div>
              <div className="card-subtitle">Latest events</div>
            </div>
          </div>
          {logs.slice(0, 6).map((l) => (
            <div
              key={l._id}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}
            >
              <StatusTag status={l.status || l.response?.status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{l.merchant_order_id}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  {l.provider} · {l.external_ref_id}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                {fmt(l.received_at)}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 32, fontSize: 13 }}>
              No webhooks yet
            </div>
          )}
        </div>

        {/* Merchant overview */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Merchant Overview</div>
              <div className="card-subtitle">Traffic share by merchant</div>
            </div>
          </div>
          {merchants.map((m) => {
            const mLogs = logs.filter((l) => l.client_id === m.clientId);
            const pct   = logs.length ? Math.round((mLogs.length / logs.length) * 100) : 0;
            return (
              <div key={m._id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>{m.merchantName}</span>
                  <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    {mLogs.length} events
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%', width: `${pct}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                      borderRadius: 4, transition: 'width 0.5s',
                    }}
                  />
                </div>
              </div>
            );
          })}
          {merchants.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 32, fontSize: 13 }}>
              No merchants yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}
