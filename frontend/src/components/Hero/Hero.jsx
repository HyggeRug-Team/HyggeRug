"use client";
import React from "react";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroInfo}>
        <span>NUEVA COLECCIÓN</span>
        <h1 className={styles.heroTitle}>
          Alfombras a medida para tu <span>lugar feliz</span>
        </h1>
        <p>
          Porque tu suelo también merece un abrazo. Diseña una alfombra que se
          adapte perfectamente a tu espacio (y a tu rollo).
        </p>
        <div className={styles.heroButtons}>
          <a href="#">Empezar a diseñar</a>
          <a href="#">Ver catálogo</a>
        </div>
        <span>Envío gratis en pedidos personalizados</span>
      </div>
      <div className={styles.heroImage}>
        <img src="#" alt="Alfombra de la ultima colección" />
      </div>
    </div>
  );
}

export default Hero;
