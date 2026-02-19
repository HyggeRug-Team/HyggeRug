/*
 * Componente: Sidebar
 * Descripción: Barra lateral de navegación para el panel de usuario (Dashboard). Muestra enlaces a las diferentes secciones de gestión, el logo y el botón de cerrar sesión.
 */
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
import Logo from "@/components/ui/Logo/Logo";
import LogoutButton from "@/components/ui/Buttons/LogoutButton/LogoutButton";

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
      <div className={styles.topSection}>
        
        {/* --- Logo y Título de la Marca --- */}
        <div className={styles.logoContainer}>
          <Logo size={140} />
        </div>

        {/* --- Menú de Navegación Principal --- */}
        {/* Listamos todas las opciones disponibles en el dashboard */}
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
      {/* Mostramos el perfil del usuario y opción de logout */}
      <div className={styles.logout}>
        <img src={avatarUrl} alt="Perfil" />
        <p>Usuario</p>
        {/* Usamos el LogoutBtn con solo el icono, sin texto */}
        <LogoutButton 
          icon={<FaArrowRightFromBracket size={18} />} 
          text={null}
          className={styles.logoutButton}
        />
      </div>
      
    </div>
  );
}

export default Sidebar;
