// StatusTag
export function StatusTag({ status }) {
  const map = {
    PROCESSED: 'tag-success',
    FAILED:    'tag-danger',
    PENDING:   'tag-warning',
  };
  return <span className={`tag ${map[status] || 'tag-blue'}`}>{status || '—'}</span>;
}

// Spinner
export function Spinner({ size = 16, color = '#fff' }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size, borderTopColor: color }}
    />
  );
}

// Empty state
export function EmptyState({ icon = '📭', text = 'No data found.' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div>{text}</div>
    </div>
  );
}
