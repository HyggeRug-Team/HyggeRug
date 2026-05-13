/**
 * @file MobileMenu.jsx
 * @description Menú lateral desplegable optimizado exclusivamente para dispositivos móviles.
 *
 * [Nuestro enfoque]
 * Hemos dedicado este componente a perfeccionar la navegación táctil. Es el menú que 
 * se despliega suavemente desde el lateral, ofreciendo enlaces visuales y una 
 * jerarquía clara que facilita la exploración de la web con una sola mano.
 *
 * [Por qué lo hemos hecho así]
 * Implementamos transiciones fluidas para que la experiencia se sienta rápida y 
 * cercana a una aplicación nativa, integrando además los enlaces sociales dinámicos 
 * para mantener la conectividad de marca en todo momento.
 */
'use client';
import React from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';
import CuteMessage from "@/components/ui/CuteMessage/CuteMessage";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok, FaRegHeart } from "react-icons/fa";

export default function MobileMenu({ isOpen, menuItems, onClose, onSearchClick, socialLinks }) {
  const instagramUrl = socialLinks?.social_instagram || "https://www.instagram.com/hygge_rug/";
  const tiktokUrl = socialLinks?.social_tiktok || "https://www.tiktok.com/@hygge_rug";

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuActive : ""}`}>
      
      <div className={styles.headerMobileMenu}>
        <h2>Hygge Rug</h2>
        <h4>Diseño artesanal para tu hogar</h4>
      </div>

      <div className={styles.buttonMobileMenu}>
        {menuItems.map((item) => {
          const IconoMovil = item.icon; 

          if (item.id === 6) {
            return (
              <button
                key={item.id}
                className={styles.menuButton}
                onClick={onSearchClick}
              >
                <div className={styles.iconMobilMenu}>
                  <IconoMovil size={24} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          }

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
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"><AiFillInstagram /></a>
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        </div>
      </div>
    </div>
  );
}
