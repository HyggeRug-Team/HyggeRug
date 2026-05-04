/**
 * @file page.jsx (Aviso Legal)
 * @description Transparencia legal obligatoria según la LSSI-CE.
 *
 * [Nuestro enfoque]
 * Proporcionamos los datos fiscales y legales de forma clara y accesible, cumpliendo 
 * con la normativa de transparencia en el comercio electrónico.
 *
 * [Por qué lo hemos hecho así]
 * Un aviso legal sólido no solo es obligatorio, sino que genera la confianza 
 * necesaria en un negocio de artesanía personalizada como Hygge Rug.
 */

export const metadata = {
    title: 'Aviso Legal | Hygge Rug - Tufting Artesanal Madrid',
    description: 'Información legal, fiscal y de propiedad intelectual de Hygge Rug. Tu taller de alfombras personalizadas y tufting art en Madrid.',
    keywords: 'Aviso legal, Hygge Rug, Tufting Madrid, LSSI-CE, alfombras personalizadas, artesanía textil'
};

import React from 'react';
import LegalPageWrapper from '@/components/ui/Legal/LegalPageWrapper';
import styles from '@/components/ui/Legal/LegalPageWrapper.module.css';

export default function AvisoLegalPage() {
    const navItems = [
        { id: 'identificacion', label: 'Identificación' },
        { id: 'objeto', label: 'Objeto' },
        { id: 'responsabilidad', label: 'Responsabilidad' },
        { id: 'propiedad', label: 'Propiedad' },
        { id: 'cookies', label: 'Cookies' },
    ];

    return (
        <LegalPageWrapper 
            title="Aviso Legal" 
            lastUpdated="Transparencia Legal"
            navItems={navItems}
        >
            <section className={styles.legalSection} id="identificacion">
                <div className={styles.sectionBadge}>DATOS FISCALES</div>
                <h2>01. Identificación del Titular</h2>
                <p>
                    En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
                </p>
                <ul>
                    <li><strong>Titular:</strong> Hygge Rug</li>
                    <li><strong>Responsable:</strong> [TU NOMBRE O NOMBRE EMPRESA]</li>
                    <li><strong>NIF/CIF:</strong> [TU NIF/CIF]</li>
                    <li><strong>Domicilio:</strong> Madrid, España.</li>
                    <li><strong>Email:</strong> hyggerug@gmail.com</li>
                </ul>
            </section>

            <section className={styles.legalSection} id="objeto">
                <div className={styles.sectionBadge}>SERVICIO</div>
                <h2>02. Objeto</h2>
                <p>
                    El titular pone a disposición de los usuarios el presente documento para dar cumplimiento a las obligaciones legales y para informar sobre las condiciones de uso del sitio web. Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de las disposiciones aquí dispuestas.
                </p>
            </section>

            <section className={styles.legalSection} id="responsabilidad">
                <div className={styles.sectionBadge}>LIMITACIONES</div>
                <h2>03. Responsabilidad</h2>
                <p>
                    El titular se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio web, siempre que esta información haya sido manipulada o introducida por un tercero ajeno al mismo.
                </p>
                <div className={styles.highlightBox}>
                    <p>Hygge Rug no se hace responsable de las interrupciones técnicas del servicio o del uso indebido que los usuarios puedan hacer de las herramientas de personalización (IA).</p>
                </div>
            </section>

            <section className={styles.legalSection} id="propiedad">
                <div className={styles.sectionBadge}>COPYRIGHT</div>
                <h2>04. Propiedad Intelectual e Industrial</h2>
                <p>
                    El sitio web, incluyendo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos son propiedad del titular o dispone de licencia o autorización expresa por parte de los autores.
                </p>
                <p>
                    Cualquier uso no autorizado previamente por parte del titular será considerado un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
                </p>
            </section>

            <section className={styles.legalSection} id="cookies">
                <div className={styles.sectionBadge}>RASTREO</div>
                <h2>05. Cookies y Enlaces</h2>
                <p>
                    Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia de navegación. Para más detalle, consulta nuestra <a href="/legal/cookies">Política de Cookies</a>.
                </p>
                <p>
                    En el caso de que en este sitio web se dispusiesen enlaces hacia otros sitios de Internet, el titular no ejercerá ningún tipo de control sobre dichos sitios y contenidos.
                </p>
            </section>
        </LegalPageWrapper>
    );
}
