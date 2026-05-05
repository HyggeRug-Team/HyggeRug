"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/crear-diseno/Studio.module.css';
import { FaSync, FaArrowLeft, FaUpload, FaTimes, FaChevronLeft, FaMagic, FaChevronDown, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Medidas estándar de teclado hardcodeadas
const KEYBOARD_PRESETS = [
    { label: '100%', width: 45, height: 15 },
    { label: 'TKL (80%)', width: 37, height: 15 },
    { label: '75%', width: 32, height: 15 },
    { label: '65%', width: 30, height: 11 },
    { label: '60%', width: 28, height: 10 },
    { label: '40%', width: 24, height: 8 },
];

export default function DesignStudioAI() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [weeklyLimit, setWeeklyLimit] = useState(null);
    const [nextReset, setNextReset] = useState(null);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    // Dimensiones libres en lugar de tallas fijas
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    // Submenu de presets de teclado
    const [showKeyboardPresets, setShowKeyboardPresets] = useState(false);

    // Config cargada desde BD (precio/cm², límites)
    const [config, setConfig] = useState({ pricePerCm2: 0.0333, maxWidth: 140, maxHeight: 140 });

    // Sidebar móvil
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Scroll hint
    const [hasMoreBelow, setHasMoreBelow] = useState(false);
    const controlPanelRef = useRef(null);

    const checkScroll = React.useCallback(() => {
        const el = controlPanelRef.current;
        if (!el) return;
        setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 10);
    }, []);

    useEffect(() => {
        const el = controlPanelRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        const ro = new ResizeObserver(checkScroll);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            ro.disconnect();
        };
    }, [checkScroll]);

    // Cargar créditos del usuario
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const res = await fetch('/api/user/credits');
                if (res.ok) {
                    const data = await res.json();
                    setAttempts(data.remaining);
                    setWeeklyLimit(data.weeklyLimit);
                    setNextReset(data.nextReset ? new Date(data.nextReset) : null);
                }
            } catch (err) {
                console.error('Error loading credits:', err);
                setAttempts(0);
            }
        };
        fetchCredits();
    }, []);

    // Cargar config de precio y límites desde BD
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/studio/config');
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                }
            } catch {
                // Usa valores por defecto si falla
            }
        };
        fetchConfig();
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadedImage(file);
        setAiResult(null);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
        setImagePreviewUrl(null);
        setAiResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const generateAiDesign = async () => {
        if (attempts <= 0 || isGenerating || !uploadedImage) return;

        setIsGenerating(true);
        setAiResult(null);

        try {
            const formData = new FormData();
            formData.append('image', uploadedImage);
            if (prompt.trim()) formData.append('prompt', prompt.trim());

            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!data.success || !data.imageBase64) {
                throw new Error(data.error || 'No image returned');
            }

            setAiResult(`data:${data.mimeType};base64,${data.imageBase64}`);

            // Recargar créditos tras generar
            const creditsRes = await fetch('/api/user/credits');
            if (creditsRes.ok) {
                const creditsData = await creditsRes.json();
                setAttempts(creditsData.remaining);
            }
        } catch (err) {
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Cálculos derivados de las dimensiones
    const parsedWidth = parseFloat(width) || 0;
    const parsedHeight = parseFloat(height) || 0;
    const isOverLimit = parsedWidth > config.maxWidth || parsedHeight > config.maxHeight;

    const displayPrice = parsedWidth > 0 && parsedHeight > 0 && !isOverLimit
        ? (parsedWidth * parsedHeight * config.pricePerCm2).toFixed(2)
        : '0.00';

    const displayLabel = parsedWidth > 0 && parsedHeight > 0
        ? `${parsedWidth} x ${parsedHeight} cm`
        : '';

    const canGenerate = !!uploadedImage && parsedWidth > 0 && parsedHeight > 0
        && !isOverLimit && !isGenerating && attempts !== null && attempts > 0;

    const handleBuy = async () => {
        if (!aiResult || parsedWidth <= 0 || parsedHeight <= 0 || isOverLimit) return;

        try {
            const base64Data = aiResult.split(',')[1];
            const mimeTypeData = aiResult.split(';')[0].split(':')[1];

            const res = await fetch('/api/studio/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64Data,
                    mimeType: mimeTypeData,
                    width: parsedWidth,
                    height: parsedHeight,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error ?? 'Error al guardar el diseño');
                return;
            }

            window.location.href = '/carrito';
        } catch (err) {
            console.error('handleBuy error:', err);
            alert('Error al procesar el diseño');
        }
    };

    return (
        <div className={styles.studioContainer}>
            <div className={styles.topBar}>
                <Link href="/" className={styles.backButton}>
                    <FaArrowLeft size={16} />
                    VOLVER ATRÁS
                </Link>
                <div className={styles.brandTitle}>
                    LABORATORIO <span>IA</span>
                </div>
            </div>

            <main className={styles.mainContent}>

                {/* Botón flotante móvil */}
                <button
                    className={styles.mobileFloatingBtn}
                    onClick={() => setIsMobileSidebarOpen(true)}
                >
                    <FaBars size={18} /> CONFIGURAR PIEZA
                </button>

                {/* Overlay sidebar móvil */}
                <div
                    className={`${styles.sidebarOverlay} ${isMobileSidebarOpen ? styles.overlayActive : ''}`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                />

                <div className={`${styles.controlPanelWrapper} ${isMobileSidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.controlPanel} ref={controlPanelRef}>
                        <div className={styles.sidebarHeader}>
                            <div className={styles.graffitiTag}>CREA TU PIEZA</div>
                            <button className={styles.closeSidebarBtn} onClick={() => setIsMobileSidebarOpen(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* 1. MEDIDAS */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelHeader}>
                                <label className={styles.labelNeon} data-step="1">1. MEDIDAS (CM)</label>
                                {showKeyboardPresets && (
                                    <button className={styles.backBtn} onClick={() => setShowKeyboardPresets(false)}>
                                        <FaChevronLeft size={10} /> VOLVER
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {!showKeyboardPresets ? (
                                    <motion.div
                                        key="dimensions"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        {/* Inputs ancho y alto */}
                                        <div className={styles.dimensionsRow}>
                                            <div className={styles.dimensionField}>
                                                <span className={styles.dimensionLabel}>ANCHO</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={config.maxWidth}
                                                    className={`${styles.dimensionInput} ${parsedWidth > config.maxWidth ? styles.dimensionError : ''}`}
                                                    placeholder="80"
                                                    value={width}
                                                    onChange={e => setWidth(e.target.value)}
                                                />
                                            </div>
                                            <span className={styles.dimensionSeparator}>×</span>
                                            <div className={styles.dimensionField}>
                                                <span className={styles.dimensionLabel}>ALTO</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={config.maxHeight}
                                                    className={`${styles.dimensionInput} ${parsedHeight > config.maxHeight ? styles.dimensionError : ''}`}
                                                    placeholder="60"
                                                    value={height}
                                                    onChange={e => setHeight(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Feedback superficie / límite */}
                                        {parsedWidth > 0 && parsedHeight > 0 && (
                                            <p className={isOverLimit ? styles.dimensionOverLimit : styles.dimensionHint}>
                                                {isOverLimit
                                                    ? `Máximo ${config.maxWidth}×${config.maxHeight} cm`
                                                    : `Superficie: ${(parsedWidth * parsedHeight).toLocaleString('es-ES')} cm²`
                                                }
                                            </p>
                                        )}

                                        <p className={styles.dimensionNote}>
                                            Introduce el rectángulo que contiene tu diseño
                                        </p>

                                        {/* Acceso a presets de teclado */}
                                        <button
                                            className={styles.keyboardPresetsBtn}
                                            onClick={() => setShowKeyboardPresets(true)}
                                        >
                                            Medidas de teclados
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="keyboards"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={styles.keyboardGrid}
                                    >
                                        {KEYBOARD_PRESETS.map(preset => (
                                            <button
                                                key={preset.label}
                                                className={`${styles.keyboardPresetBtn} ${parsedWidth === preset.width && parsedHeight === preset.height
                                                        ? styles.keyboardPresetActive
                                                        : ''
                                                    }`}
                                                onClick={() => {
                                                    setWidth(String(preset.width));
                                                    setHeight(String(preset.height));
                                                    setShowKeyboardPresets(false);
                                                }}
                                            >
                                                <span className={styles.presetLabel}>{preset.label}</span>
                                                <span className={styles.presetDims}>{preset.width}×{preset.height}</span>
                                                <span className={styles.presetPrice}>
                                                    {(preset.width * preset.height * config.pricePerCm2).toFixed(2)}€
                                                </span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. SUBIR IMAGEN */}
                        <div className={styles.inputGroup}>
                            <label className={styles.labelNeon} data-step="2">2. TU IMAGEN</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                style={{ display: 'none' }}
                                onChange={handleImageSelect}
                            />
                            {!imagePreviewUrl ? (
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FaUpload size={20} />
                                    <span>SUBIR FOTO O DISEÑO</span>
                                    <span className={styles.uploadHint}>PNG · JPG · WEBP</span>
                                </button>
                            ) : (
                                <div className={styles.imagePreviewWrapper}>
                                    <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
                                    <button
                                        className={styles.removeImageBtn}
                                        onClick={handleRemoveImage}
                                        aria-label="Remove image"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 3. ESTILO EXTRA */}
                        <div className={styles.inputGroup}>
                            <label className={styles.labelNeon} data-step="3">
                                3. ESTILO EXTRA{' '}
                                <span style={{ opacity: 0.4, fontWeight: 400, fontSize: '1rem' }}>(opcional)</span>
                            </label>
                            <textarea
                                className={styles.promptInput}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ej. Estilo cyberpunk, colores neón, minimalista..."
                            />
                        </div>

                        {/* CRÉDITOS Y BOTÓN GENERAR */}
                        <div className={styles.actionGroup}>
                            <div className={styles.creditsWrapper}>
                                <span className={styles.creditIcon}>⚡</span> CRÉDITOS RESTANTES:{' '}
                                <strong>{attempts === null ? '...' : attempts}</strong>
                                <span style={{ opacity: 0.4, fontSize: '0.8rem' }}> / {weeklyLimit ?? '...'}</span>
                                {nextReset && (
                                    <span style={{ opacity: 0.4, fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                                        Reinicio: {nextReset.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                        {' a las '}
                                        {nextReset.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <button
                                className={styles.mainAction}
                                disabled={!canGenerate}
                                onClick={generateAiDesign}
                            >
                                {isGenerating ? <FaSync className={styles.spin} /> : 'GENERAR BOCETO'}
                            </button>
                        </div>
                    </div>

                    {/* Flecha indicadora de más contenido */}
                    <div className={`${styles.scrollFade} ${hasMoreBelow ? styles.scrollFadeVisible : ''}`}>
                        <FaChevronDown className={styles.scrollFadeIcon} size={14} />
                    </div>
                </div>

                {/* Canvas central */}
                <div className={styles.canvasArea}>
                    <div className={styles.viewport}>
                        {isGenerating && (
                            <div className={styles.aiProcessing}>
                                <div className={styles.glitchText}>PROCESANDO CON...<br />NANO BANANA ENGINE</div>
                            </div>
                        )}
                        {!aiResult && !isGenerating && !imagePreviewUrl && (
                            <div className={styles.emptyCanvas}>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className={styles.magicIcon}
                                >
                                    <FaMagic size={80} />
                                </motion.div>
                                <p>SUBE TU IMAGEN Y GENERA TU BOCETO</p>
                            </div>
                        )}
                        {!aiResult && !isGenerating && imagePreviewUrl && (
                            <div className={styles.resultView}>
                                <img
                                    src={imagePreviewUrl}
                                    alt="Tu imagen"
                                    style={{ opacity: 0.45, filter: 'grayscale(40%)' }}
                                />
                                <div className={styles.stickerTag} style={{ background: '#444' }}>
                                    IMAGEN ORIGINAL
                                </div>
                            </div>
                        )}
                        {aiResult && !isGenerating && (
                            <div className={styles.resultView}>
                                <img src={aiResult} alt="Diseño IA" />
                                <div className={styles.stickerTag}>LISTO PARA TUFTING</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de checkout */}
                <div className={styles.checkoutPanel}>
                    <h3 className={styles.receiptTitle}>TICKET</h3>
                    <div className={styles.receiptBody}>
                        <div className={styles.receiptLine}>
                            <span>MEDIDA</span>
                            <span style={{ textAlign: 'right', maxWidth: '55%' }}>{displayLabel || '—'}</span>
                        </div>
                        <div className={styles.receiptLine}>
                            <span>TÉCNICA</span>
                            <span>MANUAL</span>
                        </div>
                        <div className={styles.receiptLine}>
                            <span>TEXTURA</span>
                            <span>LANA TOP</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.totalLine}>
                            <span>PRECIO EST.</span>
                            <strong>{displayPrice}€</strong>
                        </div>
                        {parsedWidth > 0 && parsedHeight > 0 && !isOverLimit && (
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px', lineHeight: 1.4 }}>
                                Precio orientativo. El precio final se confirma tras revisar el diseño contigo.
                            </p>
                        )}
                    </div>
                    <button
                        className={styles.buyAction}
                        disabled={!aiResult || parsedWidth <= 0 || parsedHeight <= 0 || isOverLimit}
                        onClick={handleBuy}
                    >
                        COMPRAR DISEÑO
                    </button>
                </div>
            </main>
        </div>
    );
}