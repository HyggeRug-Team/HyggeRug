"use client";

import React, { useState, useEffect } from "react";
import FooterDropdown from "./FooterDropdown";
import styles from "./Footer.module.css";
import Logo from "../Logo/Logo"
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const SECCIONES_FOOTER = [
    {
      titulo: "Tienda",
      links: [
        { nombre: "Novedades", url: "/Novedades" },
        { nombre: "Más vendidos", url: "/Más_vendidos" },
        { nombre: "A medida", url: "/A_medida" },
        { nombre: "Pasilleras", url: "/Pasilleras" },
      ],
    },
    {
      titulo: "Empresa",
      links: [
        { nombre: "Nuestra historia", url: "/Nuestra_historia" },
        { nombre: "Sostenibilidad", url: "/Sostenibilidad" },
        { nombre: "Cuidados", url: "/Cuidados" },
        { nombre: "Empleo", url: "/Empleo" },
      ],
    },
    {
      titulo: "Ayuda",
      links: [
        { nombre: "Envíos y devoluciones", url: "/Envíos_devoluciones" },
        { nombre: "Preguntas frecuentes", url: "/Preguntas_frecuentes" },
        { nombre: "Contacto", url: "/Contacto" },
        { nombre: "Seguimiento", url: "/Seguimiento" },
      ],
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  //Funcion para actualizar el estado del tamaño del width de la pantalla
  useEffect(() => {
    // 2. Función para actualizar el estado
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    // Ejecutar al montar para saber el tamaño inicial
    handleResize();

    // 3. Escuchar el cambio de tamaño de pantalla
    window.addEventListener("resize", handleResize);

    // Limpiar el evento al desmontar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <footer className={styles.footerComponent}>
        <div className={styles.footerSection}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Logo />
              <h2>Hygge Rug</h2>
            </div>
            <div className={styles.footerSlogan}>
              <p>
                Llevando el arte escandinavo del confort a suelos de todas
                partes. Tejidas a mano, de origen ético y diseñadas por ti.
              </p>
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
          {isMobile ? (
            <div>
              {
                SECCIONES_FOOTER.map((seccion,index) => (
                  <FooterDropdown
                    key={index}
                    titulo={seccion.titulo}
                    opciones={seccion.links}
                  />
                ))
              }
            </div>
          ) : (
            <>
              <div className={styles.footerShop}>
                <h3>Tienda</h3>
                <a href="/Novedades">Novedades</a>
                <a href="/Más_vendidos">Más vendidos</a>
                <a href="/A_medida">A medida</a>
                <a href="/Pasilleras">Pasilleras</a>
              </div>
              <div className={styles.footerCompany}>
                <h3>Empresa</h3>
                <a href="/Nuestra_historia">Nuestra historia</a>
                <a href="/Sostenibilidad">Sostenibilidad</a>
                <a href="/Cuidados">Cuidados</a>
                <a href="/Empleo">Empleo</a>
              </div>
              <div className={styles.footerHelp}>
                <h3>Ayuda</h3>
                <a href="/Envíos_devoluciones">Envíos y devoluciones</a>
                <a href="/Preguntas_frecuentes">Preguntas frecuentes</a>
                <a href="/Contacto">Contacto</a>
                <a href="/Seguimiento">Seguimiento</a>
              </div>
            </>
          )}
        </div>
        <div className={styles.footerLegal}>
          <p>© 2026 Hygge Rug Inc. Hecho con amor (y lana).</p>
          <div className={styles.footerPolicy}>
            <a href="/privacy-policy">Política de Privacidad</a>
            <a href="/terms-of-service">Términos de Servicio</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
