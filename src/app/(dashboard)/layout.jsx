import styles from './dashboard.module.css';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

/**
 * Layout Principal del Dashboard
 * 
 * Este componente define el layout compartido para todas las páginas del grupo (dashboard).
 * Utilizamos la funcionalidad de Route Groups de Next.js mediante la carpeta (dashboard)
 * para aplicar este layout automáticamente a todas las rutas hijas.
 * 
 * Estructura del Layout (Desktop):
 * ┌──────────────────────────────────────────┐
 * │  Sidebar    │  Main Content              │
 * │  (280px)    │  (resto del espacio)       │
 * │             │                            │
 * │  - Logo     │  {children}                │
 * │  - Menú     │  (Contenido dinámico)      │
 * │  - Perfil   │                            │
 * └──────────────────────────────────────────┘
 * 
 * Diseño Responsive:
 * - Desktop (>768px): Sidebar fijo de 280px + contenido
 * - Tablet (768px-992px): Sidebar de 220px + contenido
 * - Móvil (<768px): Sidebar oculto, solo contenido
 * 
 * Implementamos un diseño de dos columnas con CSS Grid:
 * - Columna izquierda: Sidebar con ancho fijo (responsive)
 * - Columna derecha: Área de contenido que ocupa el resto del espacio
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página actual
 */
export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      {/* Barra lateral con navegación y perfil */}
      <Sidebar /> 
      
      {/* Área principal donde se renderiza el contenido de cada página */}
      <main>
        {children}
      </main>
    </div>
  );
}

