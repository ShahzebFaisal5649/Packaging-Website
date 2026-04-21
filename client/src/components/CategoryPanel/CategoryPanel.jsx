import React from 'react';
import SubcategoryCard from '../SubcategoryCard/SubcategoryCard';
import DesignShowcase from '../DesignShowcase/DesignShowcase';
import styles from './CategoryPanel.module.css';

export default function CategoryPanel({ category, isActive }) {
  return (
    <section
      id={`panel-${category.slug}`}
      role="tabpanel"
      aria-labelledby={`tab-${category.slug}`}
      aria-hidden={!isActive}
      className={`${styles.panel} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.inner}>
        {/* Left: subcategory cards */}
        <div className={styles.list}>
          {category.subcategories?.map((sub) => (
            <SubcategoryCard
              key={sub._id || sub.slug}
              title={sub.title}
              slug={sub.slug}
              price={sub.price}
              description={sub.description}
              isBundle={sub.isBundle}
              features={sub.features}
              saveBadge={sub.saveBadge}
            />
          ))}
        </div>

        {/* Right: sticky image showcase */}
        <div className={styles.showcase}>
          <DesignShowcase
            images={category.showcaseImages || []}
            isActive={isActive}
          />
        </div>
      </div>
    </section>
  );
}
