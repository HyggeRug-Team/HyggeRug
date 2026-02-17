import React from 'react';
import styles from './UserDetails.module.css';
import { verifySession } from "@/lib/auth";
import { cookies } from 'next/headers';
import SectionWrapper from '@/components/ui/Containers/SectionWrapper/SectionWrapper';
import { MdEdit } from "react-icons/md";

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
    </SectionWrapper>
  )
}