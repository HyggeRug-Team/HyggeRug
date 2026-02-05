import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

/**
 * Layout principal con Header y Footer
 * Se aplica a todas las páginas del grupo (main):
 * - Home (/)
 * - Tienda (/tienda)
 * - Categorías (/categorias/[slug])
 * - Sobre nosotros (/sobre-nosotros)
 * - Contacto (/contacto)
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
