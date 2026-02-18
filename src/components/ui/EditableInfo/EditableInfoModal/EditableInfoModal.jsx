'use client';
import { useState } from 'react';
import styles from './EditableInfoModal.module.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import PrimaryButton from '../../Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../Buttons/SecondaryButton/SecondaryButton';
import TertiaryButton from '../../Buttons/TertiaryButton/TertiaryButton';
// onSave es una variable que recibe el padre con el valor nuevo 
// (Las variables de los componentes solo tienen un "dueño", es decir solo es el hijo o el padre el que escribe info en esa variable y el otro la recibe)
export default function EditableField({ label, value, inputType = "text", onSave }) {
    // Estado para saber si el modal se ve o no
    const [showModal, setShowModal] = useState(false);

    // Guardamos el value en una variable reactiva 
    const [name, setName] = useState(value);

    // Función que cambia el valor de onSave y cierra el modal
    const handleSave = () => {
        onSave(name);
        setShowModal(false);
    };

    return (
        <div className={styles.row}>
            {/* --- VISTA NORMAL EN LA PÁGINA --- */}
            <div className={styles.info} >
                <span className={styles.label}>{label}</span>
                <div className={styles.editBtn} onClick={() => setShowModal(true)}>
                <p className={styles.displayValue}>{name}</p>
                <MdOutlineModeEditOutline />
                </div>
            </div>

            {/* --- EL MODAL (Solo existe si showModal es true) --- */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    {/* Al pulsar en el fondo, se cierra */}
                    <div className={styles.backdrop} onClick={() => setShowModal(false)} />

                    <div className={styles.modalContent}>
                        <h3>Modificar {label}</h3>

                        <input
                            type={inputType}
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />

                        <div className={styles.actions}>
                            <PrimaryButton
                                text={"Cancelar"}
                                // El onclick siempre que tenga un parametro debe ir asi, ya que si no se ejecutaria directamente, asi solo le estás dando una herramienta
                                onClick={() => setShowModal(false)}
                            />

                            <TertiaryButton
                                text={"Actualizar"}
                                // En este caso no hace falta () => Porque la función no tiene parametros de entrada
                                onClick={handleSave}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}