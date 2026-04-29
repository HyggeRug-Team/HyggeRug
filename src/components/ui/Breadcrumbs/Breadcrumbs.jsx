/**
 * @file Breadcrumbs.jsx
 * @description Componente de navegación secundaria (migas de pan).
 */
import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className={styles.container} aria-label="Breadcrumb">
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link href="/" className={styles.link}>Inicio</Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <FaChevronRight className={styles.separator} />
                        {item.href ? (
                            <Link href={item.href} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.current} aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
