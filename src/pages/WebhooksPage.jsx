import { useState } from 'react';
import { StatusTag, EmptyState } from '../components/Common';
import { fmt, shortId } from '../utils';

export default function WebhooksPage({ logs, merchants, onRefresh }) {
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('ALL');
  const [expandedId, setExpanded] = useState(null);

  const getMerchant = (clientId) => merchants.find((m) => m.clientId === clientId);

  const filtered = logs.filter((l) => {
    const s = l.status || l.response?.status;
    const matchStatus = statusFilter === 'ALL' || s === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      [l._id, l.webhook_id, l.external_ref_id, l.merchant_order_id, l.provider, l.client_id]
        .some((v) => v?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <>
      <div className="card-header mb-4">
        <div>
          <div className="card-title">Webhook Event Logs</div>
          <div className="card-subtitle">
            {logs.length} total · {logs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length} processed
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh</button>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-4">
        <div className="search-box">
          <span style={{ color: 'var(--text3)', fontSize: 15 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, provider, order ref…"
          />
        </div>
        {['ALL', 'PROCESSED', 'FAILED', 'PENDING'].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>Provider</th>
                <th>Merchant</th>
                <th>Order Ref</th>
                <th>Ext Ref</th>
                <th>Status</th>
                <th>Retries</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
                    No webhooks found
                  </td>
                </tr>
              )}

              {filtered.map((log) => {
                const merchant  = getMerchant(log.client_id);
                const expanded  = expandedId === log._id;
                const status    = log.status || log.response?.status;

                return (
                  <>
                    <tr
                      key={log._id}
                      onClick={() => setExpanded(expanded ? null : log._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="mono truncate" title={log._id}>{shortId(log._id)}</span>
                      </td>
                      <td><span className="tag tag-blue">{log.provider}</span></td>
                      <td>
                        {merchant ? (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{merchant.merchantName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{merchant.clientId}</div>
                          </div>
                        ) : (
                          <span className="mono" style={{ fontSize: 12 }}>{log.client_id || '—'}</span>
                        )}
                      </td>
                      <td><span className="mono">{log.merchant_order_id}</span></td>
                      <td><span className="mono">{log.external_ref_id}</span></td>
                      <td><StatusTag status={status} /></td>
                      <td>
                        <span
                          className="mono"
                          style={{ color: log.retry_count > 1 ? 'var(--warning)' : 'var(--text3)' }}
                        >
                          {log.retry_count}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text3)', fontSize: 12 }}>{fmt(log.received_at)}</td>
                      <td style={{ color: 'var(--text3)' }}>{expanded ? '▴' : '▾'}</td>
                    </tr>

                    {expanded && (
                      <tr key={`${log._id}-detail`}>
                        <td colSpan={9} style={{ padding: '0 14px 14px', background: 'var(--bg3)' }}>
                          <div className="detail-drawer">
                            <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>Webhook Detail</span>
                              {merchant && <span className="tag tag-success">{merchant.merchantName}</span>}
                            </div>
                            <div className="detail-grid">
                              {[
                                ['Webhook ID',       log.webhook_id],
                                ['Document ID',      log._id],
                                ['Provider',         log.provider],
                                ['Client ID',        log.client_id],
                                ['External Ref ID',  log.external_ref_id],
                                ['Merchant Order ID',log.merchant_order_id],
                                ['Response Status',  log.response?.status],
                                ['Retry Count',      log.retry_count],
                                ['Received At',      fmt(log.received_at)],
                                ['Last Attempt',     fmt(log.last_attempt_at)],
                                ['Processed At',     fmt(log.processed_at)],
                                ['Updated At',       fmt(log.updated_at)],
                              ].map(([k, v]) => (
                                <div className="detail-item" key={k}>
                                  <div className="detail-key">{k}</div>
                                  <div className="detail-val">{v ?? '—'}</div>
                                </div>
                              ))}
                              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                <div className="detail-key">Message</div>
                                <div
                                  className="detail-val"
                                  style={{ color: status === 'FAILED' ? 'var(--danger)' : 'var(--success)' }}
                                >
                                  {log.error_message || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
