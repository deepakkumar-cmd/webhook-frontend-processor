// frontend/src/pages/LambdaWebhooksPage.jsx
import React, { useState } from 'react';
import { StatusTag, EmptyState } from '../components/Common';
import { fmt, shortId } from '../utils';
import { manualRetryWebhook } from '../api';

export default function LambdaWebhooksPage({ logs, merchants, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('ALL');
  const [expandedId, setExpanded] = useState(null);
  const [sending, setSending] = useState(null);
  const [toast, setToast] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const getMerchant = (clientId) => {
    if (!clientId) return null;
    let merchant = merchants.find((m) => m.clientId === clientId);
    if (!merchant) {
      merchant = merchants.find((m) => m.merchantUsername === clientId);
    }
    return merchant;
  };

  // Handle send callback
  const handleSendCallback = async (webhookId, event) => {
    event.stopPropagation();
    
    if (!window.confirm('Send callback to merchant now?')) {
      return;
    }
    
    setSending(webhookId);
    setToast(null);
    setErrorDetails(null);
    
    try {
      const response = await manualRetryWebhook(webhookId);
      
      if (response.success) {
        setToast({
          type: 'success',
          message: response.message || '✅ Callback sent successfully!'
        });
        
        setTimeout(() => {
          onRefresh();
          setToast(null);
          setSending(null);
        }, 2000);
      } else {
        // Show error with details
        const errorMsg = response.error || 'Failed to send callback';
        const details = response.details;
        
        setToast({
          type: 'error',
          message: `❌ ${errorMsg}`,
          details: details
        });
        
        // Store error details for modal display
        if (details) {
          setErrorDetails(details);
        }
        
        setTimeout(() => {
          setToast(null);
          setSending(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Send callback failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      const details = error.response?.data?.details;
      
      setToast({
        type: 'error',
        message: `❌ ${errorMsg}`,
        details: details
      });
      
      if (details) {
        setErrorDetails(details);
      }
      
      setTimeout(() => {
        setToast(null);
        setSending(null);
        setErrorDetails(null);
      }, 5000);
    }
  };

  // Filter only lambda/NSDL webhooks
  const lambdaLogs = Array.isArray(logs) ? logs.filter(log => 
    log.provider && (log.provider.toUpperCase().includes('NSDL') || 
                     log.provider.toUpperCase().includes('LAMBDA') ||
                     log.provider.toUpperCase().includes('AWS'))
  ) : [];

  const filtered = lambdaLogs.filter((l) => {
    const s = l.status || l.response?.status;
    const matchStatus = statusFilter === 'ALL' || s === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || 
      [l._id, l.webhook_id, l.external_ref_id, l.merchant_order_id, l.provider, l.client_id]
        .some((v) => v?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  // Get readable error message
  const getErrorMessage = (details) => {
    if (!details) return 'Unknown error';
    
    const errorCode = details.code;
    const errorMessage = details.message;
    
    if (errorCode === 'ECONNABORTED') {
      return '⏰ Timeout: Merchant did not respond within 30 seconds';
    }
    if (errorCode === 'ECONNREFUSED') {
      return '🔌 Connection Refused: Merchant server is not reachable';
    }
    if (errorCode === 'ENOTFOUND') {
      return '🌐 DNS Error: Merchant domain not found';
    }
    if (errorCode === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      return '🔒 SSL Error: SSL certificate verification failed. The merchant\'s SSL certificate is invalid.';
    }
    if (errorCode === 'MODULE_NOT_FOUND') {
      return '📦 Server Error: Missing dependency';
    }
    if (details.responseStatus) {
      return `📡 HTTP ${details.responseStatus}: ${errorMessage}`;
    }
    
    return errorMessage || 'Unknown error occurred';
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">{toast.type === 'success' ? '✓' : '✗'}</div>
          <div className="toast-content">
            <div className="toast-message">{toast.message}</div>
            {toast.details && (
              <div className="toast-details">
                <details>
                  <summary>View error details</summary>
                  <pre>{JSON.stringify(toast.details, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Error Details Modal */}
      {errorDetails && (
        <div className="modal-overlay" onClick={() => setErrorDetails(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❌ Callback Failed Details</h3>
              <button className="modal-close" onClick={() => setErrorDetails(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="error-detail-section">
                <h4>Error Summary</h4>
                <div className="error-message-box">
                  {getErrorMessage(errorDetails)}
                </div>
              </div>
              
              <div className="error-detail-section">
                <h4>Technical Details</h4>
                <pre className="error-details-pre">
                  {JSON.stringify(errorDetails, null, 2)}
                </pre>
              </div>

              <div className="error-detail-section">
                <h4>Possible Solutions</h4>
                <ul className="solutions-list">
                  {errorDetails.code === 'ECONNABORTED' && (
                    <>
                      <li>• Check if merchant server is responding slowly</li>
                      <li>• Increase timeout duration in the callback configuration</li>
                      <li>• Verify merchant server is not under heavy load</li>
                    </>
                  )}
                  {errorDetails.code === 'ECONNREFUSED' && (
                    <>
                      <li>• Verify merchant callback URL is correct</li>
                      <li>• Check if merchant server is running</li>
                      <li>• Ensure no firewall is blocking the connection</li>
                    </>
                  )}
                  {errorDetails.code === 'ENOTFOUND' && (
                    <>
                      <li>• Check if the merchant domain name is correct</li>
                      <li>• Verify DNS resolution is working</li>
                      <li>• Check if the domain has expired</li>
                    </>
                  )}
                  {errorDetails.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' && (
                    <>
                      <li>• Merchant needs to fix their SSL certificate</li>
                      <li>• Certificate may be self-signed or expired</li>
                      <li>• Contact merchant to update their SSL certificate</li>
                    </>
                  )}
                  {errorDetails.responseStatus && (
                    <>
                      <li>• Merchant server returned HTTP {errorDetails.responseStatus}</li>
                      <li>• Check the response data for specific error message</li>
                      <li>• Verify the webhook payload format matches merchant expectations</li>
                    </>
                  )}
                  {!errorDetails.code && !errorDetails.responseStatus && (
                    <>
                      <li>• Check network connectivity</li>
                      <li>• Verify merchant callback URL is accessible</li>
                      <li>• Try again later</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setErrorDetails(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-header mb-4">
        <div>
          <div className="card-title">Lambda Webhook Logs</div>
          <div className="card-subtitle">
            {lambdaLogs.length} total lambda/NSDL webhooks
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh</button>
      </div>

      <div className="filter-bar mb-4">
        <div className="search-box">
          <span style={{ color: 'var(--text3)', fontSize: 15 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, provider, order ref…"
          />
        </div>
        {['ALL', 'PROCESSED', 'FAILED', 'PENDING', 'CALLBACK_FAILED'].map((s) => (
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
          <table className="data-table">
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
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
                    No lambda webhooks found
                  </td>
                </tr>
              )}

              {filtered.map((log) => {
                const merchant = getMerchant(log.client_id);
                const expanded = expandedId === log._id;
                const status = log.status || log.response?.status;
                const isFailed = status === 'CALLBACK_FAILED' || status === 'FAILED';
                const isSending = sending === log._id;

                return (
                  <React.Fragment key={log._id}>
                    <tr onClick={() => setExpanded(expanded ? null : log._id)} style={{ cursor: 'pointer' }}>
                      <td><span className="mono truncate">{shortId(log._id)}</span></td>
                      <td><span className="tag tag-blue">{log.provider}</span></td>
                      <td>
                        {merchant ? (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{merchant.merchantName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                              {merchant.merchantUsername}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="tag tag-warning">Unknown</span>
                            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                              ID: {log.client_id || '—'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td><span className="mono">{log.merchant_order_id}</span></td>
                      <td><span className="mono">{log.external_ref_id}</span></td>
                      <td><StatusTag status={status} /></td>
                      <td><span className="mono">{log.retry_count}</span></td>
                      <td style={{ color: 'var(--text3)', fontSize: 12 }}>{fmt(log.received_at)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {isFailed && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => handleSendCallback(log._id, e)}
                            disabled={isSending}
                            style={{
                              padding: '6px 16px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {isSending ? (
                              <><span className="spinner-small"></span> Sending...</>
                            ) : (
                              '📤 Send Callback'
                            )}
                          </button>
                        )}
                        {!isFailed && status === 'PROCESSED' && (
                          <span className="tag tag-success" style={{ fontSize: '11px' }}>
                            ✓ Completed
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text3)' }}>{expanded ? '▴' : '▾'}</td>
                    </tr>

                    {expanded && (
                      <tr key={`${log._id}-detail`}>
                        <td colSpan={10} style={{ padding: '0 14px 14px', background: 'var(--bg3)' }}>
                          <div className="detail-drawer">
                            <div className="detail-grid">
                              {[
                                ['Webhook ID', log.webhook_id],
                                ['Document ID', log._id],
                                ['Provider', log.provider],
                                ['Client ID', log.client_id],
                                ['Merchant Name', merchant?.merchantName || 'Unknown'],
                                ['Merchant Username', merchant?.merchantUsername || 'Not found'],
                                ['Callback URL', merchant?.callbackUrl || 'Not configured'],
                                ['External Ref ID', log.external_ref_id],
                                ['Merchant Order ID', log.merchant_order_id],
                                ['Status', status],
                                ['Retry Count', log.retry_count],
                                ['Received At', fmt(log.received_at)],
                                ['Last Attempt', fmt(log.last_attempt_at)],
                                ['Processed At', fmt(log.processed_at)],
                              ].map(([k, v]) => (
                                <div className="detail-item" key={k}>
                                  <div className="detail-key">{k}</div>
                                  <div className="detail-val">{v ?? '—'}</div>
                                </div>
                              ))}
                              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                <div className="detail-key">Message</div>
                                <div className="detail-val" style={{ color: status === 'FAILED' ? 'var(--danger)' : 'var(--success)' }}>
                                  {log.error_message || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 400px;
          background: white;
        }
        .toast-success {
          background: #10b981;
          color: white;
        }
        .toast-error {
          background: #ef4444;
          color: white;
        }
        .toast-content {
          flex: 1;
        }
        .toast-message {
          font-size: 14px;
          font-weight: 500;
        }
        .toast-details {
          margin-top: 8px;
          font-size: 12px;
        }
        .toast-details summary {
          cursor: pointer;
          opacity: 0.8;
        }
        .toast-details pre {
          margin-top: 8px;
          padding: 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          font-size: 11px;
          overflow-x: auto;
        }
        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
          padding: 0;
          line-height: 1;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow: auto;
        }
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          padding: 20px;
        }
        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }
        .error-detail-section {
          margin-bottom: 20px;
        }
        .error-detail-section h4 {
          margin: 0 0 10px 0;
          color: #374151;
        }
        .error-message-box {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 12px;
          border-radius: 4px;
          color: #991b1b;
        }
        .error-details-pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 12px;
        }
        .solutions-list {
          margin: 0;
          padding-left: 20px;
          color: #4b5563;
        }
        .solutions-list li {
          margin: 8px 0;
        }
        .spinner-small {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.6s linear infinite;
          margin-right: 6px;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}