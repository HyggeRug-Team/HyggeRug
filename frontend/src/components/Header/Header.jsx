"use client";
import React, { useState, useEffect } from 'react';
// Necesario para las rutas
import { usePathname } from 'next/navigation';
import Logo from '../Logo/Logo'
import styles from "./Header.module.css";
import Link from 'next/link'
//Importación de los iconos usados
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { IoBrushOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
// Import de los componentes usados
import CuteMessage from "../CuteMessage/CuteMessage";
function Header() {
  // Estado por defecto en cerrado
  const [isMenuOpen, setIsOpenMenu] = useState(false);

  // Ruta actual
  const pathname = usePathname();
  // Si está en alguna de esas rutas que son de incio de sesión o algo parecido
  const isAuthPage = pathname === '/auth' || pathname === '/login' || pathname === '/register';

  // Función para alternar entre estados
  const toggleMenu = () => {
    setIsOpenMenu(!isMenuOpen)
  }
  // Si el tamaño de la pantalla aumenta, el menu de movil se cierra automaticamente
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpenMenu(false);
      }
    };
    // EventListener en cambio de tamaño de pantalla
    window.addEventListener('resize', handleResize);

    // Cuando el menu se cierra el EventListener desaparece para no ocupar memoria
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // Lista de enlaces para menu desplegable en movil
  const MENU_ITEMS = [
    { id: 1, label: "Inicio", url: "/", icon: GoHome },
    { id: 2, label: "Personalizar", url: "/personalizar", icon: IoBrushOutline },
    { id: 3, label: "Tienda", url: "/tienda", icon: IoBagOutline },
    { id: 6, label: "Buscar", url: "/buscar", icon: CiSearch },
    { id: 5, label: "Carrito", url: "/carrito", icon: CiShoppingCart },
    { id: 4, label: "Cuenta", url: "/dashboard", icon: MdAccountCircle },
  ];
  return (
    <header className={styles.header}>
      <div className={styles.imageHeader}>
        <Logo />
        <h1>Hygge Rug</h1>
      </div>
      {/*Si la ruta no es ninguna de las del isAuthPage va a dibujar todo el header, si no simplemente saldrá el logo*/}
      {!isAuthPage && (
        <>
          <nav>
            <a href='#'>Tienda</a>
            <a href='#'>Personalizar</a>
            <a href='#'>Nosotros</a>
          </nav>
          <div className={styles.buttonsMenu}>
            {MENU_ITEMS.filter(item => [4,5,6].includes(item.id)).map((item) => {
              // IMPORTANTE: En React, las variables de componentes deben empezar por MAYÚSCULA
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
          {/*Cuando se pulse el estado del menu cambia*/}
          <div className={styles.hamburgerButton} onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose size={35} /> : <RxHamburgerMenu size={35} />}
          </div>
          {/*Si el estado is open es true se asigna la clase mobileMenuActive además de la clase principal*/}
          <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuActive : ""}`}>

            <div className={styles.headerMobileMenu}>
              <h2>Hygge Rug</h2>
              <h4>Diseño artesanal para tu hogar</h4>
            </div>

            {/*Botones del menú desplegable*/}
            <div className={styles.buttonMobileMenu}>
              {MENU_ITEMS.map((item) => {
                const IconoMovil = item.icon; // Extraemos la referencia
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={styles.menuButton}
                    onClick={() => setIsOpenMenu(false)} // Cierra el menú al hacer clic
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
        </>
      )}
    </header>
  )
}

export default Header