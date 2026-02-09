import React from 'react';
import Link from 'next/link';
import styles from './Logo.module.css';

function Logo({ size = 80, noLink = false, animated = true }) {
  const Content = (
    <div className={`${styles.logoContainer} ${animated ? styles.animated : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className={styles.sealSvg}>
        <path id="logoCirclePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0 " fill="none" />
        <text fill="var(--highlight-text)" fontSize="7.5" fontWeight="900">
          <textPath xlinkHref="#logoCirclePath">
            CALIDAD PREMIUM • HECHO A MANO EN MADRID • HYGGE RUG •
          </textPath>
        </text>
      </svg>
      <div className={styles.sealCenter}>HR</div>
    </div>
  );

  if (noLink) {
    return Content;
  }

  return (
    <Link href="/" className={styles.logoLink}>
      {Content}
    </Link>
  );
}

export default Logo;