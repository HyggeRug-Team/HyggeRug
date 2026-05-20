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

/* Expresiones regulares para validar formatos: "120x80" o "50 de radio" */
const RECT_REGEX   = /^(\d+)\s?x\s?(\d+)$/i;
const CIRCLE_REGEX = /^(\d+)\s?(cm)?\s?(de\s+radio|radio|circular|redonda)$/i;

/* Límites de medida en centímetros */
const MIN_CM = 20;
const MAX_CM = 600;

/* Máximo de caracteres permitidos en el campo de medida personalizada */
const MAX_CUSTOM_LENGTH = 25;

export default function ProductSizeSelector({ sizes, selectedSize, setSelectedSize }) {

    /* Controla si el panel de medida personalizada está expandido */
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customMeasure, setCustomMeasure] = useState('');
    const [measureError, setMeasureError] = useState('');

    const formatPrice = (p) => `${parseFloat(p).toFixed(2).replace('.', ',')}€`;

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
     * Valida la medida introducida por el usuario y la confirma si es correcta.
     * Soporta formatos rectangulares (AxB) y circulares (X de radio).
     */
    const handleConfirmCustom = () => {
        const trimmed = customMeasure.trim().toLowerCase();
        if (!trimmed) {
            setMeasureError('Introduce una medida, ej: 120x80 o 50 de radio');
            return;
        }

        // 1. Intentar validar formato rectangular (AxB)
        const rectMatch = trimmed.replace(/\s/g, '').match(RECT_REGEX);
        if (rectMatch) {
            const largo = parseInt(rectMatch[1], 10);
            const ancho = parseInt(rectMatch[2], 10);
            if (largo < MIN_CM || ancho < MIN_CM) {
                setMeasureError(`Medida mínima: ${MIN_CM}x${MIN_CM} cm`);
                return;
            }
            if (largo > MAX_CM || ancho > MAX_CM) {
                setMeasureError(`Medida máxima: ${MAX_CM}x${MAX_CM} cm`);
                return;
            }
            const label = `${largo}x${ancho} cm`;
            const base = customSizes[0] || sizes[0];
            setSelectedSize({ ...base, label, customMeasure: label });
            setShowCustomInput(false);
            setMeasureError('');
            return;
        }

        // 2. Intentar validar formato circular (X de radio)
        const circleMatch = trimmed.match(CIRCLE_REGEX);
        if (circleMatch) {
            const radio = parseInt(circleMatch[1], 10);
            if (radio < (MIN_CM / 2)) {
                setMeasureError(`Radio mínimo: ${MIN_CM / 2} cm`);
                return;
            }
            if (radio > (MAX_CM / 2)) {
                setMeasureError(`Radio máximo: ${MAX_CM / 2} cm`);
                return;
            }
            const label = `${radio} cm de radio (Circular)`;
            const base = customSizes[0] || sizes[0];
            setSelectedSize({ ...base, label, customMeasure: label });
            setShowCustomInput(false);
            setMeasureError('');
            return;
        }

        setMeasureError('Usa formatos como "120x80" o "50 de radio"');
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
                                    <span className={styles.pillLabel}>{size.label}</span>
                                    <span className={styles.pillPrice}>{formatPrice(size.price)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Grupo "A medida": chips de teclado predefinidos */}
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
                                    <span className={styles.pillLabel}>{size.label}</span>
                                    <span className={styles.pillPrice}>{formatPrice(size.price)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Panel permanente para medida personalizada */}
            <div className={styles.sizeGroupBlock}>
                <p className={styles.sizeGroupTitle}>¿Necesitas otra medida?</p>
                <div className={styles.sizePillContainer}>
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
                                    Aplicar
                                </button>
                            </div>
                            {measureError && <span className={styles.customMeasureErrorMsg}>{measureError}</span>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
