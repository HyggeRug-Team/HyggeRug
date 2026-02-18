import React from 'react';
import styles from './UserDetails.module.css';
import { verifySession } from "@/lib/auth";
import { cookies } from 'next/headers';
// Iconos
import { MdEdit } from "react-icons/md";
// Componentes
import SectionWrapper from '@/components/ui/Containers/SectionWrapper/SectionWrapper';
import EditableField from '@/components/ui/EditableInfo/EditableInfoModal/EditableInfoModal';

export default async function UserDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = await verifySession(token);

  return (
    <SectionWrapper>
      <div className={styles.leftContainer}>
        <div className={styles.imageContainer}>
          <img src={session.profileImage} className={styles.profileImage}>
          </img>
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