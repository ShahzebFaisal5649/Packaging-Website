import React from 'react';
import styles from './Hero.module.css';

export default function Hero({ headline = 'What do you need designed?' }) {
  return (
    <section className={styles.hero} aria-label="Page heading">
      <div className="container">
        <h1 className={styles.headline}>{headline}</h1>
      </div>
    </section>
  );
}
