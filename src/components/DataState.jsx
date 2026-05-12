/**
 * Shared UI states for loading/error/empty — use instead of raw spinners.
 *
 * Usage:
 *   import { LoadingSkeleton, ErrorState, EmptyState } from '../components/DataState';
 */

const shimmer = `@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

/** Animated skeleton rows while data is loading */
export function LoadingSkeleton({ rows = 4, height = 20 }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <style>{shimmer}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            borderRadius: 6,
            marginBottom: 12,
            background: 'linear-gradient(90deg, #f0ece4 25%, #e8e3da 50%, #f0ece4 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            width: `${[100, 78, 88, 65][i % 4]}%`,
          }}
        />
      ))}
    </div>
  );
}

/** Error state with optional retry button */
export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#888' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
      <p style={{ marginBottom: onRetry ? 16 : 0, fontSize: 15, color: '#555', maxWidth: 380, margin: '0 auto 16px' }}>
        {message || 'Failed to load data. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '9px 22px', background: '#1A4D2E', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/** Empty state when a list is empty */
export function EmptyState({ message = 'No data found.', icon = '📭' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#aaa' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 15, color: '#888' }}>{message}</p>
    </div>
  );
}

/** Full-page spinner */
export function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #e8e3da',
        borderTopColor: '#1A4D2E',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 13, color: '#888', fontFamily: '"DM Sans", sans-serif' }}>Loading…</span>
    </div>
  );
}
