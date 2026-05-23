// frontend/src/components/MerchantModal.jsx
import { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const SpinnerIcon = () => (
  <span className="mm-spinner" />
);

const fields = [
  {
    key: 'merchantName',
    label: 'Merchant Name',
    placeholder: 'e.g. TechPay Solutions Pvt Ltd',
    hint: 'Full legal or display name of the merchant.',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l1-5h16l1 5"/>
        <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
        <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
      </svg>
    ),
  },
  {
    key: 'merchantUsername',
    label: 'Username',
    placeholder: 'e.g. techpay_user',
    hint: 'Unique identifier used for login. No spaces.',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    key: 'clientId',
    label: 'Client ID',
    placeholder: 'e.g. CLI_TECH001',
    hint: 'Must match the client_id in webhook logs exactly. Unique per merchant.',
    transform: (v) => v.toUpperCase(),
    mono: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
        <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
      </svg>
    ),
  },
  {
    key: 'callbackUrl',
    label: 'Callback URL',
    placeholder: 'https://your-domain.com/webhook',
    hint: 'Webhook payloads will be POST-ed to this URL.',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
];

export default function MerchantModal({ onClose, onSave, initialData, loading }) {
  const [form, setForm] = useState({
    merchantName: '',
    merchantUsername: '',
    clientId: '',
    callbackUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        merchantName: initialData.merchantName || '',
        merchantUsername: initialData.merchantUsername || '',
        clientId: initialData.clientId || '',
        callbackUrl: initialData.callbackUrl || '',
      });
    }
  }, [initialData]);

  const validateField = (key, value) => {
    if (!value.trim()) return 'This field is required';
    if (key === 'callbackUrl' && !/^https?:\/\//.test(value))
      return 'Must start with http:// or https://';
    return null;
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach(({ key }) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map(f => [f.key, true])));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key, value, transform) => {
    const val = transform ? transform(value) : value;
    setForm(prev => ({ ...prev, [key]: val }));
    if (touched[key]) {
      const err = validateField(key, val);
      setErrors(prev => ({ ...prev, [key]: err }));
    }
  };

  const handleBlur = (key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const err = validateField(key, form[key]);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className="mm-backdrop" onClick={onClose}>
      <div className="mm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="mm-header">
          <div className="mm-header-left">
            <div className="mm-header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isEdit
                  ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></>
                  : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
                }
              </svg>
            </div>
            <div>
              <div className="mm-title">{isEdit ? 'Edit Merchant' : 'Add Merchant'}</div>
              <div className="mm-subtitle">{isEdit ? `Editing ${initialData.merchantName}` : 'Register a new payment merchant'}</div>
            </div>
          </div>
          <button className="mm-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Body */}
        <div className="mm-body">
          {fields.map(({ key, label, placeholder, hint, icon, transform, mono }) => {
            const hasError = touched[key] && errors[key];
            const isValid = touched[key] && !errors[key] && form[key].trim();
            return (
              <div className={`mm-field ${hasError ? 'mm-field-error' : ''} ${isValid ? 'mm-field-valid' : ''}`} key={key}>
                <label className="mm-label">
                  <span className="mm-label-icon">{icon}</span>
                  {label}
                  <span className="mm-required">*</span>
                </label>
                <div className="mm-input-wrap">
                  <input
                    className={`mm-input ${mono ? 'mm-input-mono' : ''}`}
                    value={form[key]}
                    onChange={e => handleChange(key, e.target.value, transform)}
                    onBlur={() => handleBlur(key)}
                    placeholder={placeholder}
                    autoFocus={key === 'merchantName'}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {isValid && (
                    <span className="mm-valid-icon"><CheckIcon /></span>
                  )}
                </div>
                {hasError
                  ? <div className="mm-error">{errors[key]}</div>
                  : <div className="mm-hint">{hint}</div>
                }
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mm-footer">
          <button className="mm-btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="mm-btn-save" onClick={handleSubmit} disabled={loading}>
            {loading ? <><SpinnerIcon /> Saving…</> : <><CheckIcon /> {isEdit ? 'Update Merchant' : 'Create Merchant'}</>}
          </button>
        </div>

      </div>
    </div>
  );
}