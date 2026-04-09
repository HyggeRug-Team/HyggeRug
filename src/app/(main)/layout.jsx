import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

/**
 * @file layout.jsx (Grupo Main)
 * @description Layout principal que provee de Navbar (Header) y Footer global a las rutas comerciales.
 * 
 * [Nuestro enfoque]
 * Hemos organizado el proyecto con la estrategia "Route Groups" de Next.js (esas carpetas entre paréntesis).
 * ¿Qué ventaja nos da esto? Nos permite envolver mágicamente todas las páginas de la tienda (Home, Contacto...)
 * con la barra de navegación y el pie de página, sin afectar ni ensuciar el diseño del Panel de Control Privado.
 * Es un código limpio, fácil de leer y muy profesional ("Separación de Responsabilidades").
 *
 * [Por qué lo hemos hecho así]
 * Elegimos Route Groups porque mejora la mantenibilidad: el panel privado queda aislado y
 * el layout comercial se aplica de forma automática.
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
