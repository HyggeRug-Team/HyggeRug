"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from "@/components/ui/Logo/Logo";
import styles from "./Header.module.css";
import Link from 'next/link';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';

// Importamos todos los iconos que necesitamos para nuestra navegación
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { IoBrushOutline, IoBagOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

function Header() {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const pathname = usePathname();
  // Verificamos si estamos en la página de autenticación para ajustar la vista
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
    { id: 1, label: "Inicio", url: "/", icon: GoHome },
    { id: 2, label: "Personalizar", url: "/personalizar", icon: IoBrushOutline },
    { id: 3, label: "Tienda", url: "/tienda", icon: IoBagOutline },
    { id: 6, label: "Buscar", url: "/buscar", icon: CiSearch },
    { id: 5, label: "Carrito", url: "/carrito", icon: CiShoppingCart },
    { id: 4, label: "Cuenta", url: "/auth", icon: MdAccountCircle },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.imageHeader}>
        <Logo />
      </div>
      
      {!isAuthPage && (
        <>
          <nav className={styles.nav}>
            <Link href='/tienda' className={styles.navLink}>Tienda</Link>
            <Link href='/personalizar' className={styles.navLink}>Personalizar</Link>
            <Link href='/sobre-nosotros' className={styles.navLink}>Nosotros</Link>
          </nav>

          <div className={styles.buttonsMenu}>
            {MENU_ITEMS.filter(item => [4,5,6].includes(item.id)).map((item) => {
              const Icono = item.icon;
              return (
                <Link href={item.url} key={item.id} title={item.label}>
                  <button className={styles.iconBtn}>
                    <Icono size={35} />
                  </button>
                </Link>
              );
            })}
          </div>

          <div className={styles.hamburgerButton} onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose size={35} /> : <RxHamburgerMenu size={35} />}
          </div>

          {/* Renderizamos el menú móvil separado para mantener el código limpio */}
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
