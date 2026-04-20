/**
 * @file UserDetails.jsx
 * @description Componente de servidor para gestionar y visualizar el perfil privado del usuario.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que actúe como un espejo de la página de Login/Registro. 
 * Al ser un Server Component, garantiza que los datos (como los puntos Hygge) se consulten 
 * directamente a la BBDD, evitando que el usuario vea información desactualizada de las cookies.
 * 
 * [Por qué lo hemos hecho así]
 * Mantener el mismo lenguaje visual que el inicio de sesión (`max-width: 450px`, glassmorphism) 
 * crea una experiencia de usuario (UX) fluida y coherente. El uso de Server Actions permite 
 * editar los datos de forma segura sin recargar la página.
 */

import React from 'react';
import styles from './UserDetails.module.css';
import { verifySession } from "@/lib/auth";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from "@/lib/db/users";
import { updateUserData } from "@/lib/actions";
// Iconos
import { FaUserPen } from "react-icons/fa6";
// Componentes
import EditableField from '@/components/ui/EditableInfo/EditableInfoModal/EditableInfoModal';
import EditableAvatar from './EditableAvatar';

// Acciones de actualización (Server Actions)
/**
 * Envuelve la lógica de actualización para la foto de perfil.
 * @param {string} newValue Nueva URL de imagen.
 */
const handleUpdateAvatar = async (newValue) => {
  'use server';
  await updateUserData('profile_image', newValue);
};

/**
 * Envuelve la lógica de actualización para el nickname.
 * @param {string} newValue Nuevo apodo para el usuario.
 */
const handleUpdateNickname = async (newValue) => {
  'use server';
  await updateUserData('nickname', newValue);
};

/**
 * Envuelve la lógica de actualización para el correo.
 * @param {string} newValue Nuevo email para el usuario.
 */
const handleUpdateEmail = async (newValue) => {
  'use server';
  await updateUserData('email', newValue);
};

export default async function UserDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = await verifySession(token);

  if (!session) redirect('/auth');

  // Datos frescos de la BBDD
  const userId = session.userId || session.user_id || session.id;
  const dbUser = await getUserById(userId);

  const userData = dbUser || session;

  return (
    <div className={styles.detailsCard}>
      
      {/* CABECERA: Al estilo del Login */}
      <div className={styles.profileHeader}>
        <EditableAvatar 
          currentImage={userData.profile_image || userData.profileImage}
          onSave={handleUpdateAvatar}
        />
        
        <div className={styles.pointsContainer}>
          <span className={styles.pointsValue}>{userData.hygge_points ?? userData.hyggePoints ?? 0}</span>
          <span className={styles.pointsLabel}>Puntos Hygge</span>
        </div>
      </div>

      {/* CUERPO: Campos de edición como los inputs de Auth */}
      <div className={styles.formSection}>
          <EditableField
              label={"¿Cómo te llamamos? (Nickname)"}
              value={userData.nickname}
              onSave={handleUpdateNickname}
          />
          <EditableField
              label={"Correo electrónico"}
              value={userData.email}
              onSave={handleUpdateEmail}
          />
      </div>

    </div>
  )
}