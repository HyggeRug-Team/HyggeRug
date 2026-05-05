/**
 * @file CartItemList.jsx
 * @description Componente que renderiza la lista de productos en el carrito.
 * Incluye controles para modificar la cantidad y eliminar artículos.
 */

import React from 'react';
import Image from 'next/image';
import { FaXmark, FaPlus, FaMinus } from 'react-icons/fa6';
import styles from './CartItemList.module.css';

/**
 * @param {Object} props
 * @param {Array} props.items - Lista de objetos de producto del carrito.
 * @param {Function} props.onQuantityChange - Manejador para actualizar cantidad.
 * @param {Function} props.onRemove - Manejador para eliminar producto.
 * @param {Function} props.formatPrice - Utilidad para formatear precios.
 */
export default function CartItemList({ items, onQuantityChange, onRemove, formatPrice }) {
    return (
        <section className={styles.card}>
            <div className={styles.cardTitle}>
                01. PRODUCTOS ({items.length})
            </div>
            
            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.order_product_id} className={styles.item}>
                        
                        {/* Miniatura del producto */}
                        <div className={styles.itemImage}>
                            <Image
                                src={item.image_url ?? '/rug-mario.png'}
                                alt={item.name}
                                fill
                                sizes="100px"
                                className={styles.itemImg}
                            />
                        </div>

                        {/* Información y Controles */}
                        <div className={styles.itemInfo}>
                            <div className={styles.itemTop}>
                                <span className={styles.itemName}>{item.name}</span>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => onRemove(item.order_product_id)}
                                    aria-label="Eliminar producto"
                                >
                                    <FaXmark />
                                </button>
                            </div>

                            {item.size_label && (
                                <span className={styles.itemSize}>{item.size_label}</span>
                            )}

                            <div className={styles.itemBottom}>
                                {/* Controles de Cantidad */}
                                <div className={styles.qtyControls}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => onQuantityChange(item.order_product_id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        aria-label="Reducir"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => onQuantityChange(item.order_product_id, item.quantity + 1)}
                                        aria-label="Aumentar"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                {/* Precio subtotal del item */}
                                <span className={styles.itemPrice}>
                                    {formatPrice(item.unit_price * item.quantity)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
