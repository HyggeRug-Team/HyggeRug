'use client';
import { useCookies } from '@/context/CookiesContext';
import styles from './GestionarCookiesBtn.module.css';

export default function GestionarCookiesBtn() {
  const { openBanner } = useCookies();

  return (
    <button className={styles.btn} onClick={openBanner}>
      Gestionar mis preferencias de cookies
    </button>
  );
}
