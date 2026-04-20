/**
 * @file direcciones/page.jsx
 * @description Gestión de libreta de direcciones del usuario.
 * 
 * [Nuestro enfoque]
 * Permitimos al usuario gestionar múltiples puntos de entrega, marcando uno como 
 * preferido para agilizar futuros checkouts.
 * 
 * [Por qué lo hemos hecho así]
 * Facilitar la gestión de direcciones reduce la fricción en el momento de la compra 
 * y mejora la UX al ofrecer un control claro sobre los datos de envío.
 */

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAddressesByUser } from "@/lib/db/addresses";
import styles from "./direcciones.module.css";
import React from 'react';
import Link from "next/link";
import WeatherWidget from "@/components/ui/WeatherWidget/WeatherWidget";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";
import { 
  FaMapLocationDot, 
  FaPhone, 
  FaHouseUser, 
  FaPlus,
  FaCircleCheck,
  FaTrashCan
} from "react-icons/fa6";

export default async function DireccionesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/auth");
  }

  const userId = session.user_id || session.id;
  let addresses = [];

  try {
      addresses = await getAddressesByUser(userId);
  } catch (err) {
      console.error("Error cargando direcciones:", err);
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ========== HEADER ========== */}
      <header className={styles.headerSection}>
        <div className={styles.greeting}>
            <h1>Tus Direcciones</h1>
            <p>Gestiona dónde quieres recibir tus alfombras custom.</p>
        </div>
        
        <div className={styles.headerWidgets}>
          <WeatherWidget />
        </div>
      </header>

      <main className={styles.mainContentGrid}>
        <div className={styles.actionsBar}>
            <PrimaryButton 
                text="AÑADIR DIRECCIÓN" 
                url="/dashboard/direcciones/nueva" 
                Icon={FaPlus} 
            />
        </div>

        <div className={styles.addressGrid}>
          {addresses.length === 0 ? (
             <div className={styles.emptyStateCard}>
                <FaMapLocationDot size={60} color="var(--grey-600)" />
                <h3 className={styles.emptyTitle}>SIN DIRECCIONES</h3>
                <p>Aún no has guardado ninguna ubicación para envíos.</p>
             </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.address_id} className={`${styles.addressCard} ${addr.is_default ? styles.defaultCard : ''}`}>
                {addr.is_default && (
                    <div className={styles.defaultBadge}>
                        <FaCircleCheck /> PREDETERMINADA
                    </div>
                )}
                
                <div className={styles.cardHeader}>
                    <FaHouseUser className={styles.houseIcon} />
                    <span className={styles.cityText}>{addr.ciudad}, {addr.pais}</span>
                </div>

                <div className={styles.cardBody}>
                    <h4 className={styles.streetName}>{addr.calle}</h4>
                    <p className={styles.extraInfo}>{addr.portal_piso_puerta}</p>
                    <p className={styles.postalInfo}>{addr.codigo_postal} • {addr.provincia}</p>
                    
                    <div className={styles.phoneRow}>
                        <FaPhone className={styles.phoneIcon} />
                        <span>{addr.phone_number}</span>
                    </div>
                </div>

                <div className={styles.cardActions}>
                    <button className={styles.deleteBtn}>
                        <FaTrashCan /> Eliminar
                    </button>
                    {!addr.is_default && (
                        <button className={styles.setAsDefaultBtn}>
                            Marcar predeterminada
                        </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
