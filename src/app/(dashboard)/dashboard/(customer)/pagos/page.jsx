import Link from 'next/link';
import { FaArrowLeft, FaMobileScreen, FaBuilding, FaCircleInfo } from 'react-icons/fa6';
import styles from './pagos.module.css';

export const metadata = {
  title: 'Métodos de Pago | Hygge Rug',
  description: 'Información sobre los métodos de pago disponibles en Hygge Rug',
};

export default function PagosPage() {
  return (
    <div className={styles.container}>

      <Link href="/dashboard/resumen" className={styles.backBtn}>
        <FaArrowLeft /> Volver
      </Link>

      <div className={styles.header}>
        <span className={styles.badge}>PRÓXIMAMENTE</span>
        <h1 className={styles.title}>Métodos de Pago</h1>
        <p className={styles.subtitle}>
          Ahora mismo gestionamos los pagos de forma manual. Cuando integres tu pedido te indicamos cómo realizarlo.
        </p>
      </div>

      <div className={styles.methodsGrid}>
        <div className={styles.methodCard}>
          <FaMobileScreen className={styles.methodIcon} />
          <div className={styles.methodText}>
            <h3>Bizum</h3>
            <p>Te facilitamos el número al confirmar tu pedido. Rápido y sin comisiones.</p>
          </div>
        </div>
        <div className={styles.methodCard}>
          <FaBuilding className={styles.methodIcon} />
          <div className={styles.methodText}>
            <h3>Transferencia bancaria</h3>
            <p>Empezamos a fabricar tu alfombra en cuanto confirmamos el ingreso en cuenta.</p>
          </div>
        </div>
      </div>

      <div className={styles.futureNote}>
        <FaCircleInfo className={styles.futureIcon} />
        <p>
          Estamos trabajando para integrar una <strong>pasarela de pago segura</strong> con tarjeta y otras opciones digitales.
          Pronto podrás gestionar todo directamente desde aquí.
        </p>
      </div>

    </div>
  );
}
