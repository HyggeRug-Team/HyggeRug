/*
 * Componente: Header
 * Descripción: Cabecera principal de la aplicación. Gestiona la navegación, el logotipo y la adaptación del menú para dispositivos móviles (hamburguesa).
 */
"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from "@/components/ui/Logo/Logo";
import styles from "./Header.module.css";
import Link from 'next/link';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';
import {
  FaHouse,
  FaPaintbrush,
  FaImages,
  FaMagnifyingGlass,
  FaCartShopping,
  FaCircleUser,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { motion } from 'framer-motion';

function Header() {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  const toggleMenu = () => {
    setIsOpenMenu(!isMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpenMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const MENU_ITEMS = [
    { id: 1, label: "Inicio", url: "/", icon: FaHouse },
    { id: 2, label: "Personalizar", url: "/personalizar", icon: FaPaintbrush },
    { id: 3, label: "Galería", url: "/tienda", icon: FaImages },
    { id: 6, label: "Buscar", url: "/buscar", icon: FaMagnifyingGlass },
    { id: 5, label: "Carrito", url: "/carrito", icon: FaCartShopping },
    { id: 4, label: "Cuenta", url: "/auth", icon: FaCircleUser },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.imageHeader}>
        <Logo />
      </div>

      {!isAuthPage && (
        <>
          <nav className={styles.nav}>
            <Link href='/tienda' className={styles.navLink}>Galería</Link>
            <Link href='/personalizar' className={styles.navLink}>Personalizar</Link>
            <Link href='/sobre-nosotros' className={styles.navLink}>Nosotros</Link>
          </nav>

          <div className={styles.buttonsMenu}>
            {MENU_ITEMS.filter(item => [4, 5, 6].includes(item.id)).map((item) => {
              const Icono = item.icon;
              return (
                <Link href={item.url} key={item.id} title={item.label}>
                  <button className={styles.iconBtn}>
                    <Icono size={22} />
                  </button>
                </Link>
              );
            })}
          </div>

          <div className={styles.hamburgerButton} onClick={toggleMenu}>
            {isMenuOpen ? <FaXmark size={28} /> : <FaBars size={26} />}
          </div>

          <MobileMenu
            isOpen={isMenuOpen}
            menuItems={MENU_ITEMS}
            onClose={() => setIsOpenMenu(false)}
          />
        </>
      )}
    </header>
  )
}

export default Header;
