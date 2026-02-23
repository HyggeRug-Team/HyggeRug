/*
 * Componente: Sidebar (Shell Genérico)
 *
 * Gestiona únicamente la estructura responsive del sidebar:
 *   - Desktop:  visible fijo con ancho completo
 *   - Tablet:   colapsado (solo iconos)
 *   - Móvil:    drawer lateral con hamburger, overlay y botón de cierre
 *
 * Props:
 *   children  — Contenido principal del sidebar (logo, nav, etc.)
 *   footer    — Slot opcional para la sección inferior (logout, perfil, etc.)
 */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Sidebar.module.css";
import { usePathname } from "next/navigation";
import { FaBars, FaXmark, FaChevronDown } from "react-icons/fa6";

function Sidebar({ children, footer }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Controla si hay más contenido por debajo (scroll hint)
  const [hasMoreBelow, setHasMoreBelow] = useState(false);
  const topSectionRef = useRef(null);

  // Cerramos el drawer al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bloqueamos el scroll del body mientras el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Detectamos si el topSection tiene contenido oculto debajo
  const checkScroll = useCallback(() => {
    const el = topSectionRef.current;
    if (!el) return;
    // Hay más si la diferencia entre scrollHeight y scrollTop es mayor que clientHeight
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setHasMoreBelow(distanceToBottom > 8); // margen de 8px para evitar flickering
  }, []);

  useEffect(() => {
    const el = topSectionRef.current;
    if (!el) return;
    // Comprobamos al montar
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    // También recomprobamos si cambia el tamaño
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <>
      {/* ── Botón hamburger (visible solo en móvil) ── */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerHidden : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <FaBars size={20} />
      </button>

      {/* ── Overlay oscuro (activo en móvil con drawer abierto) ── */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayVisible}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Panel principal ── */}
      <div className={`${styles.sidebarContent} ${isOpen ? styles.open : ""}`}>

        {/* Botón de cierre (solo visible en drawer móvil) */}
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          <FaXmark size={20} />
        </button>

        {/* ── Wrapper del scroll con el fade hint ── */}
        <div className={styles.topSectionWrapper}>

          {/* ── Sección principal: cualquier contenido ── */}
          <div
            className={styles.topSection}
            ref={topSectionRef}
          >
            {children}
          </div>

          {/* ── Fade + indicador "hay más" ── */}
          <div
            className={`${styles.scrollFade} ${hasMoreBelow ? styles.scrollFadeVisible : ""}`}
            aria-hidden="true"
          >
            <FaChevronDown className={styles.scrollFadeIcon} size={12} />
          </div>

        </div>

        {/* ── Sección inferior opcional (logout, perfil…) ── */}
        {footer && (
          <div className={styles.footerSection}>
            {footer}
          </div>
        )}

      </div>
    </>
  );
}

export default Sidebar;
