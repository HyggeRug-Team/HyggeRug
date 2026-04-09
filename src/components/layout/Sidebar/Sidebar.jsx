/**
 * @file Sidebar.jsx
 * @description Estructura lateral interactiva (shell) para el panel de control.
 *
 * [Nuestro enfoque]
 * Hemos diseñado este componente como la “columna vertebral” de la zona privada:
 * en escritorio permanece fijo a la izquierda, y en móvil/tablet se oculta hasta que el
 * usuario abre el menú con la “hamburguesa”.
 *
 * Además, añadimos el “indicador de lectura” para avisar si hay más contenido al hacer scroll.
 *
 * [Por qué lo hemos hecho así]
 * Elegimos este enfoque porque mejora la usabilidad del panel y evita que la navegación
 * se convierta en un bloque pesado o difícil de encontrar.
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

  // Cerramos el menú lateral automáticamente si el usuario cambia de página
  useEffect(() => {
    const t = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Bloqueamos el scroll del fondo mientras el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Esta función comprueba si todavía queda texto o enlaces por ver hacia abajo
  const checkScroll = useCallback(() => {
    const el = topSectionRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setHasMoreBelow(distanceToBottom > 8); 
  }, []);

  useEffect(() => {
    const el = topSectionRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    
    // Si cambiamos el tamaño de la ventana, volvemos a calcularlo
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <>
      {/* Botón de apertura lateral (solo en móviles) */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerHidden : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <FaBars size={20} />
      </button>

      {/* Sombra de fondo para cuando el menú está abierto en móvil */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayVisible}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Contenedor principal del menú lateral */}
      <div className={`${styles.sidebarContent} ${isOpen ? styles.open : ""}`}>

        {/* Botón para cerrar el menú lateral en móvil */}
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          <FaXmark size={20} />
        </button>

        <div className={styles.topSectionWrapper}>
          <div
            className={styles.topSection}
            ref={topSectionRef}
          >
            {children}
          </div>

          {/* Flecha indicadora que avisa si hay más contenido abajo */}
          <div
            className={`${styles.scrollFade} ${hasMoreBelow ? styles.scrollFadeVisible : ""}`}
            aria-hidden="true"
          >
            <FaChevronDown className={styles.scrollFadeIcon} size={12} />
          </div>
        </div>

        {/* Espacio reservado para acciones finales, como Cerrar Sesión */}
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
