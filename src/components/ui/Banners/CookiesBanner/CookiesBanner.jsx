'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MdCookie } from 'react-icons/md';
import { FiSettings, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { useCookies } from '@/context/CookiesContext';
import styles from './CookiesBanner.module.css';

const DEFAULT_PREFS = { necessary: true, analytics: false };

export default function CookiesBanner() {
  const { bannerVisible, saveConsent } = useCookies();
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          className={styles.wrapper}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          role="dialog"
          aria-modal="false"
          aria-label="Aviso de cookies"
        >
          <div className={styles.banner}>

            <div className={styles.header}>
              <span className={styles.cookieIcon} aria-hidden="true">
                <MdCookie />
              </span>
              <div>
                <p className={styles.title}>Hygge Rug usa cookies</p>
                <p className={styles.subtitle}>Para que todo funcione y podamos mejorar</p>
              </div>
            </div>

            <p className={styles.description}>
              Usamos cookies <strong>necesarias</strong> para el carrito y tu sesión. Con tu
              permiso, también usamos cookies <strong>analíticas</strong> para entender cómo
              mejorar la web.{' '}
              <Link href="/legal/cookies" className={styles.link}>
                Ver política de cookies
              </Link>
              .
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className={styles.preferences}>
                    <ToggleRow
                      label="Necesarias"
                      description="Sesión de usuario y carrito de compra. Sin estas la web no funciona."
                      checked={true}
                      disabled={true}
                    />
                    <ToggleRow
                      label="Analíticas"
                      description="Google Analytics para entender cómo se navega y mejorar la experiencia."
                      checked={prefs.analytics}
                      onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.actions}>
              <button
                className={styles.manageBtn}
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
              >
                <FiSettings size={13} />
                Personalizar
                {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
              </button>

              <div className={styles.mainActions}>
                <button
                  className={styles.rejectBtn}
                  onClick={() => saveConsent({ necessary: true, analytics: false })}
                >
                  Solo esenciales
                </button>
                <button
                  className={styles.acceptBtn}
                  onClick={() =>
                    expanded
                      ? saveConsent(prefs)
                      : saveConsent({ necessary: true, analytics: true })
                  }
                >
                  {expanded ? 'Guardar preferencias' : 'Aceptar todo'}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({ label, description, checked, disabled, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleDesc}>{description}</span>
        {disabled && <span className={styles.alwaysOn}>Siempre activas</span>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'activadas' : 'desactivadas'}`}
        disabled={disabled}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''} ${disabled ? styles.toggleDisabled : ''}`}
        onClick={() => onChange && onChange(!checked)}
      />
    </div>
  );
}
