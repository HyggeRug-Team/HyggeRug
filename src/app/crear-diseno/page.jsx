/**
 * @file page.jsx (Crear Diseño)
 * @description El "Cerebro" de personalización donde la IA y el usuario colaboran.
 * 
 * [Nuestro enfoque]
 * Hemos creado un estudio compacto donde no hace falta moverse para tenerlo todo. 
 * Imagina que es como la cabina de un avión: todos los mandos están a mano. 
 * Usamos animaciones fluidas para que, cuando elijas un teclado, las opciones 
 * cambien suavemente sin que la página "de saltos" ni aparezcan barras de scroll molestas.
 * 
 * [Por qué lo hemos hecho así]
 * Queremos que diseñar tu alfombra sea divertido, no un lío de menús. Al mantener 
 * todo en una sola vista y usar efectos visuales de "escaneado", logramos que 
 * el usuario sienta que está de verdad en un laboratorio premium de Hygge Rug.
 */

"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Studio.module.css';
import { FaSync, FaArrowLeft, FaUpload, FaTimes, FaChevronLeft, FaMagic, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesignStudioAI() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [attempts, setAttempts] = useState(5);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const [rugSize, setRugSize] = useState('');
    const [sizesData, setSizesData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [showKeyboardOptions, setShowKeyboardOptions] = useState(false);
    const [customKeyboardSize, setCustomKeyboardSize] = useState('');
    // Logica de scroll hint (la flechita) igual que en el Sidebar
    const [hasMoreBelow, setHasMoreBelow] = React.useState(false);
    const controlPanelRef = React.useRef(null);

    const checkScroll = React.useCallback(() => {
        const el = controlPanelRef.current;
        if (!el) return;
        const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setHasMoreBelow(distanceToBottom > 10);
    }, []);

    React.useEffect(() => {
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

    useEffect(() => {
        // [PASO 1] Llamamos por teléfono a la base de datos para pedirle las medidas
        const fetchProductData = async () => {
            try {
                const response = await fetch('/api/products/1');
                if (response.ok) {
                    const data = await response.json();
                    // Guardamos la lista de tamaños aquí abajo
                    if (data.product?.sizes) setSizesData(data.product.sizes);
                }
            } catch (error) {
                console.error("Error al cargar producto:", error);
            } finally {
                // Ya hemos terminado de cargar
                setIsLoadingData(false);
            }
        };
        fetchProductData();
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
        // [PASO 2] Si no hay foto o no quedan créditos, no hacemos nada
        if (attempts <= 0 || isGenerating || !uploadedImage) return;

        setIsGenerating(true); // Encendemos la maquinaria de la IA
        setAiResult(null);

        try {
            // Empaquetamos tu foto y tus instrucciones para enviarlas
            const formData = new FormData();
            formData.append('image', uploadedImage);
            if (prompt.trim()) formData.append('prompt', prompt.trim());

            // Enviamos la caja al servidor para que la IA la procese
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData,
            });

             // DEBUG: Revisamos que todo vaya bien
                console.log("Status:", response.status);

            const data = await response.json();

            if (!data.success || !data.imageBase64) {
                throw new Error(data.error || 'No image returned');
            }

            // [EXITO] Convertimos el resultado en una imagen que se pueda ver
            const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
            setAiResult(dataUrl); // Mostramos el boceto listo
            setAttempts(prev => prev - 1); // Gastamos un crédito

        } catch (err) {
            console.error("Generation error:", err);
        } finally {
            setIsGenerating(false); // Apagamos la maquinaria
        }
    };

    const normalSizes = sizesData.filter(s => !s.size_label.toLowerCase().includes('teclado'));
    const keyboardSizes = sizesData.filter(s => s.size_label.toLowerCase().includes('teclado'));
    const selectedSizeObj = sizesData.find(s => s.size_id.toString() === rugSize);
    const displayPrice = selectedSizeObj ? parseFloat(selectedSizeObj.price).toFixed(2) : "0.00";

    let displayLabel = selectedSizeObj ? selectedSizeObj.size_label : "";
    if (displayLabel.toLowerCase().includes('a medida') && customKeyboardSize.trim() !== "") {
        displayLabel = `Teclado (Personalizado: ${customKeyboardSize} cm)`;
    }

    const canGenerate = !!uploadedImage && !!rugSize && !isGenerating && attempts > 0;

    const handleBuy = () => {
        console.log("Comprando con Datos", {
            size_id: Number(rugSize),
            product_size: displayLabel,
            user_image: aiResult,
            price: Number(displayPrice)
        });
        alert(`Listo para Checkout! Medida oficial captada: ${displayLabel}`);
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
                <div className={styles.controlPanelWrapper}>
                    <div className={styles.controlPanel} ref={controlPanelRef}>
                        <div className={styles.graffitiTag}>CREA TU PIEZA</div>

                        {/* 1. Talla */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelHeader}>
                                <label className={styles.labelNeon} data-step="1">1. TALLA</label>
                                {showKeyboardOptions && (
                                    <button className={styles.backBtn} onClick={() => setShowKeyboardOptions(false)}>
                                        <FaChevronLeft size={10} /> VOLVER
                                    </button>
                                )}
                            </div>
                            
                            <div className={styles.selectionWrapper}>
                                {/* Aquí usamos AnimatePresence para que los menús "vuelen" suavemente al cambiar */}
                                <AnimatePresence mode="wait">
                                    {!showKeyboardOptions ? (
                                        <motion.div 
                                            key="normal"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className={styles.sizeSelection}
                                        >
                                            {isLoadingData ? (
                                                <p className={styles.loadingText}>Conectando base térmica...</p>
                                            ) : (
                                                <>
                                                    {/* Mostramos los tamaños normales de alfombras */}
                                                    {normalSizes.map((s) => (
                                                        <button
                                                            key={s.size_id}
                                                            className={`${styles.sizeCircle} ${rugSize === s.size_id.toString() ? styles.activeSize : ''}`}
                                                            onClick={() => setRugSize(s.size_id.toString())}
                                                        >
                                                            <span className={styles.sizeKey}>{(parseFloat(s.price)).toFixed(0)}€</span>
                                                            <span className={styles.sizeLabel}>{s.size_label}</span>
                                                        </button>
                                                    ))}
                                                    {/* Botón para viajar al menú de teclados */}
                                                    {keyboardSizes.length > 0 && (
                                                        <button
                                                            className={`${styles.sizeCircle} ${styles.specialSize}`}
                                                            onClick={() => setShowKeyboardOptions(true)}
                                                        >
                                                            <span className={styles.sizeKey}>...</span>
                                                            <span className={styles.sizeLabel}>TECLADOS</span>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="keyboards"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className={styles.sizeSelection}
                                        >
                                            {/* Mostramos solo las medidas de teclados */}
                                            {keyboardSizes.map(s => (
                                                <button
                                                    key={s.size_id}
                                                    className={`${styles.sizeCircle} ${rugSize === s.size_id.toString() ? styles.activeSize : ''}`}
                                                    onClick={() => setRugSize(s.size_id.toString())}
                                                >
                                                    <span className={styles.sizeKey}>{(parseFloat(s.price)).toFixed(0)}€</span>
                                                    <span className={styles.sizeLabel}>
                                                        {s.size_label.replace('Teclado ', '').replace('(', '').replace(')', '')}
                                                    </span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {selectedSizeObj?.size_label.toLowerCase().includes('a medida') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={styles.customInputArea}
                                    >
                                        <label className={styles.labelNeonSub}>MEDIDA PERSONALIZADA (CM)</label>
                                        <input
                                            type="text"
                                            className={styles.tinyInput}
                                            placeholder="Ej: 50x18"
                                            value={customKeyboardSize}
                                            onChange={(e) => setCustomKeyboardSize(e.target.value)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. Subir imagen */}
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

                        {/* 3. Estilo extra opcional */}
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

                        <div className={styles.actionGroup}>
                            <div className={styles.creditsWrapper}>
                                <span className={styles.creditIcon}>⚡</span> CRÉDITOS RESTANTES: <strong>{attempts}</strong>
                            </div>
                            <button
                                className={styles.mainAction}
                                disabled={!canGenerate}
                                onClick={generateAiDesign}
                            >
                                {isGenerating ? <FaSync className={styles.spin} /> : "GENERAR BOCETO"}
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
                            <span style={{ textAlign: 'right', maxWidth: '50%' }}>{displayLabel || "—"}</span>
                        </div>
                        <div className={styles.receiptLine}>
                            <span>TÉCNICA</span>
                            <span>MANUAL</span>
                        </div>
                        <div className={styles.receiptLine}>
                            <span>TEXTURA</span>
                            <span>LANA TOP</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.totalLine}>
                            <span>PRECIO FINAL</span>
                            <strong>{displayPrice}€</strong>
                        </div>
                    </div>
                    <button className={styles.buyAction} disabled={!aiResult || !rugSize} onClick={handleBuy}>
                        COMPRAR DISEÑO
                    </button>
                </div>
            </main>
        </div>
    );
}