"use client";
import React from "react";
import styles from "./Hero.module.css";

import { GoDotFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";

function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroInfo}>
        <span className={styles.heroBanner}><GoDotFill />NUEVA COLECCIÓN</span>
        <h1 className={styles.heroTitle}>
          Alfombras a medida para tu <span>lugar feliz</span>
        </h1>
        <p>
          Porque tu suelo también merece un abrazo. Diseña una alfombra que se
          adapte perfectamente a tu espacio (y a tu rollo).
        </p>
        <div className={styles.heroButtons}>
          <a href="#">Empezar a diseñar<span><FaArrowRight/></span></a>
          <a href="#">Ver catálogo</a>
        </div>
        <span className={styles.heroSend}><MdOutlineVerified size={18}/>Envío gratis en pedidos personalizados</span>
      </div>
      <div className={styles.heroImage}>
        <img src="/ejemplo.webp" alt="Alfombra de la ultima colección" />
      </div>
    </div>
  );
}

export default Hero;
