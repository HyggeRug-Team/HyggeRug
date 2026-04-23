"use client";

import { useState } from "react";
import AddressCard from "../AddressCard/AddressCard";
import Modal from "@/components/ui/Modal/Modal";
import AddressForm from "../AddressForm/AddressForm";
import { FaMapLocationDot } from "react-icons/fa6";
import styles from "./AddressList.module.css";
import { FaPlus } from "react-icons/fa6";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton/PrimaryButton";

export default function AddressList({ initialAddresses }) {
    const [addresses, setAddresses] = useState(initialAddresses);

    // Controla la visibilidad del modal de nueva dirección
    const [modalOpen, setModalOpen] = useState(false);

    function handleDelete(id) {
        setAddresses(prev => prev.filter(a => a.address_id !== id));
    }

    function handleSetDefault(id) {
        setAddresses(prev =>
            prev.map(a => ({ ...a, is_default: a.address_id === id }))
        );
    }

    // Añade la nueva dirección al estado local.
    // Si is_default=true reseteamos las demás localmente también
    function handleAddNew(newAddress) {
        setAddresses(prev => {
            const updated = newAddress.is_default
                ? prev.map(a => ({ ...a, is_default: false }))
                : prev;
            return [...updated, newAddress];
        });
    }

    return (
        <>
            {/* Botón para abrir el modal — lo movemos aquí desde page.jsx */}
            <div className={styles.actionsBar}>
                <PrimaryButton
                    text="AÑADIR DIRECCIÓN"
                    Icon={FaPlus}
                    onClick={() => setModalOpen(true)}
                />
            </div>

            {/* Lista de tarjetas o estado vacío */}
            {addresses.length === 0 ? (
                <div className={styles.emptyStateCard}>
                    <FaMapLocationDot size={60} color="var(--grey-600)" />
                    <h3 className={styles.emptyTitle}>SIN DIRECCIONES</h3>
                    <p>Aún no has guardado ninguna ubicación para envíos.</p>
                </div>
            ) : (
                <div className={styles.addressGrid}>
                    {addresses.map(addr => (
                        <AddressCard
                            key={addr.address_id}
                            address={addr}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}

            {/* Modal con el formulario de nueva dirección */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nueva Dirección"
            >
                <AddressForm
                    onSuccess={handleAddNew}
                    onClose={() => setModalOpen(false)}
                />
            </Modal>
        </>
    );
}