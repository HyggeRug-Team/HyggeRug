import styles from "./cuenta.module.css";
import React from 'react';

export const metadata = {
  title: "Mi Cuenta | Hygge Rug",
  description: "Edita tu información personal",
};

/**
 * Página Principal de Cuenta
 * 
 * Permite cambiar datos personales, foto de perfil y contraseña.
 */
export default function CuentaPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Detalles de la Cuenta</h1>
      
      <div className={styles.formsContainer}>
        {/* Formularios de edición */}
      </div>
    </div>
  );
}
