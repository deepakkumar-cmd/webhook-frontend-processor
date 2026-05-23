// frontend/src/pages/MerchantsPage.jsx
import { useState } from 'react';
import MerchantModal from '../components/MerchantModal';
import { initials, fmt } from '../utils';
import { EmptyState } from '../components/Common';
import { createMerchant, deleteMerchant, updateMerchant } from '../api';

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const WebhookIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 10a4 4 0 1 0 0-4 4 4 0 0 0 0 4z"/><path d="M13 6H7a4 4 0 0 0 0 8h1"/>
    <path d="M11 14a4 4 0 1 0 0 4 4 4 0 0 0 0-4z"/><path d="M11 18h6a4 4 0 0 0 0-8h-1"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const UserIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const HashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

export default function MerchantsPage({ merchants, setMerchants, logs, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = async (merchantData) => {
    setLoading(true);
    try {
      if (editingMerchant) {
        const response = await updateMerchant(editingMerchant._id, merchantData);
        if (response.success) { await onRefresh(); }
        else { alert(response.error || 'Failed to update merchant'); }
      } else {
        const response = await createMerchant(merchantData);
        if (response.success) { await onRefresh(); }
        else { alert(response.error || 'Failed to create merchant'); }
      }
      setShowModal(false);
      setEditingMerchant(null);
    } catch (error) {
      alert(error.response?.data?.error || error.message || 'Failed to save merchant');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (merchant) => {
    if (!window.confirm(`Delete ${merchant.merchantName}? This will also delete all associated webhook logs.`)) return;
    setDeletingId(merchant._id);
    try {
      const response = await deleteMerchant(merchant._id);
      if (response.success) { await onRefresh(); }
      else { alert(response.error || 'Failed to delete merchant'); }
    } catch (error) {
      alert(error.response?.data?.error || error.message || 'Failed to delete merchant');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (merchant) => { setEditingMerchant(merchant); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingMerchant(null); };

  return (
    <>
      {showModal && (
        <MerchantModal
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editingMerchant}
          loading={loading}
        />
      )}

      {/* Page Header */}
      <div className="merchants-header">
        <div className="merchants-header-left">
          <h2 className="merchants-title">Merchants</h2>
          <span className="merchants-count-badge">{merchants.length} registered</span>
        </div>
        <button className="btn btn-primary merchants-add-btn" onClick={() => setShowModal(true)}>
          <PlusIcon /> Add Merchant
        </button>
      </div>

      {merchants.length === 0 ? (
        <div className="merchants-empty">
          <div className="merchants-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.3}}>
              <path d="M3 9l1-5h16l1 5"/><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
              <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
            </svg>
          </div>
          <p className="merchants-empty-text">No merchants yet</p>
          <p className="merchants-empty-sub">Add your first merchant to get started</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={() => setShowModal(true)}>
            <PlusIcon /> Add Merchant
          </button>
        </div>
      ) : (
        <div className="merchant-grid">
          {merchants.map((m) => {
            const mLogs = logs.filter((l) =>
              l.client_id === m.clientId || l.client_id === m.merchantUsername
            );
            const processed = mLogs.filter((l) => (l.status || l.response?.status) === 'PROCESSED').length;
            const failed = mLogs.length - processed;
            const successRate = mLogs.length > 0 ? Math.round((processed / mLogs.length) * 100) : null;

            return (
              <div className="merchant-card" key={m._id}>
                {/* Card Top */}
                <div className="mc-top">
                  <div className="merchant-avatar">{initials(m.merchantName)}</div>
                  <div className="mc-info">
                    <div className="merchant-name">{m.merchantName}</div>
                    <div className="merchant-meta">Created {fmt(m.createdAt)}</div>
                  </div>
                  <div className="mc-actions">
                    <button
                      className="mc-btn mc-btn-edit"
                      onClick={() => handleEdit(m)}
                      title="Edit merchant"
                    >
                      <EditIcon />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`mc-btn mc-btn-delete ${deletingId === m._id ? 'mc-btn-deleting' : ''}`}
                      onClick={() => handleDelete(m)}
                      title="Delete merchant"
                      disabled={deletingId === m._id}
                    >
                      {deletingId === m._id
                        ? <div className="mc-spinner" />
                        : <TrashIcon />
                      }
                    </button>
                  </div>
                </div>

                <div className="mc-divider" />

                {/* Fields */}
                <div className="mc-fields">
                  <div className="mc-field">
                    <span className="mc-field-icon"><HashIcon /></span>
                    <span className="mc-field-label">Client ID</span>
                    <span className="mc-field-val">{m.clientId}</span>
                  </div>
                  <div className="mc-field">
                    <span className="mc-field-icon"><UserIcon /></span>
                    <span className="mc-field-label">Username</span>
                    <span className="mc-field-val">{m.merchantUsername || '—'}</span>
                  </div>
                  <div className="mc-field">
                    <span className="mc-field-icon"><LinkIcon /></span>
                    <span className="mc-field-label">Callback URL</span>
                    <span className="mc-field-val mc-field-url" title={m.callbackUrl}>{m.callbackUrl || '—'}</span>
                  </div>
                </div>

                <div className="mc-divider" />

                {/* Stats footer */}
                <div className="mc-stats">
                  <div className="mc-stat">
                    <span className="mc-stat-icon"><WebhookIcon /></span>
                    <span className="mc-stat-label">Total</span>
                    <span className="mc-stat-val">{mLogs.length}</span>
                  </div>
                  <div className="mc-stat-divider" />
                  <div className="mc-stat">
                    <span className="mc-stat-dot mc-dot-success" />
                    <span className="mc-stat-label">OK</span>
                    <span className="mc-stat-val mc-val-success">{processed}</span>
                  </div>
                  <div className="mc-stat-divider" />
                  <div className="mc-stat">
                    <span className="mc-stat-dot mc-dot-danger" />
                    <span className="mc-stat-label">Fail</span>
                    <span className="mc-stat-val mc-val-danger">{failed}</span>
                  </div>
                  {successRate !== null && (
                    <>
                      <div className="mc-stat-divider" />
                      <div className="mc-stat">
                        <span className="mc-stat-label">Rate</span>
                        <span className={`mc-stat-val ${successRate >= 80 ? 'mc-val-success' : successRate >= 50 ? 'mc-val-warn' : 'mc-val-danger'}`}>
                          {successRate}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}