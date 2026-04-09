import Link from 'next/link';
import Logo from "@/components/ui/Logo/Logo";
import styles from './auth.module.css';

/**
 * @file layout.jsx (Auth Layout)
 * @description Layout centrado para las páginas de login y registro.
 *
 * [Nuestro enfoque]
 * Hemos mantenido el acceso (auth) lo más “limpio” posible: solo mostramos el logo y el
 * formulario, sin barras extra ni elementos que distraigan.
 *
 * [Por qué lo hemos hecho así]
 * Porque el objetivo en esta zona es que el usuario entienda rápido qué debe hacer
 * y complete el login/registro con menos fricción.
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

