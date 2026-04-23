import React from 'react';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import styles from './HeroSplit.module.css';

/**
 * HERO SPLIT (GENÉRICO)
 * Estructura de dos columnas para secciones principales.
 */
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
