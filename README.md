# 🧶 Hygge Rug - Documentación Técnica Integral

### Proyecto Final de Grado | Aplicación en Producción Real (España)

![Hygge Rug Logo Real](public/Hygge_logo.png)

## 👤 Autores y Desarrolladores

Este ecosistema digital ha sido diseñado y desarrollado íntegramente por:

- **Daniel Medina Rodas** - [GitHub: Danyx-git](https://github.com/Danyx-git)
- **Hector Castro Cascales** - [GitHub: Cabradeosas](https://github.com/Cabradeosas)

---

## 🚀 1. Visión General del Proyecto

**Hygge Rug** representa la convergencia entre la artesanía tradicional del _tufting_ y el desarrollo web moderno de alto rendimiento. Concebido como un proyecto final de grado y escalado a un entorno de **producción real**, el sistema se centra exclusivamente en el **mercado español**.

Dada la naturaleza artesanal de los productos, donde la producción está centralizada para garantizar la máxima calidad nacional, la plataforma actúa como un multiplicador de eficiencia, automatizando desde la concepción del diseño mediante IA hasta la gestión logística y el soporte al cliente.

---

## 📋 Tabla de Contenidos

1.  [Arquitectura del Sistema](#-2-arquitectura-del-sistema)
2.  [Innovación: Laboratorio de Diseño I.A.](#-3-innovación-laboratorio-de-diseño-ia)
3.  [Modelo de Datos y Persistencia](#-4-modelo-de-datos-y-persistencia)
4.  [Configuración Dinámica (Config Engine)](#-5-configuración-dinámica-y-administración)
5.  [Seguridad y Control de Acceso](#-6-seguridad-y-control-de-acceso)
6.  [Sistema de Diseño y UX](#-7-sistema-de-diseño-uiux)
7.  [SEO y Rendimiento en Producción](#-8-seo-y-rendimiento-en-producción)
8.  [Guía de Instalación y Desarrollo Técnico](#-9-guía-de-instalación-y-desarrollo-técnico)
9.  [Gestión de Pedidos y Logística](#-10-gestión-de-pedidos-y-logística)
10. [Estructura Detallada de Componentes](#-11-estructura-detallada-de-componentes-design-system)
11. [Servicios de Backend y Automatización](#-12-servicios-de-backend-y-automatización)
12. [Desafíos Técnicos y Soluciones Implementadas](#-13-desafíos-técnicos-y-soluciones-implementadas)
13. [Estándares de Código y Filosofía](#-14-estándares-de-código-y-filosofía-nosotros)
14. [Guía de Mantenimiento Operativo](#-15-guía-de-mantenimiento-operativo)
15. [Documentación de API Endpoints](#-16-documentación-detallada-de-api-endpoints)
16. [Infraestructura y Despliegue en Producción](#-17-infraestructura-y-despliegue-en-producción)
17. [Accesibilidad (a11y) y Semántica](#-18-accesibilidad-a11y-y-semántica)
18. [Estándares de Diseño y Tipografía](#-19-estándares-de-diseño-y-tipografía)
19. [Control de Versiones y Flujo de Trabajo](#-20-control-de-versiones-y-flujo-de-trabajo)
20. [Estructura de Directorios Granular](#-21-estructura-de-directorios-granular)
21. [Auditoría de Rendimiento (Lighthouse)](#-22-auditoría-de-rendimiento-lighthouse)

---

## 🏗️ 2. Arquitectura del Sistema

### 2.1 Core del Framework

Utilizamos **Next.js 14/15** con la arquitectura de **App Router**, aprovechando:

- **Server Components (RSC)**: Para el renderizado de datos críticos, mejorando el SEO y reduciendo el JS enviado al cliente.
- **Server Actions**: Gestión de mutaciones de datos (formularios, carritos, estados de pedido) de forma segura y eficiente sin necesidad de endpoints API tradicionales en muchos casos.
- **Middleware (Edge Runtime)**: Implementación de un sistema de protección de rutas que valida sesiones JWT y roles de usuario en el borde, garantizando que el dashboard administrativo sea inaccesible para perfiles no autorizados.

### 2.2 Gestión de Estado y Contexto

- **CartContext**: Sistema reactivo para la gestión del carrito de compra persistente.
- **Optimistic UI**: Implementado en el panel de pedidos para permitir cambios de estado instantáneos, mejorando la percepción de velocidad del administrador.

---

## 🤖 3. Innovación: Laboratorio de Diseño I.A.

El **Rug Lab** es el núcleo creativo de la plataforma. Permite a los usuarios generar diseños de alfombras mediante modelos de Inteligencia Artificial generativa.

- **Proceso**: El usuario introduce un prompt descriptivo -> El sistema procesa la petición mediante nuestra API interna -> Se genera un boceto visual de alta resolución.
- **Integración**: Los diseños generados pueden guardarse directamente en el perfil del usuario o enviarse al taller para una valoración técnica automática de viabilidad de tejido.

---

## 📊 4. Modelo de Datos y Persistencia

### 4.1 Base de Datos (TiDB)

Hemos optado por **TiDB**, una base de datos MySQL-compatible distribuida que ofrece consistencia fuerte y escalabilidad horizontal.

- **Estructura de Tablas**:
  - `users`: Perfiles, roles, credenciales y puntos Hygge.
  - `products`: Catálogo dinámico con variantes y stock.
  - `orders`: Cabeceras de pedido y estados de producción.
  - `order_items`: Detalle de productos, cantidades y precios históricos.
  - `config`: Tabla maestra de variables globales (nuestra última gran optimización).
  - `reviews` & `returns`: Gestión de feedback y logística inversa.

### 4.2 Almacenamiento de Medios (Vercel Blob)

Para evitar la carga en el servidor de base de datos y optimizar el LCP (Largest Contentful Paint), utilizamos **Vercel Blob** para:

- Videos de TikTok integrados dinámicamente.
- Imágenes de productos en alta resolución.
- Bocetos generados por IA.

---

## ⚙️ 5. Configuración Dinámica y Administración

Una de las innovaciones clave de este proyecto es la **centralización total de la configuración**. Mediante el panel de "Configuración Maestra", el administrador puede modificar en tiempo real:

- **Redes Sociales**: Enlaces de Instagram y TikTok que se propagan instantáneamente a Header, Footer y Menú Móvil.
- **Multimedia**: Video del Hero, posters y URLs de videos informativos.
- **Logística**: Costes de envío y tiempos estimados de entrega.
- **General**: Mensajes del sistema, avisos y variables de contacto.

---

## 🔐 6. Seguridad y Control de Acceso

- **Autenticación JWT**: Tokens firmados almacenados en cookies `HttpOnly` para prevenir ataques XSS.
- **Role-Based Access Control (RBAC)**: Separación estricta entre las rutas `(admin)` y `(customer)`.
- **Sanitización de Datos**: Validación rigurosa de entradas en Server Actions y API Routes para prevenir inyecciones SQL.

---

## 🎨 7. Sistema de Diseño (UI/UX)

El diseño de Hygge Rug ha sido concebido para transmitir exclusividad y modernidad.

- **Estética**: _Glassmorphism_ avanzado con desenfoques de fondo (backdrop-filters) y bordes sutiles.
- **CSS Modules**: Garantizamos que cada componente tenga sus propios estilos encapsulados, facilitando el mantenimiento y evitando el "CSS global pollution".
- **Tokens de Diseño**: Uso extensivo de variables CSS para mantener la coherencia en colores, tipografías (Inter, Outfit) y espaciados.

---

## 📈 8. SEO y Rendimiento en Producción

Como proyecto real en el mercado español, el SEO es vital:

- **Metadata API**: Generación dinámica de títulos, descripciones y OpenGraph tags para cada producto y página.
- **Sitemap & Robots**: Generación automática de rutas para facilitar la indexación.
- **Optimización de Imágenes**: Uso de `next/image` con tamaños adaptativos y carga diferida (lazy loading).

---

## 🛠️ 9. Guía de Instalación y Desarrollo Técnico

### Requisitos Previos

- Node.js 18+
- Instancia de MySQL o TiDB
- Tokens de Vercel Blob y Mailer (Gmail App Password)

### Variables de Entorno (.env)

```env
# Conectividad
DATABASE_URL=...
JWT_SECRET=...

# Almacenamiento
BLOB_READ_WRITE_TOKEN=...

# Notificaciones
EMAIL_USER=...
EMAIL_PASS=...

# Configuración IA
AI_GENERATION_KEY=...
```

### Comandos de Script

- `npm run dev`: Entorno de desarrollo local con recarga en caliente.
- `npm run build`: Generación de la build de producción optimizada.
- `npm run start`: Ejecución del servidor en modo producción.

---

## 📦 10. Gestión de Pedidos y Logística

El sistema implementa un flujo de trabajo "FIFO" (First In, First Out) para la producción:

1.  **Recibido**: Confirmación de pago y propuesta de diseño.
2.  **Tejiendo**: El pedido entra físicamente en el bastidor de tufting.
3.  **Enviado**: Generación de número de seguimiento y notificación al cliente.
4.  **Entregado**: Cierre del ciclo y habilitación de valoraciones multimedia.

---

## 🏗️ 11. Estructura Detallada de Componentes (Design System)

Hemos desarrollado una biblioteca de componentes propia, diseñada para la máxima reutilización y coherencia visual:

### 11.1 Componentes de UI Globales

- **FloatingLabelInput**: Un sistema de inputs inteligentes con etiquetas flotantes que optimizan el espacio en móviles.
- **GlassButton & SecondaryButton**: Botones con efectos de profundidad y micro-interacciones de hover.
- **FeedbackModal**: Sistema centralizado de notificaciones (success/error/loading) que garantiza una comunicación clara con el usuario.

### 11.2 Dashboards de Alta Densidad (Admin & Client)

El diseño de los paneles de control se basa en el principio de **High-Density Information**:

- **AdminOrdersClient**: Pipeline visual de pedidos con acordeones animados.
- **ConfigList**: Interfaz de lista compacta para la edición de variables técnicas con previsualización multimedia en tiempo real.
- **StatsGrid**: Tarjetas de métricas clave con indicadores de tendencia.

---

## 📧 12. Servicios de Backend y Automatización

### 12.1 Mailer Service (Lógica Transaccional)

El servicio `src/lib/mailer.js` no es solo un enviador de correos; es un motor de comunicación contextual:

- **Templates Dinámicos**: Genera correos con estilos embebidos que aseguran la identidad de marca en cualquier cliente de correo.
- **Contextualización**: Inyecta datos reales del pedido, enlaces de seguimiento y resúmenes de artículos de forma automática según el cambio de estado en la BBDD.

### 12.2 Middleware de Protección (Edge Security)

El archivo `src/middleware.js` actúa como un guardián en el borde:

- Valida la integridad del JWT.
- Comprueba los permisos de rol antes de que la petición llegue al servidor.

---

## 🧩 13. Desafíos Técnicos y Soluciones Implementadas

### 13.1 El Reto de la Hidratación en el Hero

**Problema**: Desajustes visuales al cargar videos pesados y componentes con IA en el primer renderizado.
**Solución**: Implementamos técnicas de "Skeleton Loading" y pre-carga selectiva de assets mediante `priority` en `next/image` y carga diferida de los scripts de IA.

### 13.2 Centralización de Configuración sin Redespliegues

**Problema**: Cambiar el link de Instagram o el video de portada requería una nueva compilación de la web.
**Solución**: Diseñamos la arquitectura de la tabla `config` y el helper `getConfigValues`, permitiendo que el Header y Footer consuman datos de la BBDD en cada petición, haciendo que la web sea 100% editable desde el panel de admin.

---

## 🤝 14. Estándares de Código y Filosofía "Nosotros"

En Hygge Rug, el código se trata con el mismo respeto que la lana en el taller:

- **Tono de Documentación**: Todos los comentarios y archivos `README` internos utilizan la primera persona del plural ("nosotros hemos implementado..."), reflejando el espíritu colaborativo de Daniel y Hector.
- **Human-Centric Coding**: Evitamos comentarios puramente técnicos y vacíos; preferimos explicar el "por qué" y el "cómo" de cada decisión arquitectónica para facilitar el mantenimiento futuro.

---

## 🔧 15. Guía de Mantenimiento Operativo

### Adición de Nuevos Productos

1.  Subir la imagen principal a Vercel Blob.
2.  Registrar el producto en el catálogo administrativo con su precio y categoría.
3.  El sistema lo inyectará automáticamente en el escaparate dinámico de la Home.

---

## 🔌 16. Documentación Detallada de API Endpoints

### 16.1 Gestión de Pedidos (`/api/admin/orders`)

- **GET**: Recupera el listado completo de pedidos con información del cliente y artículos. Soporta filtrado por estado.
- **PUT `/[id]`**: Actualiza el estado de producción de un pedido. Dispara automáticamente el envío de correos transaccionales al cliente.
- **POST `/custom`**: Endpoint especializado para la creación de pedidos basados en diseños del Lab IA.

### 16.2 Sistema de Configuración (`/api/admin/config`)

- **GET**: Obtiene todas las variables de entorno almacenadas en BBDD.
- **POST/PUT**: Permite la creación y actualización de claves técnicas (social_links, video_urls, etc.).
- **DELETE `?id=X`**: Eliminación segura de claves obsoletas.

### 16.3 Gestión de Usuarios (`/api/admin/users`)

- **GET**: Listado de la comunidad con métricas de compra y puntos acumulados.
- **GET `/[id]`**: Detalle profundo de un usuario: historial de pedidos, tickets de soporte y direcciones.

---

## 🛠️ 17. Infraestructura y Despliegue en Producción

### 17.1 CI/CD con Vercel

El proyecto utiliza un flujo de despliegue continuo vinculado a la rama `main` de GitHub:

- **Build Optimization**: Next.js realiza un análisis de los Server Components para generar páginas estáticas (SSG) donde es posible, maximizando la velocidad.
- **Environment Validation**: Verificación de todas las variables de entorno críticas antes de pasar a producción.

### 17.2 Base de Datos Distribuida (TiDB Cloud)

Utilizamos el tier _Serverless_ de TiDB para:

- **Escalado Automático**: Manejo de picos de tráfico durante lanzamientos de nuevas colecciones.
- **Seguridad**: Conexiones cifradas y backups automáticos diarios.

---

## ♿ 18. Accesibilidad (a11y) y Semántica

Nos hemos asegurado de que **Hygge Rug** sea inclusivo:

- **HTML5 Semántico**: Uso correcto de `main`, `section`, `article` y `header` para facilitar la navegación con lectores de pantalla.
- **ARIA Labels**: Todos los botones de iconos y acciones del dashboard incluyen etiquetas descriptivas.
- **Contraste**: Cumplimiento de los ratios de contraste WCAG para garantizar la legibilidad en interfaces oscuras.

---

## 📏 19. Estándares de Diseño y Tipografía

La identidad visual se apoya en un sistema de diseño robusto:

- **Fuentes**: `Inter` para legibilidad técnica y `Outfit` para títulos con carácter.
- **Colores Maestro**:
  - `--highlight-text`: El azul eléctrico distintivo de la marca.
  - `--accent-purple`: Utilizado para elementos creativos e IA.
  - `--glass-bg`: Transparencia base del 3% con blur de 12px.

---

## 🔄 20. Control de Versiones y Flujo de Trabajo

Daniel y Hector han seguido un flujo de trabajo riguroso en Git:

- **Commits Descriptivos**: Cada cambio está documentado en español, explicando la funcionalidad añadida.
- **Modularidad**: Los cambios se han realizado por bloques lógicos (UI, Backend, Config) para mantener la estabilidad de la rama principal.

---

## 📁 21. Estructura de Directorios Granular

```bash
src/
├── app/                      # Rutas de la aplicación (File-based routing)
│   ├── (main)/               # Zona pública: Home, Tienda, Contacto, Legal
│   ├── (dashboard)/          # Vistas privadas divididas por rol
│   │   ├── (admin)/          # Panel maestro: Pedidos, Usuarios, Ajustes, Soporte
│   │   └── (customer)/       # Perfil cliente: Resumen, Pedidos, Devoluciones, Cuenta
│   ├── (auth)/               # Flujo de autenticación (Login/Registro unificado)
│   └── api/                  # Endpoints REST internos (POST, GET, PUT, DELETE)
├── components/               # Biblioteca de componentes atómicos y modulares
│   ├── dashboard/            # Componentes específicos del área privada
│   ├── layout/               # Header, Footer, Menú Móvil, Navegación
│   ├── sections/             # Secciones complejas (Hero, InfoSection, Drops)
│   ├── store/                # Lógica de tienda (ProductDetail, Reviews)
│   └── ui/                   # Átomos: Botones, Inputs, Modales, Cards, Feedback
├── lib/                      # Núcleo lógico y utilidades
│   ├── db/                   # Controladores de base de datos segmentados
│   ├── auth.js               # Lógica de encriptación y sesiones
│   └── mailer.js             # Servicio de notificaciones automáticas
├── hooks/                    # Hooks personalizados (useIsTouchDevice, etc.)
└── context/                  # Proveedores de estado global (CartContext)
```

---

## ⚡ 22. Auditoría de Rendimiento (Lighthouse)

El proyecto ha sido optimizado para alcanzar puntuaciones cercanas al 100% en todos los apartados de Lighthouse:

- **Performance**: Optimización de imágenes de nueva generación (WebP), minificación de CSS y eliminación de JS bloqueante.
- **Best Practices**: Uso de HTTPS, seguridad de cookies y dependencias actualizadas.
- **SEO**: Estructura de encabezados perfecta, meta-tags descriptivos y sitemaps funcionales.

---

© 2026 **Hygge Rug**. Daniel Medina Rodas & Hector Castro Cascales.
Proyecto Real en Producción para el Mercado Español.
"Hecho a mano, gestionado con tecnología."
