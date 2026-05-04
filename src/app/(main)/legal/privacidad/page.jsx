/**
 * @file page.jsx (Privacidad)
 * @description Gestión de datos personales y cumplimiento del RGPD.
 *
 * [Nuestro enfoque]
 * Garantizamos la protección de la identidad de nuestros clientes y el uso 
 * responsable de los datos recogidos para la fabricación de alfombras.
 *
 * [Por qué lo hemos hecho así]
 * En Hygge Rug, la confianza es el pilar de la artesanía personalizada. Cumplimos 
 * estrictamente con el RGPD y la LOPDGDD para asegurar un entorno de compra seguro.
 */

export const metadata = {
    title: 'Política de Privacidad | Hygge Rug - Datos Protegidos',
    description: 'Conoce cómo protegemos tus datos personales en Hygge Rug. Transparencia total en el tratamiento de información para tus pedidos de tufting y diseños personalizados.',
    keywords: 'Privacidad, RGPD, Protección de datos, Hygge Rug, Madrid, alfombras seguras, taller artesanal'
};

import React from 'react';
import LegalPageWrapper from '@/components/ui/Legal/LegalPageWrapper';
import styles from '@/components/ui/Legal/LegalPageWrapper.module.css';

export default function PrivacidadPage() {
    const navItems = [
        { id: 'responsable', label: 'Responsable' },
        { id: 'finalidad', label: 'Finalidad' },
        { id: 'conservacion', label: 'Conservación' },
        { id: 'derechos', label: 'Tus Derechos' },
    ];

    return (
        <LegalPageWrapper 
            title="Privacidad" 
            lastUpdated="Protección de Datos"
            navItems={navItems}
        >
            <section className={styles.legalSection} id="responsable">
                <div className={styles.sectionBadge}>CONTROLADOR</div>
                <h2>01. Responsable del Tratamiento</h2>
                <p>
                    Tus datos son gestionados directamente por el equipo de <strong>Hygge Rug</strong>, con sede en Madrid, España. Nos tomamos tu privacidad tan en serio como la calidad de nuestras alfombras.
                </p>
                <ul>
                    <li><strong>Email Directo:</strong> hyggerug@gmail.com</li>
                    <li><strong>Normativa:</strong> RGPD (UE) 2016/679</li>
                </ul>
            </section>

            <section className={styles.legalSection} id="finalidad">
                <div className={styles.sectionBadge}>POR QUÉ?</div>
                <h2>02. Finalidad del Tratamiento</h2>
                <p>Tratamos la información que nos facilitas con el fin de prestarte el servicio solicitado:</p>
                <ul>
                    <li>Gestionar la compra y envío de tus alfombras.</li>
                    <li>Procesar tus diseños en el Laboratorio IA.</li>
                    <li>Resolver dudas técnicas o de diseño.</li>
                </ul>
            </section>

            <section className={styles.legalSection} id="conservacion">
                <div className={styles.sectionBadge}>TIEMPO</div>
                <h2>03. Conservación de los Datos</h2>
                <p>
                    Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales (generalmente 6 años para temas fiscales).
                </p>
            </section>

            <section className={styles.legalSection} id="derechos">
                <div className={styles.sectionBadge}>TU PODER</div>
                <h2>04. Tus Derechos (ARCO+)</h2>
                <p>
                    Tienes derecho a obtener confirmación sobre si en Hygge Rug estamos tratando tus datos personales. Puedes acceder, rectificar, suprimir u oponerte al tratamiento.
                </p>
                <div className={styles.highlightBox}>
                    <p>Escríbenos a <strong>hyggerug@gmail.com</strong> indicando el derecho que deseas ejercer. Te responderemos en el plazo legal de un mes.</p>
                </div>
            </section>
        </LegalPageWrapper>
    );
}
