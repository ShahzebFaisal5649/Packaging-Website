import React from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import styles from './DesignShowcase.module.css';

export default function DesignShowcase({ images = [], isActive = true }) {
  const { index } = useCarousel(images.length, 3000, isActive);

  if (!images.length) return null;

  return (
    <div className={styles.showcase} aria-label="Design work showcase">
      <div className={styles.imageStack}>
        {images.map((img, i) => (
          <div
            key={img._id || img.src}
            className={`${styles.imageSlide} ${i === index ? styles.active : ''}`}
            aria-hidden={i !== index}
          >
            <img
              src={img.src}
              alt={img.alt || `Design by ${img.designerName}`}
              className={styles.image}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className={styles.attribution}>
              by {img.designerName}
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className={styles.dots} aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
