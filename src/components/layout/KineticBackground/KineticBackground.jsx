/*
 * Componente: KineticBackground
 * Descripción: Fondo animado con palabras flotantes ("HAND MADE", "TUFT LOVE", etc.) que se generan aleatoriamente en el cliente.
 */

"use client";
import React, { useState, useEffect } from 'react';
import styles from './KineticBackground.module.css';

// Fondo cinético optimizado con CSS (Cero uso de CPU en JS)
const KineticBackground = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Generamos las palabras solo en el cliente para evitar Hydration Mismatch
        const phrases = [
            "HAND MADE", "TUFT LOVE", "RUG LIFE", "SOFT ART", 
            "WOOL GANG", "CUSTOM RUGS", "HYGGE STYLE", "NO BAD VIBES", 
            "TEXTILE ART", "KEEP IT SOFT", "FLOOR CANDY", "MAKERS GONNA MAKE"
        ];
        
        const newElements = Array.from({ length: 8 }).map((_, i) => ({
            text: phrases[i % phrases.length],
            top: `${Math.random() * 85}%`, 
            left: `-${Math.random() * 20 + 20}%`,
            duration: `${Math.random() * 15 + 30}s`, 
            delay: `-${Math.random() * 30}s`, 
            size: `${Math.random() * 8 + 10}vw`,  /* 10vw–18vw: gigante en cualquier pantalla */
            opacity: Math.random() * 0.15 + 0.1   /* 0.10–0.25: presencia sin tapar todo */
        }));
        
        setElements(newElements);
    }, []);

    if (elements.length === 0) return null; // No renderizar nada hasta que esté en el cliente

    return (
        <div className={styles.kineticContainer}>
            {elements.map((el, index) => (
                <div 
                    key={index}
                    className={styles.floatingWord}
                    style={{
                        top: el.top,
                        left: el.left, // Punto de inicio relativo (siempre animará desde -100%)
                        fontSize: el.size,
                        opacity: el.opacity,
                        animationDuration: el.duration,
                        animationDelay: el.delay
                    }}
                >
                    {el.text}
                </div>
            ))}
        </div>
    );
};

export default KineticBackground;
