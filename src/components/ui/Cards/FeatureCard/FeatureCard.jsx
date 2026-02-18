import React from "react";
import styles from "./FeatureCard.module.css";
import { motion } from "framer-motion";


// Definimos nuestra tarjeta de características con animación de entrada y diseño limpio
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.5 }} 
      transition={{ 
        delay: delay, 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{desc}</p>
    </motion.div>
  );
}

export default FeatureCard;
