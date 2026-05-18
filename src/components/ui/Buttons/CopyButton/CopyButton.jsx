/**
 * @file CopyButton.jsx
 * @description Botón para copiar un texto al portapapeles con confirmación visual breve.
 */
'use client';

import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa6';
import styles from './CopyButton.module.css';

export default function CopyButton({ value, label, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className={styles.copyButton} onClick={handleCopy}>
      {/* className va aquí, directo en el texto */}
      <span className={className}>{label ?? value}</span>
      <span className={styles.copyIcon}>
        {copied ? <FaCheck size={12} color="#00ff80" /> : <FaCopy size={12} />}
      </span>
    </button>
  );
}