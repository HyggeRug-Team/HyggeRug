import React from "react";
import styles from "./Footer.module.css";
import { Logo } from "../Logo";

function Footer() {
  return (
    <>
      <footer className={styles.footerComponent}>
        <div className={styles.footerSection}>
          <div>
            <div>
              <Logo size={30} />
              <h2>Hygge Rug</h2>
            </div>
            <div>
              <p>
                Llevando el arte escandinavo del confort a suelos de todas
                partes. Tejidas a mano, de origen ético y diseñadas por ti.
              </p>
            </div>
            <div className={styles.socialMedias}>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </div>
          </div>
          <div>
            <h3>Tienda</h3>
            <a href="/Novedades">Novedades</a>
            <a href="/Más_vendidos">Más vendidos</a>
            <a href="/A_medida">A medida</a>
            <a href="/Pasilleras">Pasilleras</a>
          </div>
          <div>
            <h3>Empresa</h3>
            <a href="/Nuestra_historia">Nuestra historia</a>
            <a href="/Sostenibilidad">Sostenibilidad</a>
            <a href="/Cuidados">Cuidados</a>
            <a href="/Empleo">Empleo</a>
          </div>
        </div>
        <div className={styles.footerLegal}>
          <p>© 2026 Hygge Rug. Todos los derechos reservados.</p>
          <div>
            <a href="/privacy-policy">Política de Privacidad</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="/terms-of-service">Términos de Servicio</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
