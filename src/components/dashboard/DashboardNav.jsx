/*
 * @file DashboardNav.jsx
 * @description Navegación del área privada del usuario (Dashboard).
 * 
 * [Nuestro enfoque]
 * Hemos pensado esta barra para que el usuario tenga siempre a mano las secciones importantes.
 * Incluimos el logo (según el tamaño de pantalla), los enlaces con estilo “activo” y el acceso a cerrar sesión.
 * 
 * [Por qué lo hemos hecho así]
 * Usamos `usePathname()` para saber en qué página está el usuario y marcar el enlace correspondiente,
 * evitando que el usuario se pierda dentro del panel.
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
  FaArrowRightFromBracket
} from "react-icons/fa6";
import Logo from "@/components/ui/Logo/Logo";
import LogoutButton from "@/components/ui/Buttons/LogoutButton/LogoutButton";

/* ── Links de navegación del dashboard organizados por categorías ── */
const NAV_GROUPS = [
  {
    title: "Actividad",
    links: [
      { href: "/dashboard/resumen",      icon: <FaBookOpen size={18} />,        label: "Resumen" },
      { href: "/dashboard/pedidos",      icon: <FaBagShopping size={18} />,     label: "Mis Pedidos" },
      { href: "/dashboard/deseos",       icon: <FaHeart size={18} />,           label: "Lista de Deseos" },
    ]
  },
  {
    title: "Perfil",
    links: [
      { href: "/dashboard/cuenta",       icon: <FaUser size={18} />,            label: "Detalles de la Cuenta" },
      { href: "/dashboard/direcciones",  icon: <FaLocationDot size={18} />,     label: "Mis Direcciones" },
      { href: "/dashboard/pagos",        icon: <FaCreditCard size={18} />,      label: "Métodos de Pago" },
    ]
  },
  {
    title: "Soporte",
    links: [
      { href: "/dashboard/devoluciones", icon: <FaArrowRotateLeft size={18} />, label: "Devoluciones" },
      { href: "/dashboard/ayuda",        icon: <FaQuestion size={18} />,        label: "Ayuda" },
    ]
  }
];

/* ──────────────────────────────────────
   DashboardNav  (va como children del Sidebar)
   ────────────────────────────────────── */
export function DashboardNav({ user }) {
  const pathname = usePathname();
  const isAdmin = user?.rol === 'admin';

  const isActive = (path) =>
    pathname.startsWith(path) ? styles.active : "";

  // Aquí ocurre la magia: si el usuario es admin, le cambiamos el menú por completo.
  // Así no tiene que ver cosas de cliente que no le sirven.
  const filteredGroups = isAdmin 
    ? [
        {
          title: "Administración",
          links: [
            { href: "/dashboard/admin",      icon: <FaBookOpen size={18} />,        label: "Panel General" },
            { href: "/dashboard/admin/pedidos", icon: <FaBagShopping size={18} />,     label: "Gestionar Pedidos" },
            { href: "/dashboard/admin/usuarios", icon: <FaUser size={18} />,           label: "Control de Usuarios" },
          ]
        },
        {
          title: "Configuración",
          links: [
            { href: "/dashboard/admin/tienda",  icon: <FaLocationDot size={18} />,     label: "Ajustes de Tienda" },
            { href: "/dashboard/admin/soporte", icon: <FaQuestion size={18} />,        label: "Tickets Soporte" },
          ]
        }
      ]
    : NAV_GROUPS;

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
        {filteredGroups.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <h3 className={styles.navGroupTitle}>{group.title}</h3>
            <div className={styles.navGroupLinks}>
              {group.links.map(({ href, icon, label }) => (
                <Link key={href} href={href} className={isActive(href)}>
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
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

  const avatarUrl = user?.profileImage || user?.profile_image || "/profile-default.png";
  const userName  = user?.nickname || "Usuario";

  // Cerramos el popup al cambiar de ruta
  useEffect(() => {
    const t = window.setTimeout(() => setLogoutPopup(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

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
        <img src={avatarUrl} alt="Foto de perfil" />
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
