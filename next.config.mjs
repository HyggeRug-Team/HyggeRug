/** Aquí realizamos la configuración principal de Next.js para que todo funcione como la seda */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [75, 85],
  },
  compiler: {
    // Esto se encarga de eliminar todos los console.log en producción para que el código esté limpio
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
