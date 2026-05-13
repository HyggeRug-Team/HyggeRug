/**
 * @file Footer.jsx
 * @description Pie de página informativo y responsive.
 *
 * [Nuestro enfoque]
 * Hemos diseñado este pie de página como el “mapa” de nuestra web. Para que no sea una lista
 * aburrida, lo adaptamos a cada dispositivo: en móvil usamos menús desplegables y en escritorio
 * mostramos columnas claras para que todo esté a la vista.
 *
 * [Por qué lo hemos hecho así]
 * Hemos aplicado DRY y hemos centralizado los enlaces en `SECCIONES_FOOTER` para que cambiar
 * un enlace sea siempre un único trabajo (mantenibilidad y menos errores).
 */
"use client";

import React, { useState, useEffect } from "react";
import FooterDropdown from "./FooterDropdown";
import styles from "./Footer.module.css";
import Logo from "@/components/ui/Logo/Logo";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";

function Footer() {
  const SECCIONES_FOOTER = [
    {
      titulo: "Diseños de la comunidad",
      links: [
        { nombre: "Explorar Comunidad", url: "/tienda" },
        { nombre: "Personalizar", url: "/personalizar" },
        { nombre: "Laboratorio IA", url: "/crear-diseno" },
      ],
    },
    {
      titulo: "Empresa",
      links: [
        { nombre: "Sobre Nosotros", url: "/sobre-nosotros" },
        { nombre: "Artesanía", url: "/sobre-nosotros" },
        { nombre: "Hygge Gang", url: "/sobre-nosotros" },
      ],
    },
    {
      titulo: "Ayuda",
      links: [
        { nombre: "Envíos y devoluciones", url: "/legal/envios-devoluciones" },
        { nombre: "Preguntas frecuentes", url: "/preguntas-frecuentes" },
        { nombre: "Contacto", url: "/contacto" },
      ],
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  
  // Detectamos si estamos en móvil para cambiar el layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <footer className={styles.footerComponent}>
        <div className={styles.footerSection}>
          <div className={styles.footerContent}>
  
            <div className={styles.footerSlogan}>
              <h3 className={styles.sloganTitle}>Hygge Rug</h3>
              <p>
                Llevamos el confort extremo a suelos tristes de todo el mundo. 
                Inspirados por nuestra comunidad, hacemos realidad las ideas de otros clientes para que tú también puedas disfrutarlas.
              </p>
            </div>
            <div className={styles.socialMedias}>
              <a href="https://www.instagram.com/hygge_rug/" target="_blank" rel="noopener noreferrer">
                <AiFillInstagram />
              </a>
              <a href="https://www.tiktok.com/@hygge_rug" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
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
                <h3>Diseños de la comunidad</h3>
                <a href="/tienda">Explorar Comunidad</a>
                <a href="/personalizar">Personalizar</a>
                <a href="/crear-diseno">Laboratorio IA</a>
              </div>
              <div className={styles.footerCompany}>
                <h3>Empresa</h3>
                <a href="/sobre-nosotros">Sobre Nosotros</a>
                <a href="/sobre-nosotros">Artesanía</a>
                <a href="/sobre-nosotros">Hygge Gang</a>
              </div>
              <div className={styles.footerHelp}>
                <h3>Ayuda</h3>
                <a href="/legal/envios-devoluciones">Envíos y devoluciones</a>
                <a href="/preguntas-frecuentes">Preguntas frecuentes</a>
                <a href="/contacto">Contacto</a>
              </div>
            </>
          )}
        </div>
        <div className={styles.footerLegal}>
          <div className={styles.footerLegalContent}>
            <p>© 2026 Hygge Rug Inc. Hecho con amor (y lana).</p>
            <div className={styles.footerPolicy}>
              <a href="/legal/privacidad">Privacidad</a>
              <a href="/legal/terminos">Términos</a>
              <a href="/legal/aviso-legal">Aviso Legal</a>
              <a href="/legal/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

