import styles from "./cuenta.module.css";
import React from 'react';
import StatsCards from "@/components/ui/Cards/StatsCard/StatsCard";
import { AiFillAccountBook } from "react-icons/ai";
import UserDetails from "@/components/dashboard/UserDetails/UserDetails";

export const metadata = {
  title: "Mi Cuenta | Hygge Rug",
  description: "Edita tu información personal",
};

/**
 * @file cuenta/page.jsx
 * @description Vista principal de “Detalles de la Cuenta”.
 *
 * [Nuestro enfoque]
 * Hemos construido esta pantalla como contenedor de `UserDetails` para mantener la
 * lógica de perfil separada en un componente.
 *
 * [Por qué lo hemos hecho así]
 * Separar contenedor y componente nos evita repetir lógica y hace el mantenimiento más simple.
 */
export default function CuentaPage() {
  return (
    <div className={styles.container}>
      <UserDetails/>
    </div>
  );
}
