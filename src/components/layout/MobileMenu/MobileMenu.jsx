/**
 * @file MobileMenu.jsx
 * @description Menú lateral desplegable optimizado exclusivamente para móviles.
 *
 * [Nuestro enfoque]
 * Hemos dedicado este componente a la navegación móvil. Es el menú que “nace” desde el lateral
 * cuando pulsamos el botón de tres rayas, con enlaces muy visuales y consistentes.
 *
 * También incluimos un mensaje de marca y accesos rápidos a nuestras redes sociales para
 * reforzar el estilo de Hygge Rug.
 *
 * [Por qué lo hemos hecho así]
 * Hemos usado una transición suave para que se sienta rápido y “tipo app”, evitando que el
 * menú parezca un elemento suelto dentro de la página.
 */
'use client';
import React from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';
import CuteMessage from "@/components/ui/CuteMessage/CuteMessage";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok, FaRegHeart } from "react-icons/fa";

export default function MobileMenu({ isOpen, menuItems, onClose }) {
  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuActive : ""}`}>
      
      <div className={styles.headerMobileMenu}>
        <h2>Hygge Rug</h2>
        <h4>Diseño artesanal para tu hogar</h4>
      </div>

      <div className={styles.buttonMobileMenu}>
        {menuItems.map((item) => {
          const IconoMovil = item.icon; 
          return (
            <Link
              key={item.id}
              href={item.url}
              className={styles.menuButton}
              onClick={onClose}
            >
              <div className={styles.iconMobilMenu}>
                <IconoMovil size={24} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.menuFooter}>
        <div className={styles.cuteMessage}>
          <CuteMessage Icon={FaRegHeart} text="Hecho a mano directo a tu corazón" />
        </div>

        <div className={styles.socialMedias}>
          <a href="https://www.instagram.com/hygge_rug/" target="_blank" rel="noopener noreferrer"><AiFillInstagram /></a>
          <a href="https://www.tiktok.com/@hygge_rug" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        </div>
      </div>
    </div>
  );
}
