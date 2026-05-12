// Reusable Pagination component
// Usage: <Pagination total={list.length} page={page} perPage={10} onChange={p => setPage(p)} />

const G = '#1A4D2E';
const BTN = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 36, minHeight: 36, borderRadius: 8, border: '1px solid #e8e3da',
  background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  padding: '4px 10px', transition: 'all 0.15s',
};

export default function Pagination({ total = 0, page = 1, perPage = 10, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const range = 2;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: '20px 0', flexWrap: 'wrap',
    }}>
      {/* Prev */}
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        style={{ ...BTN, color: page === 1 ? '#ccc' : G, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} style={{ padding: '4px 2px', color: '#aaa', fontSize: 13, minWidth: 20, textAlign: 'center' }}>…</span>
          : (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                ...BTN,
                border: `1px solid ${p === page ? G : '#e8e3da'}`,
                background: p === page ? G : '#fff',
                color: p === page ? '#fff' : '#555',
                fontWeight: p === page ? 700 : 400,
                minWidth: 36,
              }}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
      )}

      {/* Next */}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        style={{ ...BTN, color: page === totalPages ? '#ccc' : G, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        aria-label="Next page"
      >
        Next →
      </button>

      <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4, whiteSpace: 'nowrap' }}>
        Page {page} of {totalPages} · {total} total
      </span>
    </div>
  );
}
