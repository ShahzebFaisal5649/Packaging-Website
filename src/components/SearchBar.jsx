import { useState, useEffect } from 'react';

/**
 * Reusable debounced search bar.
 *
 * Props:
 *   placeholder  – string
 *   onSearch     – callback(query: string)
 *   debounce     – ms delay (default 300)
 *   style        – additional container style
 *   initialValue – optional initial value
 */
export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  debounce = 300,
  style = {},
  initialValue = '',
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const t = setTimeout(() => onSearch?.(value.trim()), debounce);
    return () => clearTimeout(t);
  }, [value, debounce]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {/* Search icon */}
      <span style={{
        position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
        color: '#aaa', fontSize: 15, pointerEvents: 'none', lineHeight: 1,
      }}>🔍</span>

      <input
        type="text"
        id="search-bar-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 36px 10px 34px',
          border: '1.5px solid #e8e3da', borderRadius: 9,
          fontSize: 13, outline: 'none', background: '#fff',
          transition: 'border-color 0.15s', boxSizing: 'border-box',
          minHeight: 44, fontFamily: '"DM Sans", sans-serif',
        }}
        onFocus={e => { e.target.style.borderColor = '#1A4D2E'; }}
        onBlur={e => { e.target.style.borderColor = '#e8e3da'; }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
            fontSize: 18, lineHeight: 1, padding: 2,
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
