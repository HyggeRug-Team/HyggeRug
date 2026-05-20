'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CookiesContext = createContext(null);

const CONSENT_KEY = 'hyggerug_cookie_consent';
const CONSENT_MAX_AGE_MS = 13 * 30 * 24 * 60 * 60 * 1000; // 13 meses (AEPD)

export function CookiesProvider({ children }) {
  const [consent, setConsent] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setBannerVisible(true);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      const expired = !parsed.timestamp || Date.now() - parsed.timestamp > CONSENT_MAX_AGE_MS;
      if (expired) {
        localStorage.removeItem(CONSENT_KEY);
        setBannerVisible(true);
      } else {
        setConsent(parsed);
      }
    } catch {
      setBannerVisible(true);
    }
  }, []);

  const saveConsent = useCallback((newConsent) => {
    const full = { ...newConsent, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
    setConsent(full);
    setBannerVisible(false);
    // Preparado para Google Analytics: actualiza el consentimiento si GA está cargado
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: newConsent.analytics ? 'granted' : 'denied',
      });
    }
  }, []);

  const openBanner = useCallback(() => setBannerVisible(true), []);

  return (
    <CookiesContext.Provider value={{ consent, saveConsent, bannerVisible, openBanner }}>
      {children}
    </CookiesContext.Provider>
  );
}

export function useCookies() {
  return useContext(CookiesContext);
}
