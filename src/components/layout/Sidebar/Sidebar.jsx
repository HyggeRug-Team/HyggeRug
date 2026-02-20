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

import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { usePathname } from "next/navigation";
import { FaBars, FaXmark } from "react-icons/fa6";

function Sidebar({ children, footer }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Cerramos el drawer al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bloqueamos el scroll del body mientras el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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

        {/* ── Sección principal: cualquier contenido ── */}
        <div className={styles.topSection}>
          {children}
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
