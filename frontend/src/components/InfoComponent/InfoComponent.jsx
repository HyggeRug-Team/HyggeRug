"use client";
import React from "react";
import styles from "./InfoComponent.module.css";

import { GoDotFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";

function Hero() {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoInfo}>
        <span className={styles.infoBanner}><GoDotFill />NUEVA COLECCIÓN</span>
        <h1 className={styles.infoTitle}>
          Alfombras a medida para tu <span>lugar feliz</span>
        </h1>
        <p>
          Porque tu suelo también merece un abrazo. Diseña una alfombra que se
          adapte perfectamente a tu espacio (y a tu rollo).
        </p>
        <div className={styles.infoButtons}>
          <a href="#">Empezar a diseñar<span><FaArrowRight/></span></a>
          <a href="#">Ver catálogo</a>
        </div>
        <span className={styles.infoSend}><MdOutlineVerified size={18}/>Envío gratis en pedidos personalizados</span>
      </div>
      <div className={styles.infoImage}>
        <img src="/ejemplo.webp" alt="Alfombra de la ultima colección" />
      </div>
    </div>
  );
}

export default Hero;
