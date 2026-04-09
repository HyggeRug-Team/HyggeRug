"use client";
import React, { useState } from 'react';
import styles from './Studio.module.css';
import { FaSync, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function DesignStudioAI() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [attempts, setAttempts] = useState(5);
    const [rugSize, setRugSize] = useState('M');

    const sizes = {
        'S': { label: '60x60', price: 80 },
        'M': { label: '90x90', price: 140 },
        'L': { label: '120x120', price: 210 }
    };

    const generateAiDesign = async () => {
        if (attempts <= 0 || isGenerating || prompt.trim().length < 3) return;
        setIsGenerating(true);
        setAiResult(null);

        try {
            const styleTemplate = "custom tufting rug, hyper-realistic macro wool texture, street art graffiti style, bold color palette, 8k professional rug photography, studio lighting, clean background";
            const finalPrompt = `${styleTemplate}. Theme: ${prompt}. Dimensions: ${sizes[rugSize].label}`;
            const seed = Math.floor(Math.random() * 999999);
            const nanoBananaUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

            const img = new Image();
            img.src = nanoBananaUrl;
            img.onload = () => {
                setAiResult(nanoBananaUrl);
                setAttempts(prev => prev - 1);
                setIsGenerating(false);
            };
            img.onerror = () => {
                setIsGenerating(false);
            };
        } catch (err) {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.studioContainer}>
            {/* BARRA SUPERIOR RETRO/URBANA */}
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
                {/* LATERAL: Panel de Control Urbano */}
                <div className={styles.controlPanel}>
                    <div className={styles.graffitiTag}>CREA TU PIEZA</div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.labelNeon}>1. TALLA</label>
                        <div className={styles.sizeSelection}>
                            {Object.entries(sizes).map(([key, s]) => (
                                <button
                                    key={key}
                                    className={`${styles.sizeCircle} ${rugSize === key ? styles.activeSize : ''}`}
                                    onClick={() => setRugSize(key)}
                                >
                                    <span className={styles.sizeKey}>{key}</span>
                                    <span className={styles.sizeLabel}>{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.labelNeon}>2. CONCEPTO O IDEA</label>
                        <textarea 
                            className={styles.promptInput}
                            value={prompt} 
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej. Una calavera cyberpunk con rosas de neón..."
                        />
                    </div>

                    <div className={styles.actionGroup}>
                        <div className={styles.creditsWrapper}>
                            <span className={styles.creditIcon}>⚡</span> CRÉDITOS RESTANTES: <strong>{attempts}</strong>
                        </div>
                        <button 
                            className={styles.mainAction} 
                            disabled={prompt.length < 3 || isGenerating || attempts <= 0}
                            onClick={generateAiDesign}
                        >
                            {isGenerating ? <FaSync className={styles.spin} /> : "GENERAR BOCETO"}
                        </button>
                    </div>
                </div>

                {/* CENTRO: LIENZO GRAFFITI */}
                <div className={styles.canvasArea}>
                    <div className={styles.viewport}>
                        {isGenerating && (
                            <div className={styles.aiProcessing}>
                                <div className={styles.glitchText}>PROCESANDO CON...<br/>NANO BANANA ENGINE</div>
                            </div>
                        )}
                        
                        {!aiResult && !isGenerating && (
                            <div className={styles.emptyCanvas}>
                                <div className={styles.rubikIcon}>?</div>
                                <p>ESPERANDO TU IDEA</p>
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
                
                {/* PANEL DERECHO: Resumen de Compra Underground */}
                <div className={styles.checkoutPanel}>
                    <h3 className={styles.receiptTitle}>TICKET</h3>
                     <div className={styles.receiptBody}>
                        <div className={styles.receiptLine}>
                            <span>TAMAÑO {rugSize}</span>
                            <span>{sizes[rugSize].label}</span>
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
                            <strong>{sizes[rugSize].price}€</strong>
                        </div>
                     </div>
                     <button className={styles.buyAction} disabled={!aiResult}>
                         COMPRAR DISEÑO
                     </button>
                 </div>
            </main>
        </div>
    );
}
