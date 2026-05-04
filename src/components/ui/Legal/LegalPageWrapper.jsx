"use client";

/**
 * @file LegalPageWrapper.jsx
 * @description Componente envoltorio para páginas legales con estética premium.
 * 
 * [Nuestro enfoque]
 * Creamos una estructura limpia y muy legible para textos largos, utilizando 
 * márgenes generosos y una tipografía clara para que la lectura legal no sea pesada.
 */

import { motion } from 'framer-motion';
import { FaShieldHalved } from 'react-icons/fa6';
import styles from './LegalPageWrapper.module.css';

export default function LegalPageWrapper({ title, lastUpdated, navItems = [], children }) {
    return (
        <div className={styles.legalWrapper}>
            <div className={styles.legalContainer}>
                <motion.header 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.legalHeader}
                >
                    <div className={styles.headerIcon}><FaShieldHalved /></div>
                    <div className={styles.badgeGlow}>{lastUpdated || 'INFO LEGAL'}</div>
                    <h1 className={styles.titleLoud}>{title}</h1>
                </motion.header>
                
                <div className={styles.legalGrid}>
                    <aside className={styles.legalSidebar}>
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className={styles.sidebarBox}
                        >
                            <div className={styles.sidebarTitle}>ÍNDICE DE CONTENIDO</div>
                            <nav className={styles.legalNav}>
                                {navItems.map((item, idx) => (
                                    <a key={idx} href={`#${item.id}`} className={styles.navLink}>
                                        <span>0{idx + 1}</span> {item.label}
                                    </a>
                                ))}
                            </nav>
                        </motion.div>
                    </aside>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={styles.legalContent}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
