/**
 * @file page.jsx (Envíos y Devoluciones)
 * @description Información logística sobre tiempos, costes y devoluciones.
 *
 * [Nuestro enfoque]
 * Ofrecemos transparencia total sobre el proceso de fabricación artesanal y el tránsito 
 * de las piezas desde nuestro taller hasta el cliente final.
 *
 * [Por qué lo hemos hecho así]
 * Para evitar confusiones en pedidos bajo demanda, especificamos los plazos de 
 * tufting (5-10 días) y los protocolos de incidencia en el transporte.
 */

export const metadata = {
    title: 'Envíos y Devoluciones | Hygge Rug - Logística Artesanal',
    description: 'Consulta los plazos de fabricación y envío de tus alfombras personalizadas. Información sobre envíos gratuitos, tarifas y política de devoluciones en Hygge Rug.',
    keywords: 'Envíos, Devoluciones, Hygge Rug, Tufting Madrid, alfombras personalizadas, logística, tiempos de entrega'
};

import React from 'react';
import LegalPageWrapper from '@/components/ui/Legal/LegalPageWrapper';
import styles from '@/components/ui/Legal/LegalPageWrapper.module.css';

export default function EnviosDevolucionesPage() {
    const navItems = [
        { id: 'envios', label: 'Envíos' },
        { id: 'tarifas', label: 'Tarifas' },
        { id: 'devoluciones', label: 'Devoluciones' },
        { id: 'incidencias', label: 'Incidencias' },
    ];

    return (
        <LegalPageWrapper 
            title="Envíos y Devoluciones" 
            lastUpdated="Logística Hygge"
            navItems={navItems}
        >
            <section className={styles.legalSection} id="envios">
                <div className={styles.sectionBadge}>TIEMPOS</div>
                <h2>01. Plazos de Fabricación y Envío</h2>
                <p>
                    En Hygge Rug no enviamos productos de una estantería. Cada alfombra se fabrica **bajo demanda** tras tu confirmación.
                </p>
                <ul>
                    <li><strong>Fabricación:</strong> Entre 5 y 10 días laborables (dependiendo de la complejidad).</li>
                    <li><strong>Tránsito:</strong> Una vez terminada, el envío nacional tarda entre 24h y 48h.</li>
                    <li><strong>Islas:</strong> Para Baleares y Canarias, el plazo de transporte puede extenderse hasta los 5-7 días.</li>
                </ul>
            </section>

            <section className={styles.legalSection} id="tarifas">
                <div className={styles.sectionBadge}>COSTES</div>
                <h2>02. Tarifas de Envío</h2>
                <p>
                    Calculamos el coste exacto en el checkout basándonos en el peso de la lana y la base de la alfombra, así como en tu ubicación.
                </p>
                <div className={styles.highlightBox}>
                    <p>Ofrecemos <strong>envío gratuito</strong> en pedidos superiores a 150€ dentro de la Península.</p>
                </div>
            </section>

            <section className={styles.legalSection} id="devoluciones">
                <div className={styles.sectionBadge}>POLÍTICA</div>
                <h2>03. Cambios y Devoluciones</h2>
                <p>
                    Al ser productos artesanales y personalizados (incluyendo los del catálogo que se fabrican para ti), solo se admiten devoluciones en caso de defecto evidente.
                </p>
                <p>
                    Si cambias de opinión sobre un diseño, tienes un margen de **24 horas** desde la compra para cancelar el pedido antes de que compremos los materiales específicos.
                </p>
            </section>

            <section className={styles.legalSection} id="incidencias">
                <div className={styles.sectionBadge}>SOPORTE</div>
                <h2>04. ¿Paquete Dañado?</h2>
                <p>
                    Si al recibir tu Hygge Rug notas que el embalaje está roto o la alfombra presenta daños por el transporte, por favor:
                </p>
                <ul>
                    <li>Haz una foto del paquete antes de abrirlo.</li>
                    <li>Escríbenos a <strong>hyggerug@gmail.com</strong> en un plazo máximo de 24h.</li>
                    <li>Nosotros nos encargaremos de recogerla y enviarte una nueva unidad sin coste.</li>
                </ul>
            </section>
        </LegalPageWrapper>
    );
}
