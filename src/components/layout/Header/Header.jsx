/**
 * @file Header.jsx
 * @description Cabecera principal de la aplicación. Controla la navegación y la identidad visual.
 *
 * [Nuestro enfoque]
 * Hemos creado esta cabecera como el “centro de mandos” de nuestra web. 
 * Si el usuario está en la pantalla de acceso (Login/Registro), escondemos la navegación para
 * que se centre en entrar a su cuenta sin distracciones.
 *
 * En móvil mostramos el menú hamburguesa y en escritorio dejamos la navegación visible.
 * Hemos integrado el buscador global (SearchOverlay) desde aquí para que esté disponible
 * tanto en el header de escritorio como en el menú móvil.
 *
 * [Por qué lo hemos hecho así]
 * Hemos elegido estas reglas para mejorar la experiencia de usuario y evitar que el panel de
 * acceso se sienta “mezclado” con el contenido comercial.
 */
'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from "@/components/ui/Logo/Logo";
import styles from "./Header.module.css";
import Link from 'next/link';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';
import SearchOverlay from './SearchOverlay/SearchOverlay';
import { useCart } from '@/context/CartContext';
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

function Header() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  // Comprobamos si estamos en la página de autenticación para simplificar la interfaz
  const isAuthPage = pathname === '/auth';

  const toggleMenu = () => {
    setIsOpenMenu(!isMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      // Sincronizado con CSS: cerramos menú si ensancha
      if (window.innerWidth > 1024) {
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
    { id: 3, label: "Comunidad", url: "/tienda", icon: FaImages },
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
            <Link href='/tienda' className={styles.navLink}>Comunidad</Link>
            <Link href='/personalizar' className={styles.navLink}>Personalizar</Link>
            <Link href='/sobre-nosotros' className={styles.navLink}>Sobre Nosotros</Link>
          </nav>

          <div className={styles.buttonsMenu}>
            {/* Filtramos los iconos que queremos mostrar en la barra persistente */}
            {MENU_ITEMS.filter(item => [4, 5, 6].includes(item.id)).map((item) => {
              const Icono = item.icon;
              
              // Si es el buscador, abrimos el overlay en lugar de navegar
              if (item.id === 6) {
                return (
                  <button 
                    key={item.id} 
                    className={styles.iconBtn} 
                    onClick={() => setIsSearchOpen(true)}
                    title={item.label}
                  >
                    <Icono size={22} />
                  </button>
                );
              }

              return (
                <Link href={item.url} key={item.id} title={item.label}>
                  <button className={styles.iconBtn}>
                    <Icono size={22} />
                    {item.id === 5 && cartCount > 0 && (
                      <span className={styles.cartBadge}>{cartCount}</span>
                    )}
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
            onSearchClick={() => {
              setIsOpenMenu(false);
              setIsSearchOpen(true);
            }}
          />

          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </>
      )}
    </header>
  )
}

export default Header;
