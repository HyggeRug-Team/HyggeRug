/**
 * @file page.jsx (Términos)
 * @description Condiciones legales de contratación y uso del servicio.
 *
 * [Nuestro enfoque]
 * Establecemos las reglas de juego claras para la creación de arte textil, 
 * detallando los procesos de aprobación y las excepciones por personalización.
 *
 * [Por qué lo hemos hecho así]
 * Al ser un negocio de fabricación bajo demanda, es vital proteger legalmente 
 * el proceso artesanal y los derechos de propiedad intelectual de los diseños.
 */

export const metadata = {
    title: 'Términos y Condiciones | Hygge Rug - Contrato de Artesanía',
    description: 'Condiciones de uso y contratación de Hygge Rug. Detalles sobre pedidos personalizados, propiedad de diseños y normativa de desistimiento (Art. 103 LSSI).',
    keywords: 'Términos de servicio, condiciones de compra, Hygge Rug, tufting, alfombras personalizadas, derechos autor, LSSI'
};

import React from 'react';
import LegalPageWrapper from '@/components/ui/Legal/LegalPageWrapper';
import styles from '@/components/ui/Legal/LegalPageWrapper.module.css';

export default function TerminosPage() {
    const navItems = [
        { id: 'servicio', label: 'El Servicio' },
        { id: 'precios', label: 'Precios' },
        { id: 'desistimiento', label: 'Desistimiento' },
        { id: 'propiedad', label: 'Propiedad' },
    ];

    return (
        <LegalPageWrapper 
            title="Términos" 
            lastUpdated="Condiciones de Uso"
            navItems={navItems}
        >
            <section className={styles.legalSection} id="servicio">
                <div className={styles.sectionBadge}>OPERATIVA</div>
                <h2>01. El Servicio y Aprobación</h2>
                <p>
                    Hygge Rug ofrece alfombras artesanales fabricadas mediante la técnica de Tufting. Cada pedido es revisado por el artesano antes de su confirmación final para asegurar la viabilidad técnica del diseño.
                </p>
                <div className={styles.highlightBox}>
                    <p>El contrato de compra solo se considerará perfeccionado una vez que hayamos validado el diseño y te hayamos contactado para proceder a la fabricación.</p>
                </div>
            </section>

            <section className={styles.legalSection} id="precios">
                <div className={styles.sectionBadge}>TRANSACCIONES</div>
                <h2>02. Precios e Impuestos</h2>
                <p>
                    Todos los precios mostrados en la web incluyen el IVA aplicable en España. Los gastos de envío se calcularán en el checkout basándose en tu ubicación.
                </p>
            </section>

            <section className={styles.legalSection} id="desistimiento">
                <div className={styles.sectionBadge}>DEVOLUCIONES</div>
                <h2>03. Excepción al Derecho de Desistimiento</h2>
                <p>
                    <strong>Art. 103 LSSI:</strong> El derecho de desistimiento no se aplica a bienes claramente personalizados o fabricados bajo las especificaciones del consumidor.
                </p>
                <ul>
                    <li><strong>Encargos e IA:</strong> No admiten devolución una vez iniciada la producción.</li>
                    <li><strong>Defectos:</strong> En caso de tara o error en el diseño por nuestra parte, repondremos la pieza sin coste adicional.</li>
                </ul>
            </section>

            <section className={styles.legalSection} id="propiedad">
                <div className={styles.sectionBadge}>AUTORÍA</div>
                <h2>04. Propiedad Intelectual de los Diseños</h2>
                <p>
                    Si utilizas el Laboratorio IA para crear un diseño, Hygge Rug se reserva el derecho de fabricarlo. Los diseños compartidos en la Colección Colectiva podrán ser adquiridos por otros usuarios de la comunidad.
                </p>
            </section>
        </LegalPageWrapper>
    );
}
