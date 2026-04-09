/**
 * @file UserDetails.jsx
 * @description Presentación y gestión del perfil del usuario en el panel privado.
 * 
 * [Nuestro enfoque]
 * Hemos diseñado este componente para que sea la "tarjeta de identidad" del usuario dentro de su panel. 
 * Lo más especial es que es un **Server Component**.
 * 
 * [Por qué lo hemos hecho así]
 * Usar un Server Component nos ayuda a leer la sesión en el servidor y reducir la exposición
 * de información sensible en el navegador.
 *
 * ¿Qué significa esto a nivel técnico?
 * 1. Velocidad Máxima: El servidor lee los datos (`cookies`) y genera el HTML antes de mandarlo 
 *    al navegador. Esto hace que la página aparezca casi instantáneamente (First-Paint).
 * 2. Seguridad Blindada: Al procesar el Token (JWT) directamente en el servidor, nunca exponemos 
 *    las claves secretas al navegador del usuario, lo que hace que robar la sesión sea 
 *    muchísimo más difícil para un atacante.
 * 3. Diseño Modular: Usamos piezas más pequeñas como `EditableField`, lo que nos permite cambiar 
 *    un solo campo (como el nombre) sin tener que rediseñar todo el perfil.
 */
import React from 'react';
import styles from './UserDetails.module.css';
import { verifySession } from "@/lib/auth";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// Iconos
import { MdEdit } from "react-icons/md";
// Componentes
import SectionWrapper from '@/components/ui/Containers/SectionWrapper/SectionWrapper';
import EditableField from '@/components/ui/EditableInfo/EditableInfoModal/EditableInfoModal';

export default async function UserDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = await verifySession(token);

  if (!session) redirect('/auth');

  return (
    <SectionWrapper>
      <div className={styles.leftContainer}>
        <div className={styles.imageContainer}>
          <img
            src={session.profileImage || "/profile-default.png"}
            className={styles.profileImage}
            alt="Foto de perfil"
          />
          <button><MdEdit/></button>
        </div>
        <div className={styles.userLvl}>
          <p>{session.hyggePoints}</p>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.userInfo}>
          <EditableField
            label={"Nombre"}
            value={session.nickname}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}