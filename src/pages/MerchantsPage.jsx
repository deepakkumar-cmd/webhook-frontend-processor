import { useState } from 'react';
import MerchantModal from '../components/MerchantModal';
import { initials, fmt } from '../utils';
import { EmptyState } from '../components/Common';

export default function MerchantsPage({ merchants, setMerchants, logs }) {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (m) => {
    setMerchants((p) => [m, ...p]);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <MerchantModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      <div className="card-header mb-4">
        <div>
          <div className="card-title">Merchants</div>
          <div className="card-subtitle">
            {merchants.length} registered merchant{merchants.length !== 1 ? 's' : ''}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ＋ Add Merchant
        </button>
      </div>

      {merchants.length === 0 ? (
        <EmptyState icon="🏪" text="No merchants yet. Create one to get started." />
      ) : (
        <div className="merchant-grid">
          {merchants.map((m) => {
            const mLogs     = logs.filter((l) => l.client_id === m.clientId);
            const processed = mLogs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length;
            return (
              <div className="merchant-card" key={m._id}>
                <div className="merchant-card-top">
                  <div className="merchant-avatar">{initials(m.merchantName)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="merchant-name">{m.merchantName}</div>
                    <div className="merchant-meta">Created {fmt(m.createdAt)}</div>
                  </div>
                  <span className="tag tag-success">Active</span>
                </div>

                <div className="merchant-divider" />

                {[
                  ['Merchant ID',  m.merchantId],
                  ['Client ID',    m.clientId],
                  ['Username',     m.merchantUsername || '—'],
                  ['Callback URL', m.callbackUrl || '—'],
                ].map(([label, val]) => (
                  <div className="merchant-field" key={label}>
                    <span className="merchant-field-label">{label}</span>
                    <span className="merchant-field-val" title={val}>{val}</span>
                  </div>
                ))}

                <div className="merchant-divider" />

                <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--text3)' }}>
                  <span>Webhooks: <strong style={{ color: 'var(--text)' }}>{mLogs.length}</strong></span>
                  <span style={{ margin: '0 4px' }}>·</span>
                  <span>OK: <strong style={{ color: 'var(--success)' }}>{processed}</strong></span>
                  <span style={{ margin: '0 4px' }}>·</span>
                  <span>Fail: <strong style={{ color: 'var(--danger)' }}>{mLogs.length - processed}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
