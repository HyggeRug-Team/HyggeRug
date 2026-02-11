import React from "react";
import styles from "./Sidebar.module.css";
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

function Sidebar() {
  return (
    <div className={styles.sidebarContent}>
      
      {/* 1. SECCIÓN SUPERIOR (92% del alto) */}
      <div className={styles.topSection}>
        
        {/* LOGO: Separado e independiente */}
        <div className={styles.logoContainer}>
          <Logo />
          <h2>Hygge Rug</h2>
        </div>

        {/* MENÚ: Solo contiene los enlaces (etiquetas <a>) */}
        <nav className={styles.sidebarMenu}>
          <a href="#">
            <FaBookOpen size={18} />
            Resumen
          </a>
          <a href="#">
            <FaBagShopping size={18} /> 
            Mis Pedidos
          </a>
          <a href="#">
            <FaArrowRotateLeft size={18} />
            Devoluciones
          </a>
          <a href="#">
            <FaLocationDot size={18} />
            Mis Direcciones
          </a>
          <a href="#">
            <FaUser size={18} />
            Detalles de la Cuenta
          </a>
          <a href="#">
            <FaCreditCard size={18} />
            Métodos de Pago
          </a>
          <a href="#">
            <FaHeart size={18} />
            Lista de Deseos
          </a>
          <a href="#">
            <FaBell size={18} />
            Mis alertas
          </a>
          <a href="#">
            <FaQuestion size={18} />
            Ayuda
          </a>
        </nav>
      </div>

      {/* 2. SECCIÓN INFERIOR (8% del alto) */}
      <div className={styles.logout}>
        <img src="#" alt="Perfil" />
        <p>Nombre del usuario</p>
        <FaArrowRightFromBracket size={18} />
      </div>
      
    </div>
  );
}

export default Sidebar;