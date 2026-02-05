import Link from 'next/link';
import Logo from '@/components/common/Logo/Logo';
import styles from './auth.module.css';

/**
 * Layout centrado para login y registro
 * Sin Header ni Footer completos, solo logo
 */
export default function AuthLayout({ children }) {
  return (
    <div className={styles.authLayout}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>
          <Logo noLink={true} />
          <h1>Hygge Rug</h1>
        </Link>
      </div>
      
      <main className={styles.authMain}>
        {children}
      </main>

      <footer className={styles.authFooter}>
        <p>© 2026 Hygge Rug Inc. Hecho con amor (y lana).</p>
      </footer>
    </div>
  );
}

