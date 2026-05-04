/**
 * @file ProductSizeSelector.jsx
 * @description Selector de medidas con diseño moderno de píldoras (pills)
 *
 * [Nuestro enfoque]
 * Un diseño limpio donde las medidas fluyen de forma natural como píldoras.
 * El precio de la variante se elimina de las opciones estándar porque ahora
 * el producto dicta el precio base, y solo mostramos el precio si es a medida.
 */
"use client";

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRulerCombined } from 'react-icons/fa6';
import styles from './product.module.css';

/* Expresión regular que acepta el formato "120x80" o "120 x 80" */
const CUSTOM_MEASURE_REGEX = /^\d{1,4}(\s?x\s?)\d{1,4}$/i;

/* Máximo de caracteres permitidos en el campo de medida personalizada */
const MAX_CUSTOM_LENGTH = 20;

export default function ProductSizeSelector({ sizes, selectedSize, setSelectedSize }) {

    /* Controla si el panel de medida personalizada está expandido */
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customMeasure, setCustomMeasure] = useState('');
    const [measureError, setMeasureError] = useState('');

    const formatPrice = (p) => `${parseFloat(p).toFixed(2)}€`;

    /**
     * Separa las variantes en dos grupos:
     * - "standardSizes": alfombras con medidas fijas
     * - "customSizes": tallas de tipo "a medida" (identificadas por la palabra "teclado" o "medida" en el label)
     */
    const { standardSizes, customSizes } = useMemo(() => {
        const standard = [];
        const custom   = [];
        sizes.forEach(size => {
            const lower = size.label.toLowerCase();
            if (lower.includes('teclado') || lower.includes('medida')) {
                custom.push(size);
            } else {
                standard.push(size);
            }
        });
        return { standardSizes: standard, customSizes: custom };
    }, [sizes]);

    if (!sizes || sizes.length === 0) return null;

    const handleSelectPreset = (size) => {
        setSelectedSize(size);
        setShowCustomInput(false);
        setCustomMeasure('');
        setMeasureError('');
    };

    const handleToggleCustom = () => {
        setShowCustomInput(prev => !prev);
        setMeasureError('');
    };

    /**
     * Valida la medida introducida por el usuario y la confirma si es correcta
     * Tomamos la primera variante "a medida" como base para heredar el precio
     */
    const handleConfirmCustom = () => {
        const trimmed = customMeasure.trim();
        if (!trimmed) {
            setMeasureError('Introduce una medida, ej: 120x80');
            return;
        }
        if (!CUSTOM_MEASURE_REGEX.test(trimmed)) {
            setMeasureError('Usa el formato "LargoXAncho", ej: 120x80');
            return;
        }
        const base = customSizes[0] || sizes[0];
        setSelectedSize({ ...base, label: trimmed, customMeasure: trimmed });
        setShowCustomInput(false);
        setMeasureError('');
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        if (val.length > MAX_CUSTOM_LENGTH) return;
        setCustomMeasure(val);
        if (measureError) setMeasureError('');
    };

    const isCustomActive = !!selectedSize?.customMeasure;

    return (
        <div className={styles.sizeSelectorWrapper}>
            <div className={styles.sizeSelectorHeader}>
                <span className={styles.sizeSelectorLabel}>TAMAÑO SELECCIONADO</span>
                {selectedSize && (
                    <span className={styles.sizeSelectorSelected}>
                        {selectedSize.label}
                    </span>
                )}
            </div>

            {/* Grupo de alfombras con medidas estándar */}
            {standardSizes.length > 0 && (
                <div className={styles.sizeGroupBlock}>
                    <p className={styles.sizeGroupTitle}>Medidas Disponibles</p>
                    <div className={styles.sizePillContainer}>
                        {standardSizes.map((size) => {
                            const isActive = selectedSize?.id === size.id && !isCustomActive;
                            return (
                                <button
                                    key={size.id}
                                    className={`${styles.sizePill} ${isActive ? styles.sizePillActive : ''}`}
                                    onClick={() => handleSelectPreset(size)}
                                >
                                    {size.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Grupo "A medida": chips de teclado predefinidos + chip especial para medida propia */}
            {customSizes.length > 0 && (
                <div className={styles.sizeGroupBlock}>
                    <p className={styles.sizeGroupTitle}>Personalización</p>
                    <div className={styles.sizePillContainer}>
                        {customSizes.map((size) => {
                            const isActive = selectedSize?.id === size.id && !isCustomActive;
                            return (
                                <button
                                    key={size.id}
                                    className={`${styles.sizePill} ${isActive ? styles.sizePillActive : ''}`}
                                    onClick={() => handleSelectPreset(size)}
                                >
                                    {size.label}
                                </button>
                            );
                        })}

                        {/* Píldora especial para introducir dimensiones */}
                        <button
                            className={`${styles.sizePill} ${styles.sizePillCustom} ${(isCustomActive || showCustomInput) ? styles.sizePillActive : ''}`}
                            onClick={handleToggleCustom}
                        >
                            <FaRulerCombined />
                            <span>{isCustomActive ? selectedSize.label : 'Tu propia medida'}</span>
                        </button>
                    </div>

                    {/* Panel expandible */}
                    <AnimatePresence>
                        {showCustomInput && (
                            <motion.div
                                key="customInput"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22, ease: 'easeInOut' }}
                                className={styles.customInputPanel}
                            >
                                <div className={styles.customInputRow}>
                                    <input
                                        type="text"
                                        className={`${styles.customMeasureInput} ${measureError ? styles.customMeasureInputError : ''}`}
                                        placeholder="Ej: 120x80"
                                        value={customMeasure}
                                        onChange={handleCustomChange}
                                        maxLength={MAX_CUSTOM_LENGTH}
                                        aria-label="Medida personalizada"
                                        autoFocus
                                    />
                                    <button
                                        className={styles.customMeasureConfirm}
                                        onClick={handleConfirmCustom}
                                    >
                                        CONFIRMAR
                                    </button>
                                </div>

                                {measureError ? (
                                    <p className={styles.customMeasureError}>{measureError}</p>
                                ) : (
                                    <p className={styles.customMeasureHint}>
                                        Formato: Largo × Ancho en cm
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
