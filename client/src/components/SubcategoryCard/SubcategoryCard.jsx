import React from 'react';
import SaveBadge from '../SaveBadge/SaveBadge';
import styles from './SubcategoryCard.module.css';

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 10h6M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SubcategoryCard({ title, slug, price, description, isBundle, features = [], saveBadge }) {
  return (
    <a
      href={`/${slug}`}
      className={`${styles.card} ${isBundle ? styles.bundle : ''}`}
      aria-label={`${title} — ${price}`}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <p className={styles.price}>{price}</p>
        {description && <p className={styles.description}>{description}</p>}

        {isBundle && features.length > 0 && (
          <ul className={styles.features} aria-label="What's included">
            {features.map((f) => (
              <li key={f} className={styles.feature}>
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {saveBadge && (
        <div className={styles.badgeWrap}>
          <SaveBadge text={saveBadge} />
        </div>
      )}

      <div className={styles.arrow} aria-hidden="true">
        <ArrowIcon />
      </div>
    </a>
  );
}
