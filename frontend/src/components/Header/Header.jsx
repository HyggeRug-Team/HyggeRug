"use client";
import React, { useState } from 'react';
import Logo from '../Logo/Logo'
import styles from "./Header.module.css";
//Importación de los iconos usados
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
  // Estado por defecto en cerrado
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  // Función para alternar entre estados
  const toggleMenu = () => {
    setIsOpenMenu(!isMenuOpen)
  }
  return (
    <header className={styles.header}>
        <div className={styles.imageHeader}>
            <Logo />
            <h1>Hygge Rug</h1>
        </div>
        <nav>
          <a href='#'>Tienda</a>
          <a href='#'>Personalizar</a>
          <a href='#'>Nosotros</a>
        </nav>
        <div className={styles.buttonsMenu}>
          <button><CiSearch size={35}/></button>
          <button><CiShoppingCart size={35}/></button>
          <button><MdAccountCircle size={35}/></button>
        </div>
        <div className={styles.hamburgerButton}>
          <RxHamburgerMenu size={35}/>
        </div>
    </header>
  )
}

export default Header