import React from 'react';
import styles from './GlobalBackgroundText.module.css';

export default function GlobalBackgroundText() {
  return (
    <div className={styles.globalTextContainer}>
      <div className={`${styles.floatText} ${styles.text1}`}>ARTE SUAVE</div>
      <div className={`${styles.floatText} ${styles.text2}`}>HECHO A MANO</div>
      <div className={`${styles.floatText} ${styles.text3}`}>HYGGE STUDIO</div>
      <div className={`${styles.floatText} ${styles.text4}`}>ARTE TEXTIL</div>
      <div className={`${styles.floatText} ${styles.text5}`}>TUFTING POP</div>
    </div>
  );
}
