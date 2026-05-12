import { Component } from 'react';

const G = '#1A4D2E';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught:', error, info);
    // Auto-reload on chunk loading failures (stale deploy)
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed');
    if (isChunkError && !sessionStorage.getItem('chunk_reload')) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
    } else {
      sessionStorage.removeItem('chunk_reload');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', padding: '2rem',
          textAlign: 'center', backgroundColor: '#F5F2ED',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: G, marginBottom: 8, fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontFamily: '"Playfair Display", serif' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: 28, maxWidth: 420, lineHeight: 1.6, fontSize: 15 }}>
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ padding: '11px 28px', background: G, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Try Again
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              style={{ padding: '11px 28px', background: '#fff', color: G, border: `1.5px solid ${G}`, borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Go Home
            </button>
          </div>
          {/* Dev-only error details */}
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: 28, fontSize: 11, color: '#999', maxWidth: 600,
              textAlign: 'left', overflowX: 'auto', background: '#fff',
              padding: '12px 16px', borderRadius: 8, border: '1px solid #eee',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
