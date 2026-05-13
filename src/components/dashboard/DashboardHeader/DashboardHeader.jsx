/**
 * @file DashboardHeader.jsx
 * @description Cabecera unificada para los paneles de administración y cliente.
 */

'use client';

import React from 'react';
import styles from './DashboardHeader.module.css';
import WeatherWidget from '@/components/ui/WeatherWidget/WeatherWidget';
import Link from 'next/link';
import { FaStore } from 'react-icons/fa6';

export default function DashboardHeader({ 
  user, 
  session, 
  isAdmin = false, 
  title, 
  description,
  customNickname,
  showCommunity = false
}) {
  const nickname = customNickname || user?.nickname || session?.nickname || 'Amigo';

  return (
    <header className={styles.headerSection}>
      <div className={styles.greeting}>
        <h1>
          {title ? title : (
            <>
              Hola, {nickname}
              {isAdmin && <span className={styles.adminBadge}>ADMIN</span>}
            </>
          )}
        </h1>
        <p>
          {description ? description : (isAdmin 
            ? "Panel de administración y gestión global." 
            : "Bienvenido de nuevo a tu panel de control.")}
        </p>
      </div>
      
      <div className={styles.headerWidgets}>
        {showCommunity && !isAdmin && (
          <Link href="/tienda" className={styles.viewAllLink}>
            <FaStore style={{marginRight: '8px'}} /> Diseños de la comunidad
          </Link>
        )}
        <WeatherWidget />
      </div>
    </header>
  );
}
