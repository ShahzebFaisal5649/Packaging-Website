import React, { useEffect, useRef, useState } from 'react';
import styles from './CategoryTabBar.module.css';

export default function CategoryTabBar({ tabs, activeTabId, onTabChange }) {
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Measure the active tab button and position the indicator
  useEffect(() => {
    const el = tabRefs.current[activeTabId];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTabId, tabs]);

  // On initial render wait for DOM paint before measuring
  useEffect(() => {
    const el = tabRefs.current[tabs[0]?.slug];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [tabs]);

  return (
    <div className={styles.wrapper} role="navigation" aria-label="Design categories">
      <div className={`container ${styles.inner}`}>
        <div className={styles.tabList} role="tablist" aria-orientation="horizontal">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={tab.slug === activeTabId}
              aria-controls={`panel-${tab.slug}`}
              id={`tab-${tab.slug}`}
              ref={(el) => { if (el) tabRefs.current[tab.slug] = el; }}
              className={`${styles.tab} ${tab.slug === activeTabId ? styles.active : ''}`}
              onClick={() => onTabChange(tab.slug)}
            >
              {tab.label}
            </button>
          ))}

          {/* Sliding underline indicator */}
          <span
            className={styles.indicator}
            style={{ left: indicator.left, width: indicator.width }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
