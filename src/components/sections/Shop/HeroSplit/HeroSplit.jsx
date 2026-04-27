/**
 * @file HeroSplit.jsx
 * @description Estructura de dos columnas para secciones principales (Hero).
 *
 * [Nuestro enfoque]
 * Hemos diseñado este componente para ser la pieza central de las páginas de primer 
 * nivel, permitiendo un equilibrio perfecto entre branding visual y llamadas a la acción.
 *
 * [Por qué lo hemos hecho así]
 * 1. Jerarquía clara: Separa el branding (izquierda) del texto explicativo y CTA (derecha).
 * 2. Adaptabilidad: Es totalmente responsive, pasando a una sola columna en móviles.
 * 3. Consistencia: Unifica cómo presentamos el título y descripción en distintas secciones.
 *
 * Props:
 * - tag: Pequeña etiqueta sobre el título.
 * - title: Título principal.
 * - titleAccent: Parte del título con estilo de borde (outline).
 * - subtitle: Subtítulo secundario.
 * - description: Texto explicativo.
 * - primaryAction: Objeto { label, link } para el botón principal.
 */
import React from 'react';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import styles from './HeroSplit.module.css';
const HeroSplit = ({ 
    tag, 
    title, 
    titleAccent, 
    subtitle, 
    description, 
    primaryAction 
}) => {
    return (
        <div className={styles.heroWrapper}>
            {/* LADO IZQUIERDO: Branding y Títulos */}
            <div className={styles.leftCol}>
                {tag && <span className={styles.tagBadge}>{tag}</span>}
                <h1 className={styles.mainHeading}>
                    {title} {titleAccent && <span className={styles.accent}>{titleAccent}</span>}
                </h1>
                {subtitle && <h2 className={styles.subHeading}>{subtitle}</h2>}
            </div>

            {/* LADO DERECHO: Texto de apoyo y Acción */}
            <div className={styles.rightCol}>
                {description && <p className={styles.description}>{description}</p>}
                {primaryAction && (
                    <div className={styles.actions}>
                        <PrimaryButton text={primaryAction.label} url={primaryAction.link} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSplit;
