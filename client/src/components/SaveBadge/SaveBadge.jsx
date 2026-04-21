import React from 'react';

const style = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 8px',
  backgroundColor: 'var(--color-save)',
  color: 'var(--color-save-text)',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 700,
  borderRadius: 'var(--radius-sm)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export default function SaveBadge({ text }) {
  if (!text) return null;
  return <span style={style} aria-label={`Savings: ${text}`}>{text}</span>;
}
