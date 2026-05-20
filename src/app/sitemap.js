import { db } from '@/lib/db';

const BASE_URL = 'https://www.hyggerug.com';

const staticPages = [
  { url: '/',                          priority: 1.0, changeFrequency: 'daily'   },
  { url: '/tienda',                    priority: 0.9, changeFrequency: 'daily'   },
  { url: '/personalizar',              priority: 0.8, changeFrequency: 'weekly'  },
  { url: '/crear-diseno',              priority: 0.8, changeFrequency: 'weekly'  },
  { url: '/sobre-nosotros',            priority: 0.7, changeFrequency: 'monthly' },
  { url: '/preguntas-frecuentes',      priority: 0.6, changeFrequency: 'monthly' },
  { url: '/contacto',                  priority: 0.6, changeFrequency: 'monthly' },
  { url: '/legal/envios-devoluciones', priority: 0.4, changeFrequency: 'monthly' },
  { url: '/legal/privacidad',          priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/legal/terminos',            priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/legal/cookies',             priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/legal/aviso-legal',         priority: 0.3, changeFrequency: 'yearly'  },
];

export default async function sitemap() {
  const staticEntries = staticPages.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  let productEntries = [];
  try {
    const [products] = await db.query(
      'SELECT product_id, updated_at FROM products WHERE public = 1'
    );
    productEntries = products.map((product) => ({
      url: `${BASE_URL}/tienda/${product.product_id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // Si falla la consulta, el sitemap sigue funcionando con las páginas estáticas
  }

  return [...staticEntries, ...productEntries];
}
