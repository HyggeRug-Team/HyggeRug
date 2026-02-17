import styles from "./cuenta.module.css";
import React from 'react';
import StatsCards from "@/components/ui/Card/StatsCard";
import { AiFillAccountBook } from "react-icons/ai";
import UserDetails from "@/components/dashboard/UserDetails/UserDetails";

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
      <UserDetails/>
    </div>
  );
}
