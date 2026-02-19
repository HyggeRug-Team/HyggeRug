/*
 * Componente: MobileMenu
 * Descripción: Menú de navegación lateral para dispositivos móviles. Incluye enlaces de navegación, redes sociales y un mensaje decorativo.
 */
'use client';
import React from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';
import CuteMessage from "@/components/ui/CuteMessage/CuteMessage";
import { FaFacebookF, FaRegHeart } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

export default function MobileMenu({ isOpen, menuItems, onClose }) {
  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuActive : ""}`}>
      
      <div className={styles.headerMobileMenu}>
        <h2>Hygge Rug</h2>
        <h4>Diseño artesanal para tu hogar</h4>
      </div>

      {/* Botones del menú desplegable */}
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

      <div className={styles.cuteMessage}>
        <CuteMessage Icon={FaRegHeart} text="Hecho a mano directo a tu corazón" />
      </div>

      <div className={styles.socialMedias}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://www.instagram.com/hygge_rug/" target="_blank" rel="noopener noreferrer">
          <AiFillInstagram />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaXTwitter />
        </a>
      </div>
    </div>
  );
}