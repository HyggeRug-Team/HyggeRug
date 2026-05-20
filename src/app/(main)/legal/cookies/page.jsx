/**
 * @file page.jsx (Cookies)
 * @description Gestión técnica de cookies y rastreo.
 *
 * [Nuestro enfoque]
 * Explicamos el uso de cookies técnicas y analíticas necesarias para el funcionamiento 
 * de la tienda y el carrito de compra.
 *
 * [Por qué lo hemos hecho así]
 * Siguiendo las directrices de la AEPD, desglosamos las cookies de sesión y de 
 * personalización para garantizar el control total del usuario sobre su privacidad.
 */

export const metadata = {
    title: 'Política de Cookies | Hygge Rug - Experiencia de Usuario',
    description: 'Consulta cómo utilizamos las cookies para mejorar tu experiencia en Hygge Rug. Gestión de sesiones, carrito y análisis de navegación en nuestro taller de tufting.',
    keywords: 'Cookies, Privacidad, Hygge Rug, Tufting, Seguridad web, experiencia de usuario'
};

import React from 'react';
import LegalPageWrapper from '@/components/ui/Legal/LegalPageWrapper';
import GestionarCookiesBtn from '@/components/ui/Legal/GestionarCookiesBtn';
import styles from '@/components/ui/Legal/LegalPageWrapper.module.css';

export default function CookiesPage() {
    const navItems = [
        { id: 'definicion', label: '¿Qué son?' },
        { id: 'detalle', label: 'Detalle Técnico' },
        { id: 'desactivacion', label: 'Desactivación' },
    ];

    return (
        <LegalPageWrapper 
            title="Política de Cookies" 
            lastUpdated="Transparencia Técnica"
            navItems={navItems}
        >
            <section className={styles.legalSection} id="definicion">
                <div className={styles.sectionBadge}>SABER MÁS</div>
                <h2>01. ¿Qué son las Cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que se descargan en tu equipo al acceder a determinadas páginas web. Permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo.
                </p>
            </section>

            <section className={styles.legalSection} id="detalle">
                <div className={styles.sectionBadge}>ESPECIFICACIONES</div>
                <h2>02. Cookies Utilizadas en Hygge Rug</h2>
                <p>Cumpliendo con la normativa de la AEPD, procedemos a detallar el uso de cookies de esta web:</p>
                
                <div className={styles.highlightBox}>
                    <ul>
                        <li><strong>session_token:</strong> Cookie técnica necesaria para mantener tu sesión activa y proteger tu cuenta.</li>
                        <li><strong>cart_items:</strong> Almacena temporalmente los productos de tu carrito para que no los pierdas al navegar.</li>
                        <li><strong>_ga / _gid:</strong> Cookies analíticas de Google (si están activas) para medir cómo interactúas con la web.</li>
                    </ul>
                </div>
            </section>

            <section className={styles.legalSection} id="desactivacion">
                <div className={styles.sectionBadge}>CONTROL</div>
                <h2>03. Gestión y Desactivación de Cookies</h2>
                <p>
                    Puedes cambiar tus preferencias de cookies en cualquier momento directamente desde nuestra web:
                </p>
                <GestionarCookiesBtn />
                <p style={{ marginTop: '24px' }}>
                    También puedes bloquear o eliminar cookies desde la configuración de tu navegador:
                </p>
                <ul>
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Configurar Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Configurar Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Configurar Safari</a></li>
                </ul>
            </section>
        </LegalPageWrapper>
    );
}
