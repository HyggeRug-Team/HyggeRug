'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBrain, FaArrowRight, FaPalette } from 'react-icons/fa6';
import styles from './IaDesactivada.module.css';

export default function IaDesactivada() {
  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icono */}
        <motion.div
          className={styles.iconBox}
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          <FaBrain className={styles.icon} />
          <span className={styles.iconBadge}>OFF</span>
        </motion.div>

        {/* Texto */}
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className={styles.eyebrow}>Laboratorio IA</p>
          <h1 className={styles.title}>
            La IA se ha<br />tomado un descanso
          </h1>
          <p className={styles.body}>
            Seamos honestos: la IA es cara 🫣 y de momento la hemos pausado.
            Pero eso no significa que te quedes sin tu alfombra perfecta.
            <strong> Nuestro equipo de diseñadores lo hace igual de bien — o mejor.</strong>
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Link href="/personalizar" className={styles.primaryBtn}>
            <FaPalette />
            Cuéntanos tu diseño
            <FaArrowRight className={styles.arrow} />
          </Link>
          <Link href="/tienda" className={styles.secondaryBtn}>
            Ver colección
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
