"use client";

import { useState } from "react";
import { FaTrashCan, FaCircleCheck, FaHouseUser, FaPhone } from "react-icons/fa6";
import styles from "./AddressCard.module.css";

/**
 * Tarjeta individual de dirección.
 * Gestiona sus propias llamadas a la API y notifica al padre mediante callbacks.
 *
 * @param {object}   address       - Datos de la dirección
 * @param {function} onDelete      - Callback: elimina la tarjeta del estado del padre
 * @param {function} onSetDefault  - Callback: actualiza is_default en el estado del padre
 */
export default function AddressCard({ address, onDelete, onSetDefault }) {
  // Controla qué acción está en curso para deshabilitar botones y cambiar textos
  // Valores posibles: null | "delete" | "default"
  const [loading, setLoading] = useState(null);

  // Llama a DELETE /api/addresses/:id y avisa al padre si tiene éxito
  async function handleDelete() {
    setLoading("delete");
    const res = await fetch(`/api/addresses/${address.address_id}`, { method: "DELETE" });

    // Solo actualizamos el estado del padre si la API confirmó el borrado
    if (res.ok) onDelete(address.address_id);
    setLoading(null);
  }

  // Llama a PATCH /api/addresses/:id y avisa al padre si tiene éxito
  async function handleSetDefault() {
    setLoading("default");
    const res = await fetch(`/api/addresses/${address.address_id}`, { method: "PATCH" });

    // Solo actualizamos el estado del padre si la API confirmó el cambio
    if (res.ok) onSetDefault(address.address_id);
    setLoading(null);
  }

  return (
    <div className={`${styles.addressCard} ${address.is_default ? styles.defaultCard : ""}`}>

      {/* Badge visible solo en la dirección predeterminada */}
      {address.is_default && (
        <div className={styles.defaultBadge}>
          <FaCircleCheck /> PREDETERMINADA
        </div>
      )}

      {/* Cabecera: icono + ciudad y país */}
      <div className={styles.cardHeader}>
        <FaHouseUser className={styles.houseIcon} />
        <span className={styles.cityText}>{address.ciudad}, {address.pais}</span>
      </div>

      {/* Cuerpo: datos completos de la dirección */}
      <div className={styles.cardBody}>
        <h4 className={styles.streetName}>{address.calle}</h4>
        <p className={styles.extraInfo}>{address.portal_piso_puerta}</p>
        <p className={styles.postalInfo}>{address.codigo_postal} • {address.provincia}</p>
        <div className={styles.phoneRow}>
          <FaPhone className={styles.phoneIcon} />
          <span>{address.phone_number}</span>
        </div>
      </div>

      {/* Acciones: eliminar siempre visible, marcar predeterminada solo si no lo es */}
      <div className={styles.cardActions}>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={loading === "delete"}
        >
          <FaTrashCan /> {loading === "delete" ? "Eliminando..." : "Eliminar"}
        </button>

        {!address.is_default && (
          <button
            className={styles.setAsDefaultBtn}
            onClick={handleSetDefault}
            disabled={loading === "default"}
          >
            {loading === "default" ? "Guardando..." : "Marcar predeterminada"}
          </button>
        )}
      </div>
    </div>
  );
}