/**
 * @file AddressSection.jsx
 * @description Componente para la gestión de direcciones de envío en el carrito.
 * Permite seleccionar entre direcciones existentes o añadir una nueva.
 */

import React from 'react';
import { 
    FaLocationDot, FaPencil, FaHouse, FaEnvelopeOpenText, 
    FaCity, FaEarthEurope, FaPhone, FaPlus 
} from 'react-icons/fa6';
import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import TertiaryButton from '@/components/ui/Buttons/TertiaryButton/TertiaryButton';
import styles from './AddressSection.module.css';

/**
 * @param {Object} props
 * @param {Array} props.addresses - Lista de direcciones del usuario.
 * @param {Object} props.activeAddress - Dirección actualmente seleccionada.
 * @param {string|number} props.selectedAddress - ID de la dirección seleccionada.
 * @param {boolean} props.showAddressList - Estado de la UI para mostrar lista.
 * @param {Function} props.setShowAddressList - Setter para alternar lista.
 * @param {boolean} props.showNewAddressForm - Estado de la UI para el formulario.
 * @param {Function} props.setShowNewAddressForm - Setter para el formulario.
 * @param {Function} props.handleSelectAddress - Manejador de selección.
 * @param {Function} props.handleCreateAddress - Manejador de creación.
 * @param {Object} props.newAddress - Estado del formulario de nueva dirección.
 * @param {Function} props.setNewAddress - Setter del formulario.
 * @param {Object} props.formErrors - Errores de validación.
 * @param {boolean} props.addressLoading - Estado de carga de creación.
 * @param {Object} props.router - Instancia de Next Router.
 */
export default function AddressSection({
    addresses,
    activeAddress,
    selectedAddress,
    showAddressList,
    setShowAddressList,
    showNewAddressForm,
    setShowNewAddressForm,
    handleSelectAddress,
    handleCreateAddress,
    newAddress,
    setNewAddress,
    formErrors,
    addressLoading,
    router
}) {
    return (
        <section className={styles.card}>
            <div className={styles.cardTitle}>
                <FaLocationDot /> DIRECCIÓN DE ENVÍO
            </div>

            {addresses.length === 0 && !showNewAddressForm ? (
                /* Caso: No hay direcciones */
                <div className={styles.noAddresses}>
                    No tienes direcciones guardadas. 
                    <button className={styles.linkBtn} onClick={() => setShowNewAddressForm(true)}>
                        Añade una ahora.
                    </button>
                </div>
            ) : !showAddressList && !showNewAddressForm && activeAddress ? (
                /* Vista Compacta: Dirección Seleccionada */
                <div className={styles.addressDisplayCard}>
                    <div className={styles.addressCardHeader}>
                        <span className={styles.statusLabel}>DIRECCIÓN SELECCIONADA</span>
                        <button className={styles.editAddressLink} onClick={() => router.push('/dashboard/direcciones')}>
                            <FaPencil /> GESTIONAR
                        </button>
                    </div>
                    
                    <div className={styles.addressInfoBox}>
                        <p className={styles.streetLine}>
                            {activeAddress.calle} <span className={styles.extraInfo}>{activeAddress.portal_piso_puerta}</span>
                        </p>
                        <p className={styles.cityLine}>
                            {activeAddress.codigo_postal} {activeAddress.ciudad}, {activeAddress.provincia}
                        </p>
                        {activeAddress.is_default && <span className={styles.defaultBadge}>Predeterminada</span>}
                    </div>

                    <div className={styles.addNewAddrWrapper} style={{ marginTop: '15px' }}>
                        <button className={styles.changeAddressBtn} onClick={() => setShowAddressList(true)}>
                            Cambiar dirección
                        </button>
                    </div>
                </div>
            ) : showAddressList && !showNewAddressForm ? (
                /* Lista de Direcciones para elegir */
                <div className={styles.addressList}>
                    {addresses.map((addr) => (
                        <button
                            key={addr.address_id}
                            className={`${styles.addressCard} ${selectedAddress === addr.address_id ? styles.addressActive : ''}`}
                            onClick={() => handleSelectAddress(addr.address_id)}
                        >
                            <div className={styles.addressRadio}>
                                <div className={styles.radioInner} />
                            </div>
                            <div className={styles.addressText}>
                                <span className={styles.addressStreet}>{addr.calle} {addr.portal_piso_puerta}</span>
                                <span className={styles.addressCity}>{addr.codigo_postal} {addr.ciudad}, {addr.provincia}</span>
                            </div>
                        </button>
                    ))}
                    <TertiaryButton 
                        text="AÑADIR NUEVA DIRECCIÓN"
                        onClick={() => setShowNewAddressForm(true)}
                    />
                </div>
            ) : (
                /* Formulario para añadir nueva dirección */
                <form className={styles.newAddressForm} onSubmit={handleCreateAddress}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label><FaHouse /> Calle y número</label>
                            <input
                                type="text"
                                placeholder="Ej: Calle Gran Vía, 1"
                                className={formErrors.calle ? styles.inputError : ''}
                                value={newAddress.calle}
                                onChange={e => setNewAddress({ ...newAddress, calle: e.target.value })}
                            />
                            {formErrors.calle && <span className={styles.errorMsg}>{formErrors.calle}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label><FaEnvelopeOpenText /> Piso, puerta, portal (Opcional)</label>
                            <input
                                type="text"
                                placeholder="Ej: 2ºB, Portal 3"
                                value={newAddress.portal_piso_puerta}
                                onChange={e => setNewAddress({ ...newAddress, portal_piso_puerta: e.target.value })}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label><FaCity /> Ciudad</label>
                                <input
                                    type="text"
                                    placeholder="Madrid"
                                    className={formErrors.ciudad ? styles.inputError : ''}
                                    value={newAddress.ciudad}
                                    onChange={e => setNewAddress({ ...newAddress, ciudad: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><FaLocationDot /> Cód. Postal</label>
                                <input
                                    type="text"
                                    placeholder="28001"
                                    maxLength={5}
                                    className={formErrors.codigo_postal ? styles.inputError : ''}
                                    value={newAddress.codigo_postal}
                                    onChange={e => setNewAddress({ ...newAddress, codigo_postal: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label><FaEarthEurope /> Provincia</label>
                                <input
                                    type="text"
                                    placeholder="Madrid"
                                    value={newAddress.provincia}
                                    onChange={e => setNewAddress({ ...newAddress, provincia: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label><FaPhone /> Teléfono</label>
                                <input
                                    type="text"
                                    placeholder="600 000 000"
                                    value={newAddress.phone_number}
                                    onChange={e => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <SecondaryButton 
                            text="CANCELAR"
                            onClick={() => { setShowNewAddressForm(false); setShowAddressList(addresses.length > 0); }}
                            className={styles.formActionBtn}
                        />
                        <PrimaryButton 
                            text={addressLoading ? "GUARDANDO..." : "GUARDAR"}
                            onClick={handleCreateAddress}
                            disabled={addressLoading}
                            className={styles.formActionBtn}
                        />
                    </div>
                </form>
            )}
        </section>
    );
}
