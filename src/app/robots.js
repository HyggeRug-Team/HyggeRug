export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/crear-diseno/'],
      },
    ],
    sitemap: 'https://www.hyggerug.com/sitemap.xml',
  };
}
