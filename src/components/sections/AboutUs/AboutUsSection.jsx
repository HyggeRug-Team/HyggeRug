'use client';

/**
 * @file AboutUsSection.jsx
 * @description Rediseño cinematográfico de la sección "Sobre Nosotros".
 * 
 * [Nuestro enfoque]
 * Utilizamos tipografía SplitText para impacto visual, una cuadrícula editorial 
 * y elementos flotantes que transmiten la naturaleza artesanal y premium de la marca.
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaMagic, FaPalette, FaUsers } from 'react-icons/fa';
import styles from './AboutUsSection.module.css';

const AboutUsSection = () => {
  const pillars = [
    {
      id: '01',
      icon: <FaUsers />,
      title: 'Diseños de la Comunidad',
      text: 'Alfombras de diseños que otros usuarios han pedido anteriormente y que están disponibles en nuestro catálogo. Piezas probadas y amadas.',
      color: 'var(--accent-purple)'
    },
    {
      id: '02',
      icon: <FaMagic />,
      title: 'Generación por IA',
      text: 'Introduce un texto (prompt) o una imagen en nuestra web, la Inteligencia Artificial genera un diseño único y yo lo convierto en una alfombra real.',
      color: 'var(--accent-cyan)'
    },
    {
      id: '03',
      icon: <FaPalette />,
      title: 'Personalización Total',
      text: 'Envíame directamente la imagen o idea que tienes en mente y trabajaré contigo para crear una alfombra 100% a medida.',
      color: 'var(--highlight-text)'
    }
  ];

  return (
    <div className={styles.aboutWrapper}>
      {/* 1. HERO STORY SECTION */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <motion.span 
                className={styles.badge}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                PUNTADA A PUNTADA
              </motion.span>
              
              <motion.h1 
                className={styles.mainTitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                EL ALMA DE HYGGE RUG
              </motion.h1>

              <motion.p 
                className={styles.heroText}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Bienvenidos a mi taller. Soy una única persona emprendedora detrás de Hygge Rug, encargándome de todo el proceso: desde diseñar el boceto y atender tus dudas, hasta disparar la última hebra de lana con la pistola de tufting. Busco transmitir la calidez de lo hecho a mano y el concepto danés <strong>'Hygge'</strong>: comodidad, hogar y bienestar.
              </motion.p>
            </div>

            <div className={styles.heroImageWrapper}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut" }}
                style={{ height: '100%', width: '100%' }}
              >
                <Image 
                  src="/images/about/workshop.png"
                  alt="Taller de Hygge Rug"
                  fill
                  className={styles.mainImage}
                  priority
                />
                <div className={styles.floatingTag}>
                  ARTESANÍA REAL
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 PILLARS SECTION */}
      <section className={`${styles.section} ${styles.pillarsSection}`}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center' }}>
             <motion.h2 
                style={{ fontFamily: 'var(--font-titles)', fontSize: '3rem' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                TRES FORMAS DE CREAR
              </motion.h2>
              <p style={{ color: 'var(--secondary-text)', fontSize: '1.2rem', marginTop: '10px' }}>
                Adaptamos nuestro proceso artesanal a tu nivel de creatividad.
              </p>
          </div>

          <div className={styles.pillarGrid}>
            {pillars.map((pillar, index) => (
              <motion.div 
                key={pillar.id}
                className={styles.pillarCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <span className={styles.pillarNumber}>{pillar.id}</span>
                <div className={styles.pillarIcon} style={{ color: pillar.color }}>
                  {pillar.icon}
                </div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarText}>{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE HYGGE SPIRIT */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.hyggeSpirit}>
            <motion.h2 
              className={styles.bigQuote}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              "MÁS QUE UNA ALFOMBRA, ES UNA SENSACIÓN"
            </motion.h2>
            <motion.p 
              className={styles.hyggeText}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Al confiar en Hygge Rug, estás apoyando el trabajo artesanal independiente. 
              Cada centímetro de lana es inyectado con paciencia y cada relieve es perfilado 
              a mano para asegurar que recibas una pieza con alma, algo que las máquinas 
              industriales nunca podrán replicar.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA - Using existing Banner component if possible or local styles */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.container}>
          <motion.div 
            className={styles.aiBanner}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.aiBannerText}>
              <h3>¿LISTO PARA TU PROPIA PIEZA?</h3>
              <p>
                Ya sea un diseño de nuestra comunidad o tu idea más salvaje, 
                estoy listo para ponerme manos a la obra.
              </p>
            </div>
            <motion.a 
              href="/contacto"
              className={styles.badge} 
              style={{ fontSize: '1.5rem', cursor: 'pointer', padding: '15px 30px' }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              HABLAMOS <FaHeart style={{ marginLeft: '10px' }} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsSection;
