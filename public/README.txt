PUBLIC - Assets estáticos

Archivos estáticos accesibles públicamente desde /

images/ - Imágenes del sitio
  - logo.svg - Logo de Hygge Rug
  - logo-white.svg - Logo blanco (para fondos oscuros)
  - hero-bg.jpg - Fondo del hero
  - placeholder.jpg - Imagen placeholder
  
  products/ - Imágenes de productos
    - 1-main.jpg, 1-2.jpg, 1-3.jpg
    - 2-main.jpg, 2-2.jpg, 2-3.jpg
    - etc.
  
  categories/ - Imágenes de categorías
    - modern.jpg
    - vintage.jpg
    - geometric.jpg
    - etc.

icons/ - Iconos SVG
  - cart.svg
  - user.svg
  - search.svg
  - heart.svg
  - etc.

fonts/ - Fuentes personalizadas (si no usas Google Fonts)
  - CustomFont-Regular.woff2
  - CustomFont-Bold.woff2

favicon.ico - Favicon del sitio
robots.txt - Configuración para crawlers
sitemap.xml - Sitemap para SEO

Acceso desde el código:
- En HTML/JSX: <img src="/images/logo.svg" />
- En CSS: url('/images/hero-bg.jpg')
- Next.js optimiza automáticamente las imágenes con next/image
