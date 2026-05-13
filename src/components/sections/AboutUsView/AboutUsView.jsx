/**
 * @file AboutUsView.jsx
 * @description Vista rediseñada de "Sobre Nosotros" con estética pop-grunge y animaciones integrales.
 *
 * [Nuestro enfoque]
 * Hemos transformado la página en una narrativa visual asimétrica. Usamos una cuadrícula 
 * rota, tipografía de gran impacto y una paleta de colores vibrantes sobre fondo oscuro.
 *
 * [Por qué lo hemos hecho así]
 * Para que la página de "Sobre Nosotros" transmita la misma energía que las alfombras: 
 * algo único, artesanal y con mucha actitud. Separamos el contenido en pilares claros 
 * y un manifiesto central.
 */

"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    FaHeart, 
    FaMagic, 
    FaPalette, 
    FaUsers, 
    FaRegHandshake,
    FaBolt,
    FaBoxOpen,
    FaShieldAlt,
    FaFeather
} from 'react-icons/fa';

import styles from '@/app/(main)/sobre-nosotros/page.module.css';
import Breadcrumbs from '@/components/ui/Breadcrumbs/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import Timeline from '@/components/ui/Timeline/Timeline';
import MarqueeStrip from '@/components/sections/MarqueeStrip/MarqueeStrip';

// Variantes de animación reutilizables para consistencia
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true }
};

export default function AboutUsView() {
    
    const pillars = [
        {
            icon: <FaUsers />,
            title: "COMUNIDAD",
            desc: "No somos una tienda estática. Los diseños nacen de lo que tú y otros usuarios pedís, creando un catálogo vivo y compartido.",
            color: "var(--accent-purple)"
        },
        {
            icon: <FaMagic />,
            title: "INTELIGENCIA",
            desc: "Fusionamos la IA con la lana. Usamos tecnología de vanguardia para que cualquier idea pueda convertirse en un boceto perfecto.",
            color: "var(--accent-cyan)"
        },
        {
            icon: <FaPalette />,
            title: "ARTESANÍA",
            desc: "Cada punto está disparado a mano en nuestro taller de Madrid. Sin fábricas, sin prisas. Solo dedicación pura.",
            color: "var(--highlight-text)"
        }
    ];

    const processSteps = [
        { num: "01", title: "CONEXIÓN", desc: "Hablamos de tú a tú para entender qué quieres transmitir en tu suelo." },
        { num: "02", title: "DISPARO", desc: "Inyecto la lana con la tufting gun sobre el lienzo tensado al máximo." },
        { num: "03", title: "ESCULTURA", desc: "Uso tijeras y máquinas de perfilado para dar relieve y vida al diseño." },
        { num: "04", title: "ENTREGA", desc: "Sello la pieza y la envío a tu casa lista para durar décadas." },
    ];

    const qualityStats = [
        { icon: <FaFeather />, label: "LANA TÉCNICA", text: "Suave al tacto pero ultra resistente al trote diario." },
        { icon: <FaShieldAlt />, label: "BASE ANTI-SLIP", text: "Acabado en TPR para que la alfombra no se mueva ni un milímetro." },
        { icon: <FaBoxOpen />, label: "UNBOXING EXCLUSIVO", text: "Cuidamos cada detalle del envío para que la experiencia empiece al abrir la caja." },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.pageContainer}
        >
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Breadcrumbs items={[{ label: 'Sobre Nosotros' }]} />
            </motion.div>

            {/* --- SECTION 1: HERO ASIMÉTRICO --- */}
            <section className={styles.heroSplit}>
                <motion.div 
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={styles.heroTextSide}
                >
                    <div className={styles.badgeGlow}>
                        <FaBolt style={{ marginRight: '8px' }} /> EST. 2024 MADRID
                    </div>
                    <h1 className={styles.titleMain}>
                        TUFTING <br />
                        <span className={styles.titleHighlight}>WITH SOUL</span>
                    </h1>
                    <p className={styles.heroDescription}>
                        Somos un equipo en Madrid transformando ideas salvajes en piezas textiles de alta fidelidad. Hygge Rug nació para romper con la decoración genérica y traer el arte urbano directamente a tus pies.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "backOut" }}
                    className={styles.heroVisualSide}
                >
                    <div className={styles.mainImageContainer}>
                        <Image 
                            src="/images/about/workshop_main.png" 
                            alt="Nuestro taller en Madrid" 
                            fill 
                            priority
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <motion.div 
                        initial={{ x: 20, y: 20, opacity: 0 }}
                        whileInView={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={styles.floatingImageBadge}
                    >
                        <Image 
                            src="/images/about/artisan_action.png" 
                            alt="Tufting process" 
                            fill 
                            style={{ objectFit: 'cover' }}
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* --- SECTION 2: EL MANIFIESTO --- */}
            <motion.section 
                {...fadeInUp}
                className={styles.manifestoSection}
            >
                <p className={styles.manifestoText}>
                    "NO HACEMOS ALFOMBRAS. CREAMOS <span>PUNTOS DE ENCUENTRO</span> ENTRE TU IMAGINACIÓN Y LA MEJOR LANA DEL MERCADO."
                </p>
            </motion.section>

            {/* --- SECTION 3: LOS PILARES --- */}
            <section className={styles.pillarsSection}>
                <motion.div {...fadeInUp}>
                    <SectionHeader 
                        badge="ADN HYGGE" 
                        icon={FaHeart} 
                        title="NUESTROS PILARES" 
                        description="Lo que nos diferencia de las grandes superficies y las copias baratas."
                    />
                </motion.div>
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className={styles.pillarsGrid}
                >
                    {pillars.map((pillar, i) => (
                        <motion.div 
                            key={i}
                            variants={fadeInUp}
                            className={styles.pillarCard}
                        >
                            <div className={styles.pillarIcon} style={{ color: pillar.color }}>
                                {pillar.icon}
                            </div>
                            <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                            <p className={pillar.pillarDesc}>{pillar.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* --- SECTION 4: EL PROCESO (EL ÁRBOL) --- */}
            <section className={styles.processLayout}>
                <div className={styles.processVisual}>
                    <motion.div 
                        initial={{ opacity: 0, x: -100, rotate: -10 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={styles.actionImage}
                    >
                        <Image 
                            src="/images/about/artisan_action.png" 
                            alt="Artisan working" 
                            fill 
                            style={{ objectFit: 'cover' }}
                        />
                    </motion.div>
                </div>
                <motion.div 
                    {...fadeInUp}
                    className={styles.processInfo}
                >
                    <SectionHeader 
                        badge="WORKFLOW" 
                        icon={FaRegHandshake} 
                        title="EL PROCESO ARTESANAL" 
                        description="Cada Hygge Rug pasa por nuestras manos. De principio a fin."
                    />
                    <div style={{ marginTop: '3rem' }}>
                        <Timeline steps={processSteps} />
                    </div>
                </motion.div>
            </section>

            {/* --- SECTION 5: CALIDAD SIN COMPROMISOS --- */}
            <section style={{ marginBottom: '8rem' }}>
                <motion.div {...fadeInUp}>
                    <SectionHeader 
                        badge="MATERIALES" 
                        icon={FaBolt} 
                        title="CALIDAD SIN EXCUSAS" 
                        description="Porque el arte que se pisa tiene que ser indestructible."
                    />
                </motion.div>
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '2rem', 
                        marginTop: '4rem' 
                    }}
                >
                    {qualityStats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            variants={fadeInUp}
                            style={{ 
                                background: 'rgba(255,255,255,0.03)', 
                                padding: '2.5rem', 
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                                {stat.icon}
                            </div>
                            <h4 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>{stat.label}</h4>
                            <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', lineHeight: '1.5' }}>{stat.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

        </motion.div>
    );
}
