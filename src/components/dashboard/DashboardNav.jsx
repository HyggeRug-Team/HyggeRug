/*
 * Componente: DashboardNav
 * Descripción: Contenido de navegación específico del Dashboard.
 *   - Logo (completo en desktop, compacto en tablet)
 *   - Links de navegación con estado activo
 *   - Sección inferior con avatar, nombre y popup de logout (tablet)
 *
 * Se usa como children/footer del componente Sidebar genérico.
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/components/layout/Sidebar/Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBookOpen,
  FaUser,
  FaBagShopping,
  FaArrowRotateLeft,
  FaLocationDot,
  FaCreditCard,
  FaHeart,
  FaBell,
  FaQuestion,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import Logo from "@/components/ui/Logo/Logo";
import LogoutButton from "@/components/ui/Buttons/LogoutButton/LogoutButton";

/* ── Links de navegación del dashboard ── */
const NAV_LINKS = [
  { href: "/dashboard/resumen",      icon: <FaBookOpen size={18} />,        label: "Resumen" },
  { href: "/dashboard/pedidos",      icon: <FaBagShopping size={18} />,     label: "Mis Pedidos" },
  { href: "/dashboard/devoluciones", icon: <FaArrowRotateLeft size={18} />, label: "Devoluciones" },
  { href: "/dashboard/direcciones",  icon: <FaLocationDot size={18} />,     label: "Mis Direcciones" },
  { href: "/dashboard/cuenta",       icon: <FaUser size={18} />,            label: "Detalles de la Cuenta" },
  { href: "/dashboard/pagos",        icon: <FaCreditCard size={18} />,      label: "Métodos de Pago" },
  { href: "/dashboard/deseos",       icon: <FaHeart size={18} />,           label: "Lista de Deseos" },
  { href: "/dashboard/alertas",      icon: <FaBell size={18} />,            label: "Mis alertas" },
  { href: "/dashboard/ayuda",        icon: <FaQuestion size={18} />,        label: "Ayuda" },
];

/* ──────────────────────────────────────
   DashboardNav  (va como children del Sidebar)
   ────────────────────────────────────── */
export function DashboardNav() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname.startsWith(path) ? styles.active : "";

  return (
    <>
      {/* Logo completo (desktop) */}
      <div className={styles.logoFull}>
        <Logo size={140} />
      </div>

      {/* Logo compacto HR (tablet) */}
      <div className={styles.logoCompact}>
        <Logo size={44} variant="compact" />
      </div>

      {/* Menú de navegación */}
      <nav className={styles.sidebarMenu}>
        {NAV_LINKS.map(({ href, icon, label }) => (
          <Link key={href} href={href} className={isActive(href)}>
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

/* ──────────────────────────────────────
   DashboardLogout  (va como footer del Sidebar)
   ────────────────────────────────────── */
export function DashboardLogout({ user }) {
  const [logoutPopup, setLogoutPopup] = useState(false);
  const pathname = usePathname();
  const popupRef = useRef(null);

  const avatarUrl = user?.profileImage || "/profile-default.png";
  const userName  = user?.name || "Usuario";

  // Cerramos el popup al cambiar de ruta
  useEffect(() => { setLogoutPopup(false); }, [pathname]);

  // Cerramos el popup al hacer clic fuera
  useEffect(() => {
    if (!logoutPopup) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setLogoutPopup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [logoutPopup]);

  return (
    <div className={styles.logoutWrapper} ref={popupRef}>

      {/* Popup flotante (solo visible en tablet al pulsar avatar) */}
      {logoutPopup && (
        <div className={styles.logoutPopup}>
          <div className={styles.logoutPopupUser}>
            <img src={avatarUrl} alt="Perfil" className={styles.logoutPopupAvatar} />
            <span>{userName}</span>
          </div>
          <div className={styles.logoutPopupDivider} />
          <LogoutButton
            icon={<FaArrowRightFromBracket size={16} />}
            text="Cerrar sesión"
            className={styles.logoutPopupBtn}
          />
        </div>
      )}

      {/* Barra de logout (desktop y drawer móvil) */}
      <div
        className={styles.logout}
        onClick={() => setLogoutPopup((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label="Opciones de sesión"
      >
        <img src={avatarUrl} alt="Perfil" />
        <p>{userName}</p>
        <LogoutButton
          icon={<FaArrowRightFromBracket size={18} />}
          text={null}
          className={styles.logoutButton}
        />
      </div>

    </div>
  );
}
