"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Studio.module.css';
import { FaSync, FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

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

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch('/api/products/1');
                if (response.ok) {
                    const data = await response.json();
                    if (data.product?.sizes) setSizesData(data.product.sizes);
                }
            } catch (error) {
                console.error("Error al cargar producto:", error);
            } finally {
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

             // DEBUG
                console.log("Status:", response.status);

            const data = await response.json();

            if (!data.success || !data.imageBase64) {
                throw new Error(data.error || 'No image returned');
            }

            const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
            setAiResult(dataUrl);
            setAttempts(prev => prev - 1);

        } catch (err) {
            console.error("Generation error:", err);
        } finally {
            setIsGenerating(false);
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
                    VOLVER AL HOOD
                </Link>
                <div className={styles.brandTitle}>
                    LABORATORIO <span>IA</span>
                </div>
            </div>

            <main className={styles.mainContent}>
                <div className={styles.controlPanel}>
                    <div className={styles.graffitiTag}>CREA TU PIEZA</div>

                    {/* 1. Talla */}
                    <div className={styles.inputGroup}>
                        <label className={styles.labelNeon}>1. TALLA</label>
                        <div className={styles.sizeSelection}>
                            {isLoadingData ? (
                                <p style={{ color: 'white', fontSize: '0.8rem' }}>Conectando base térmica...</p>
                            ) : (
                                <>
                                    {normalSizes.map((s) => (
                                        <button
                                            key={s.size_id}
                                            className={`${styles.sizeCircle} ${rugSize === s.size_id.toString() ? styles.activeSize : ''}`}
                                            onClick={() => {
                                                setRugSize(s.size_id.toString());
                                                setShowKeyboardOptions(false);
                                            }}
                                        >
                                            <span className={styles.sizeKey}>{(parseFloat(s.price)).toFixed(0)}€</span>
                                            <span className={styles.sizeLabel}>{s.size_label}</span>
                                        </button>
                                    ))}
                                    {keyboardSizes.length > 0 && (
                                        <button
                                            className={`${styles.sizeCircle} ${showKeyboardOptions ? styles.activeSize : ''}`}
                                            onClick={() => {
                                                setShowKeyboardOptions(true);
                                                if (!keyboardSizes.map(ks => ks.size_id.toString()).includes(rugSize)) {
                                                    setRugSize('');
                                                }
                                            }}
                                        >
                                            <span className={styles.sizeKey}>Varios</span>
                                            <span className={styles.sizeLabel}>Teclados</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {showKeyboardOptions && (
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <label className={styles.labelNeon} style={{ width: '100%', fontSize: '0.75rem', opacity: 0.8 }}>
                                    ELIGE TAMAÑO TECLADO
                                </label>
                                {keyboardSizes.map(s => (
                                    <button
                                        key={s.size_id}
                                        className={`${styles.sizeCircle} ${rugSize === s.size_id.toString() ? styles.activeSize : ''}`}
                                        onClick={() => setRugSize(s.size_id.toString())}
                                        style={{ transform: 'scale(0.9)', minWidth: '100px', margin: 0 }}
                                    >
                                        <span className={styles.sizeKey}>{(parseFloat(s.price)).toFixed(0)}€</span>
                                        <span className={styles.sizeLabel}>
                                            {s.size_label.replace('Teclado ', '').replace('(', '').replace(')', '')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedSizeObj?.size_label.toLowerCase().includes('a medida') && (
                            <div style={{ marginTop: '0.8rem' }}>
                                <label className={styles.labelNeon} style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                    DIME LA MEDIDA FINAL (CM)
                                </label>
                                <input
                                    type="text"
                                    className={styles.promptInput}
                                    style={{ minHeight: '40px', height: 'auto', padding: '10px', fontSize: '0.9rem' }}
                                    placeholder="Ej: Largo 50 x Alto 18"
                                    value={customKeyboardSize}
                                    onChange={(e) => setCustomKeyboardSize(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* 2. Subir imagen */}
                    <div className={styles.inputGroup}>
                        <label className={styles.labelNeon}>2. TU IMAGEN</label>
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
                        <label className={styles.labelNeon}>
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
                                <div className={styles.rubikIcon}>?</div>
                                <p>SUBE TU IMAGEN Y GENERA</p>
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