/**
 * @file CartContext.js
 * @description Proveedor de estado global para la cesta de la compra
 * 
 * [Nuestro enfoque]
 * Utilizamos React Context para sincronizar el contador de productos entre 
 * el Header y las diferentes páginas de la tienda sin necesidad de recargas
 * 
 * [Por qué lo hemos hecho así]
 * Permite que el badge del carrito en la cabecera se actualice instantáneamente 
 * desde cualquier componente cliente (como el selector de productos o la página de carrito)
 */

'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    /* ── Lógica de sincronización ── */
    const refreshCartCount = useCallback(async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                const totalItems = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                setCartCount(totalItems);
            }
        } catch (error) {
            console.error('Error al refrescar el contador del carrito:', error);
        }
    }, []);

    useEffect(() => {
        refreshCartCount();
    }, [refreshCartCount]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Hook personalizado para acceder al contexto del carrito
 */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
}
