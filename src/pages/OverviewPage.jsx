// frontend/src/pages/OverviewPage.jsx
import { fmt } from '../utils';
import { StatusTag } from '../components/Common';

// ── Icons ──
const MerchantIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-5h16l1 5"/>
    <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
    <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
  </svg>
);

const WebhookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 10a4 4 0 1 0 0-4 4 4 0 0 0 0 4z"/>
    <path d="M13 6H7a4 4 0 0 0 0 8h1"/>
    <path d="M11 14a4 4 0 1 0 0 4 4 4 0 0 0 0-4z"/>
    <path d="M11 18h6a4 4 0 0 0 0-8h-1"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const BarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

// ── Stat card colors ──
const statTheme = {
  blue:  { iconBg: 'rgba(26,111,232,0.1)',  iconColor: '#1a6fe8', bar: '#1a6fe8', changeBg: 'rgba(26,111,232,0.07)',  changeColor: '#1558c0' },
  green: { iconBg: 'rgba(22,163,74,0.1)',   iconColor: '#16a34a', bar: '#16a34a', changeBg: 'rgba(22,163,74,0.07)',   changeColor: '#15803d' },
  red:   { iconBg: 'rgba(220,38,38,0.1)',   iconColor: '#dc2626', bar: '#dc2626', changeBg: 'rgba(220,38,38,0.07)',   changeColor: '#b91c1c' },
  amber: { iconBg: 'rgba(217,119,6,0.1)',   iconColor: '#d97706', bar: '#d97706', changeBg: 'rgba(217,119,6,0.07)',   changeColor: '#b45309' },
};

function StatCard({ label, value, color, icon, change, changeIcon }) {
  const t = statTheme[color] || statTheme.blue;
  return (
    <div className="ov-stat-card">
      <div className="ov-stat-top">
        <div className="ov-stat-icon-wrap" style={{ background: t.iconBg, color: t.iconColor }}>
          {icon}
        </div>
        <div className="ov-stat-label">{label}</div>
      </div>
      <div className="ov-stat-value" style={{ color: '#0f172a' }}>{value}</div>
      <div className="ov-stat-change" style={{ background: t.changeBg, color: t.changeColor }}>
        <span className="ov-stat-change-icon">{changeIcon || <TrendUpIcon />}</span>
        {change}
      </div>
      <div className="ov-stat-bar-track">
        <div className="ov-stat-bar-fill" style={{ background: t.bar, width: '60%' }} />
      </div>
    </div>
  );
}

export default function OverviewPage({ merchants, logs }) {
  const processed = logs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length;
  const failed    = logs.filter((l) => (l.status || l.response?.status) === 'FAILED').length;
  const avgRetry  = logs.length
    ? (logs.reduce((a, l) => a + (l.retry_count || 0), 0) / logs.length).toFixed(1)
    : 0;
  const successRate = logs.length ? Math.round((processed / logs.length) * 100) : 0;

  return (
    <>
      {/* ── Stat Cards ── */}
      <div className="ov-stats-grid">
        <StatCard
          label="Total Merchants"
          value={merchants.length}
          color="blue"
          icon={<MerchantIcon />}
          change="Active accounts"
          changeIcon={<MerchantIcon />}
        />
        <StatCard
          label="Webhooks Received"
          value={logs.length}
          color="blue"
          icon={<WebhookIcon />}
          change="All time"
          changeIcon={<BarIcon />}
        />
        <StatCard
          label="Processed"
          value={processed}
          color="green"
          icon={<CheckCircleIcon />}
          change={`${successRate}% success rate`}
          changeIcon={<TrendUpIcon />}
        />
        <StatCard
          label="Failed"
          value={failed}
          color="red"
          icon={<AlertIcon />}
          change={`Avg ${avgRetry} retries`}
          changeIcon={<AlertIcon />}
        />
      </div>

      {/* ── Bottom panels ── */}
      <div className="ov-panels">

        {/* Recent Webhooks */}
        <div className="ov-panel">
          <div className="ov-panel-header">
            <div className="ov-panel-title-wrap">
              <div className="ov-panel-icon ov-panel-icon-blue"><WebhookIcon /></div>
              <div>
                <div className="ov-panel-title">Recent Webhooks</div>
                <div className="ov-panel-sub">Latest incoming events</div>
              </div>
            </div>
            <span className="ov-panel-badge">{logs.length}</span>
          </div>

          <div className="ov-webhook-list">
            {logs.length === 0 ? (
              <div className="ov-empty">
                <div className="ov-empty-icon"><WebhookIcon /></div>
                <div>No webhooks yet</div>
              </div>
            ) : (
              logs.slice(0, 7).map((l, i) => (
                <div className="ov-webhook-row" key={l._id || i}>
                  <StatusTag status={l.status || l.response?.status} />
                  <div className="ov-wh-body">
                    <div className="ov-wh-order">{l.merchant_order_id || '—'}</div>
                    <div className="ov-wh-meta">
                      {l.provider && <span className="ov-wh-provider">{l.provider}</span>}
                      {l.provider && l.external_ref_id && <span className="ov-wh-dot">·</span>}
                      {l.external_ref_id && (
                        <span className="ov-wh-ref">{l.external_ref_id}</span>
                      )}
                    </div>
                  </div>
                  <div className="ov-wh-time">
                    <ClockIcon />
                    {fmt(l.received_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Merchant Overview */}
        <div className="ov-panel">
          <div className="ov-panel-header">
            <div className="ov-panel-title-wrap">
              <div className="ov-panel-icon ov-panel-icon-purple"><MerchantIcon /></div>
              <div>
                <div className="ov-panel-title">Merchant Overview</div>
                <div className="ov-panel-sub">Traffic share by merchant</div>
              </div>
            </div>
            <span className="ov-panel-badge">{merchants.length}</span>
          </div>

          <div className="ov-merchant-list">
            {merchants.length === 0 ? (
              <div className="ov-empty">
                <div className="ov-empty-icon"><MerchantIcon /></div>
                <div>No merchants yet</div>
              </div>
            ) : (
              merchants.map((m) => {
                const mLogs    = logs.filter((l) => l.client_id === m.clientId || l.client_id === m.merchantUsername);
                const mOk      = mLogs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length;
                const mFail    = mLogs.length - mOk;
                const pct      = logs.length ? Math.round((mLogs.length / logs.length) * 100) : 0;
                const okPct    = mLogs.length ? Math.round((mOk / mLogs.length) * 100) : 0;

                return (
                  <div className="ov-merchant-row" key={m._id}>
                    <div className="ov-m-avatar">{m.merchantName?.charAt(0) || '?'}</div>
                    <div className="ov-m-body">
                      <div className="ov-m-top">
                        <span className="ov-m-name">{m.merchantName}</span>
                        <div className="ov-m-chips">
                          <span className="ov-chip ov-chip-ok">{mOk} ok</span>
                          {mFail > 0 && <span className="ov-chip ov-chip-fail">{mFail} fail</span>}
                          <span className="ov-chip ov-chip-neutral">{pct}%</span>
                        </div>
                      </div>
                      <div className="ov-m-bar-track">
                        <div
                          className="ov-m-bar-fill"
                          style={{ width: `${okPct}%` }}
                        />
                        <div
                          className="ov-m-bar-fail"
                          style={{ width: `${100 - okPct}%` }}
                        />
                      </div>
                      <div className="ov-m-footer">
                        <span className="ov-m-events">{mLogs.length} events</span>
                        <span className="ov-m-rate">{okPct}% success</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </>
  );
}