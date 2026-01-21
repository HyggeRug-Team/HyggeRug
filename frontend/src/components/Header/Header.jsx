import React from 'react'
import Logo from '../Logo/Logo'
import styles from "./Header.module.css";
//Importación de los iconos usados
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
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
          <button><CiSearch size={30}/></button>
          <button><CiShoppingCart size={30}/></button>
          <button><MdAccountCircle size={30}/></button>
        </div>
        <div className={styles.hamburgerButton}>
          <RxHamburgerMenu size={30}/>
        </div>
    </header>
  )
}

export default Header