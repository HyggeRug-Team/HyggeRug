"use client";

import React from "react";
import styles from "./Sidebar.module.css";
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
import Logo from "@/components/common/Logo/Logo";
import LogoutBtn from "@/components/ui/Buttons/LogoutBtn/LogoutBtn";

/**
 * Componente Sidebar - Barra lateral del Dashboard
 * 
 * Este componente implementamos la navegación principal del panel de usuario.
 * Estructuramos el sidebar en dos secciones principales:
 * 
 * 1. Sección Superior (92%): Contiene el logo de la marca y el menú de navegación
 *    con todos los enlaces a las diferentes secciones del dashboard.
 * 
 * 2. Sección Inferior (8%): Muestra la información del usuario actual y el botón
 *    de cierre de sesión para una experiencia de usuario intuitiva.
 * 
 * Utilizamos React Icons (fa6) para mantener consistencia visual en todos los
 * iconos del menú, y aplicamos transiciones suaves para mejorar la interactividad.
 */
function Sidebar({user}) {
  const pathname = usePathname();
  const avatarUrl = user?.profileImage || "/profile-default.png";
  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return pathname.startsWith(path) ? styles.active : "";
  };

  return (
    <div className={styles.sidebarContent}>
      
      {/* ========== SECCIÓN SUPERIOR ========== */}
      {/* Ocupamos el 92% del alto total del sidebar */}
      <div className={styles.topSection}>
        
        {/* --- Logo y Título de la Marca --- */}
        {/* Mostramos el logo estilo etiqueta cosida */}
        <div className={styles.logoContainer}>
          <Logo size={140} />
        </div>

        {/* --- Menú de Navegación Principal --- */}
        {/* Listamos todas las opciones disponibles en el dashboard */}
        {/* Cada enlace incluye un icono descriptivo y texto para mejor UX */}
        <nav className={styles.sidebarMenu}>
          <Link href="/dashboard/resumen" className={isActive("/dashboard/resumen")}>
            <FaBookOpen size={18} />
            Resumen
          </Link>
          <Link href="/dashboard/pedidos" className={isActive("/dashboard/pedidos")}>
            <FaBagShopping size={18} /> 
            Mis Pedidos
          </Link>
          <Link href="/dashboard/devoluciones" className={isActive("/dashboard/devoluciones")}>
            <FaArrowRotateLeft size={18} />
            Devoluciones
          </Link>
          <Link href="/dashboard/direcciones" className={isActive("/dashboard/direcciones")}>
            <FaLocationDot size={18} />
            Mis Direcciones
          </Link>
          <Link href="/dashboard/cuenta" className={isActive("/dashboard/cuenta")}>
            <FaUser size={18} />
            Detalles de la Cuenta
          </Link>
          <Link href="/dashboard/pagos" className={isActive("/dashboard/pagos")}>
            <FaCreditCard size={18} />
            Métodos de Pago
          </Link>
          <Link href="/dashboard/deseos" className={isActive("/dashboard/deseos")}>
            <FaHeart size={18} />
            Lista de Deseos
          </Link>
          <Link href="/dashboard/alertas" className={isActive("/dashboard/alertas")}>
            <FaBell size={18} />
            Mis alertas
          </Link>
          <Link href="/dashboard/ayuda" className={isActive("/dashboard/ayuda")}>
            <FaQuestion size={18} />
            Ayuda
          </Link>
        </nav>
      </div>

      {/* ========== SECCIÓN INFERIOR ========== */}
      {/* Ocupamos el 8% restante del alto total */}
      {/* Mostramos el perfil del usuario y opción de logout */}
      <div className={styles.logout}>
        <img src={avatarUrl} alt="Perfil" />
        <p>Usuario</p>
        {/* Usamos el LogoutBtn con solo el icono, sin texto */}
        <LogoutBtn 
          icon={<FaArrowRightFromBracket size={18} />} 
          text={null}
          className={styles.logoutButton}
        />
      </div>
      
    </div>
  );
}

export default Sidebar;
