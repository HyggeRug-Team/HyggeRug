import HeroSection from '@/components/sections/HeroSection/HeroSection';
import MarqueeStrip from '@/components/sections/MarqueeStrip/MarqueeStrip';
import FeaturedDrops from '@/components/sections/FeaturedDrops/FeaturedDrops';
import InfoSection from '@/components/sections/InfoSection/InfoSection';
import { getRandomProducts } from '@/lib/db/products';

/**
 * @file page.jsx (Home)
 * @description Página principal de Hygge Rug (tienda de alfombras personalizadas).
 *
 * [Nuestro enfoque]
 * Hemos construido la home con dos bloques claros: el hero (impacto inicial) y la sección
 * informativa (por qué elegirnos).
 *
 * [Por qué lo hemos hecho así]
 * Así el usuario entiende rápido el producto y el valor de la marca, sin páginas largas
 * antes de tiempo.
 */
export default async function Home() {
  const customCards = await getRandomProducts(7);

  return (
    <>
      <HeroSection customCards={customCards} />
      <MarqueeStrip />
      <FeaturedDrops />
      <InfoSection />
    </>
  );
}
