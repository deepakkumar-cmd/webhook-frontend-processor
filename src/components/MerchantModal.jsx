import { useState } from 'react';
import { createMerchant } from '../api';
import { Spinner } from './Common';

const EMPTY = {
  merchantName: '',
  callbackUrl: '',
  merchantUsername: '',
  merchantId: '',
  clientId: '',
};

export default function MerchantModal({ onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.merchantName || !form.merchantId) return;
    setSaving(true);
    setError('');
    try {
      // Try real API first; fall back to local state on error
      const res = await createMerchant(form);
      onSave(res.data);
    } catch {
      // Backend merchant route not yet created → save locally
      onSave({ ...form, _id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Create New Merchant</div>
            <div className="text-xs text-muted" style={{ marginTop: 3 }}>
              Fill in the details to onboard a new merchant
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="login-error" style={{ marginBottom: 16 }}>⚠ {error}</div>
          )}
          <div className="form-grid">
            <div className="form-group">
              <label>Merchant Name *</label>
              <input
                value={form.merchantName}
                onChange={(e) => set('merchantName', e.target.value)}
                placeholder="e.g. TechPay Solutions"
              />
            </div>

            <div className="form-group">
              <label>Merchant ID *</label>
              <input
                value={form.merchantId}
                onChange={(e) => set('merchantId', e.target.value)}
                placeholder="e.g. TECH001"
              />
              <span className="form-hint">Unique identifier for this merchant</span>
            </div>

            <div className="form-group">
              <label>Merchant Username</label>
              <input
                value={form.merchantUsername}
                onChange={(e) => set('merchantUsername', e.target.value)}
                placeholder="e.g. techpay_user"
              />
            </div>

            <div className="form-group">
              <label>Client ID</label>
              <input
                value={form.clientId}
                onChange={(e) => set('clientId', e.target.value)}
                placeholder="e.g. CLI_TECH001"
              />
              <span className="form-hint">Matched against webhook client_id field</span>
            </div>

            <div className="form-group full">
              <label>Callback URL</label>
              <input
                value={form.callbackUrl}
                onChange={(e) => set('callbackUrl', e.target.value)}
                placeholder="https://yourdomain.com/webhook/callback"
              />
              <span className="form-hint">
                Endpoint where webhook payloads will be delivered
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !form.merchantName || !form.merchantId}
          >
            {saving ? <><Spinner /> Saving…</> : 'Create Merchant'}
          </button>
        </div>
      </div>
    </div>
  );
}
