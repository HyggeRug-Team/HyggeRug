# 🧶 Hygge Rug — Documentación Técnica

<div align="center">

![Hygge Rug Logo](public/Hygge_logo.png)

**Plataforma de e-commerce artesanal para el mercado español**
Proyecto Final de Grado · En producción real

[![Next.js](https://img.shields.io/badge/Next.js-^16.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TiDB](https://img.shields.io/badge/Base%20de%20Datos-TiDB%20Cloud-red)](https://tidbcloud.com/)
[![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)](https://vercel.com/)

</div>

---

## 👥 Autores

| Desarrollador | GitHub |
|---|---|
| **Daniel Medina Rodas** | [@Danyx-git](https://github.com/Danyx-git) |
| **Hector Castro Cascales** | [@Cabradeosas](https://github.com/Cabradeosas) |

---

## 📋 Tabla de Contenidos

1. [Visión General](#-1-visión-general)
2. [Stack Tecnológico](#-2-stack-tecnológico)
3. [Arquitectura del Sistema](#-3-arquitectura-del-sistema)
4. [Laboratorio de IA (Rug Lab)](#-4-laboratorio-de-ia-rug-lab)
5. [Base de Datos y Tablas](#-5-base-de-datos-y-tablas)
6. [Config Engine — Configuración Dinámica](#-6-config-engine--configuración-dinámica)
7. [Autenticación y Seguridad](#-7-autenticación-y-seguridad)
8. [Sistema de Diseño](#-8-sistema-de-diseño)
9. [Guía de Instalación](#-9-guía-de-instalación)
10. [Variables de Entorno](#-10-variables-de-entorno)
11. [Gestión de Pedidos](#-11-gestión-de-pedidos)
12. [Server Actions](#-12-server-actions)
13. [API Endpoints](#-13-api-endpoints)
14. [Servicio de Email (Mailer)](#-14-servicio-de-email-mailer)
15. [Infraestructura y Despliegue](#-15-infraestructura-y-despliegue)
16. [Estructura de Directorios](#-16-estructura-de-directorios)
17. [Componentes](#-17-componentes)
18. [Capas de Base de Datos (`src/lib/db/`)](#-18-capas-de-base-de-datos-srclibdb)
19. [Tipografías y Tokens CSS](#-19-tipografías-y-tokens-css)
20. [Accesibilidad](#-20-accesibilidad)
21. [Control de Versiones](#-21-control-de-versiones)

---

## 🚀 1. Visión General

**Hygge Rug** es una plataforma de e-commerce artesanal centrada en el mercado español, especializada en alfombras de _tufting_ hechas a mano en Madrid. El proyecto nació como Trabajo Final de Grado y está actualmente en producción real en [hyggerug.com](https://hyggerug.com).

La plataforma cubre el ciclo completo del negocio:

- Escaparate dinámico con productos reales de la comunidad.
- Generación de diseños de alfombras mediante IA (Gemini 2.5 Flash).
- Carrito de compra persistente en base de datos.
- Checkout y gestión de pedidos con estados de producción artesanal.
- Dashboard privado para administradores y clientes.
- Comunicaciones automáticas por email en cada cambio de estado.
- Panel de configuración que permite editar contenido sin redesplegar.

---

## 🧰 2. Stack Tecnológico

Todos los datos siguientes están extraídos directamente de [`package.json`](package.json).

### Dependencias de Producción

| Paquete | Versión | Uso real en el proyecto |
|---|---|---|
| `next` | ^16.1.6 | Framework principal (App Router, RSC, Server Actions, Middleware) |
| `react` / `react-dom` | 19.2.3 | UI reactiva |
| `mysql2` | ^3.16.2 | Driver del pool de conexiones a TiDB Cloud |
| `jose` | ^6.1.3 | Firma y verificación de tokens JWT (`HS256`) |
| `bcrypt` / `bcryptjs` | ^6.0.0 / ^3.0.3 | Hash de contraseñas en registro y login |
| `nodemailer` | ^8.0.1 | Envío de emails transaccionales vía Gmail SMTP |
| `@vercel/blob` | ^2.2.0 | Subida y lectura de imágenes, vídeos y diseños IA |
| `@vercel/speed-insights` | ^1.3.1 | Monitorización de rendimiento en producción |
| `@google/genai` | ^1.50.1 | Integración con Gemini API (generación de diseños) |
| `framer-motion` | ^12.27.1 | Animaciones declarativas y transiciones de página |
| `gsap` / `@gsap/react` | ^3.14.2 / ^2.1.2 | Animaciones de alto rendimiento (Hero, scroll) |
| `lenis` | ^1.3.17 | Scroll suave aplicado a nivel global |
| `three` / `@react-three/fiber` / `@react-three/drei` | ^0.182 / ^9.5 / ^10.7.7 | Renderizado 3D |
| `react-hook-form` | ^7.73.1 | Gestión de formularios |
| `@hookform/resolvers` / `zod` | ^5.2.2 / ^4.3.6 | Validación de esquemas en formularios |
| `react-icons` | ^5.5.0 | Iconografía |
| `react-router-dom` | ^7.13.0 | Routing adicional en ciertas vistas cliente |

### DevDependencies

| Paquete | Versión |
|---|---|
| `eslint` | ^9 |
| `eslint-config-next` | 16.1.2 |

---

## 🏗️ 3. Arquitectura del Sistema

### App Router de Next.js

El proyecto usa el **App Router** de Next.js 16 con cuatro Route Groups principales:

```
app/
├── (main)/        # Zona pública: Home, Tienda, Categorías, Sobre Nosotros, Contacto, FAQ, Legal, Personalizar
├── (shop)/        # Flujo de tienda (integrado en la navegación)
├── (auth)/        # Login y registro (flujo unificado)
├── (dashboard)/   # Área privada
│   └── dashboard/
│       ├── (admin)/admin/     # Panel de administración
│       └── (customer)/        # Panel del cliente
├── api/           # Endpoints REST
└── crear-diseno/  # Generador IA (público)
```

### Server Components y Rendering

- **Server Components**: La Home Page (`page.jsx`) llama en paralelo a `getRandomProducts(7)`, `getRandomReviews(3)` y `getConfigValues(...)` antes de renderizar, enviando HTML listo al cliente.
- **Server Actions**: Centralizadas en `src/lib/actions.js`. Gestionan tickets, devoluciones, reseñas, pedidos, subida de imágenes de perfil y assets de tienda.
- **Middleware (Edge Runtime)**: `src/middleware.js` valida el JWT de la cookie `session_token` y comprueba el rol antes de que la petición llegue al servidor.

### Gestión de Estado

- **CartContext** (`src/context/CartContext.jsx`): Estado global del carrito sincronizado con la BBDD.
- **NotificationListener** (`src/components/dashboard/NotificationListener/`): Componente global que escucha notificaciones del usuario.

---

## 🤖 4. Laboratorio de IA (Rug Lab)

El **Rug Lab** (ruta `/crear-diseno` y `/api/generate`) permite convertir cualquier imagen en un patrón vectorial apto para tufting, usando **Gemini 2.5 Flash** (`gemini-2.5-flash-image`) de Google.

### Flujo real (extraído de `src/app/api/generate/route.js`)

```
1. Usuario sube una imagen + prompt opcional
2. El endpoint verifica sesión (JWT)
3. Consulta en BBDD los créditos semanales del usuario (ai_credits_used / ai_credits_reset_at)
4. Si el ciclo semanal ha expirado (≥7 días), resetea los créditos a 0
5. Si el usuario tiene créditos disponibles (límite: AI_WEEKLY_LIMIT, default 5/semana):
   - Convierte la imagen a base64
   - Envía a Gemini con el prompt fijo + influencia del usuario
   - Recibe la imagen generada en base64
   - Incrementa ai_credits_used en 1
   - Devuelve la imagen al cliente
6. Si no tiene créditos: HTTP 429
```

### Prompt de generación (hardcoded)

```
Vector-style tufting pattern blueprint of the input image.
- NO GRADIENTS OR SHADOWS: hard-edged color transitions
- PALETTE: Max 8-10 flat, solid colors
- LINES: Thick, clean black outlines between color zones
- ESTHETIC: Clean vector illustration / blueprint look
User influence: [prompt del usuario o "minimalist, street art style"]
```

---

## 📊 5. Base de Datos y Tablas

### Configuración de la conexión (`src/lib/db.js`)

```js
mysql.createPool({
  host: process.env.DB_HOST,       // gateway01.eu-central-1.prod.aws.tidbcloud.com
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // hyggeDB
  connectionLimit: 10,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }, // Solo en producción
  timezone: 'Z'
})
```

TiDB Cloud Serverless (región EU Central — AWS), compatible con MySQL. SSL activado automáticamente cuando `DB_HOST !== 'localhost'`.

### Tablas reales (deducidas de las queries del código)

| Tabla | Campos clave conocidos | Uso |
|---|---|---|
| `users` | `user_id`, `nickname`, `email`, `profile_image`, `hygge_points`, `creation_date`, `rol`, `ai_credits_used`, `ai_credits_reset_at`, `auth_provider` | Perfiles, roles, créditos IA |
| `products` | `product_id`, `name`, `description`, `base_price`, `image_url`, `category_id`, `creator_id`, `public`, `community` | Catálogo de alfombras |
| `categories` | `category_id`, `name` | Clasificación de productos |
| `product_sizes` | `product_size_id`, `product_id`, `size`, `price`, `active` | Variantes de tamaño y precio |
| `orders` | `order_id`, `user_id`, `address_id`, `total_amount`, `payment_id`, `payment_method`, `order_status`, `creation_date`, `updated_date` | Cabecera de pedidos |
| `order_product` | `order_product_id`, `order_id`, `product_id`, `product_size_id`, `price`, `quantity`, `user_image`, `final_design` | Líneas de pedido |
| `userAddresses` | `address_id`, `user_id`, `calle`, `portal_piso_puerta`, `ciudad`, `provincia`, `codigo_postal`, `pais`, `phone_number` | Direcciones de envío |
| `order_returns` | `return_id`, `user_id`, `order_id`, `reason`, `status`, `creation_date` | Solicitudes de devolución |
| `product_reviews` | `review_id`, `user_id`, `product_id`, `order_id`, `rating`, `comment`, `creation_date` | Valoraciones de productos |
| `config` | `config_key`, `config_value` | Variables de contenido editables desde el admin |

> Las tablas `discounts`, `wishlist`, `notifications` y `support_tickets` tienen sus módulos en `src/lib/db/` pero no están completamente auditadas en esta documentación.

### Estados válidos de un pedido

Extraídos directamente de `src/lib/db/orders.js`:

```
en_carrito → diseñando → pendiente de aprobación → comprobando pago → tejiendo → enviado → recibido
```

El estado `en_carrito` corresponde a artículos aún no confirmados. Los pedidos reales son todos los que **no** están en `en_carrito`.

---

## ⚙️ 6. Config Engine — Configuración Dinámica

La tabla `config` almacena variables de contenido que el administrador puede editar desde el panel sin necesidad de redesplegar la aplicación.

### Helpers reales (`src/lib/db/config.js`)

```js
// Lectura de una sola clave
getConfigValue('social_instagram')  // → string | null

// Lectura de múltiples claves en una sola query SQL
getConfigValues(['social_instagram', 'social_tiktok', 'contact_email'])
// → { social_instagram: '...', social_tiktok: '...', contact_email: '...' }
```

### Claves usadas en el código (verificadas)

| Clave | Usado en |
|---|---|
| `tiktok_video_url` | Home Page (`page.jsx`) → `InfoSection` |
| `tiktok_handle` | Home Page (`page.jsx`) → `InfoSection` |
| `social_tiktok` | Home Page, Mailer de bienvenida |
| `social_instagram` | Mailer de bienvenida |
| `contact_email` | Mailer de bienvenida |

---

## 🔐 7. Autenticación y Seguridad

### JWT con `jose` (`src/lib/auth.js`)

- **Algoritmo**: `HS256`
- **Expiración del token**: `7d` (7 días)
- **Almacenamiento**: Cookie llamada `session_token`
- **Clave**: `process.env.JWT_SECRET` codificada con `TextEncoder`

### Payload del token (función `buildSessionPayload`)

```js
{
  userId:       user.user_id,
  nickname:     user.nickname,
  profileImage: user.profile_image,
  email:        user.email,
  role:         user.rol,           // 'admin' | 'customer'
  hyggePoints:  user.hygge_points,
  authProvider: user.auth_provider
}
```

### Flujo de sesión

```
Login con credenciales
     ↓
bcrypt.compare(password, hash)
     ↓
createSession(payload) → JWT firmado (HS256, 7d)
     ↓
Cookie 'session_token' (HttpOnly)
     ↓
Middleware Edge: jwtVerify → comprueba rol → permite o redirige
```

### Protección de campos actualizables (`actions.js`)

Solo se permiten actualizar los campos `nickname`, `email` y `profile_image`. Cualquier otro campo es ignorado por validación en lista blanca.

### Restricciones de la API

- Todos los endpoints de `/api/admin/*` verifican `session.role !== 'admin'` y devuelven `401` si no se cumple.
- La actualización de estado de pedidos nunca puede afectar al estado `en_carrito` (protegido en la query SQL).
- Los estados válidos están hardcoded en el array `VALID_STATUSES` tanto en la API como en la capa de datos.

### Google OAuth

El proyecto incluye variables para **Google OAuth** (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`). La ruta de callback es `/api/auth/google/callback`.

---

## 🎨 8. Sistema de Diseño

### Enfoque visual

- **Tema oscuro**: `color-scheme: dark` definido en `:root`.
- **Fondo global**: Color `#000000` con textura de ruido SVG (opacidad `0.03`) aplicada como `background-image` inline en el `body`.
- **Efecto persistente entre páginas**: `SilkBackground` y `GlobalBackgroundText` se renderizan en el `RootLayout`, nunca se interrumpen al navegar.
- **Scroll suave**: Lenis, a nivel de raíz.
- **CSS Modules**: Cada componente tiene su propio `.module.css` para encapsulamiento total.

### Fondo del `body` (real, de `globals.css`)

```css
background-color: #000;
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' ...fractalNoise... opacity='0.03'/%3E%3C/svg%3E");
```

---

## 🛠️ 9. Guía de Instalación

### Requisitos previos

- **Node.js** 18 o superior
- Acceso a una instancia de **TiDB Cloud** (o MySQL compatible)
- Cuenta en **Vercel** con Blob Storage activo
- Cuenta de **Gmail** con una App Password generada
- Clave de API de **Google AI Studio** (para el Rug Lab)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Danyx-git/HyggeRug.git
cd HyggeRug

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env   # o crear .env manualmente

# 4. Arrancar el servidor de desarrollo
npm run dev            # http://localhost:3000
```

### Scripts disponibles (`package.json`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción optimizado |
| `npm run start` | Servidor en modo producción |
| `npm run lint` | Análisis estático con ESLint |

---

## 🔑 10. Variables de Entorno

El archivo `.env` real del proyecto usa las siguientes claves. **Nunca subas este archivo a Git.**

```env
# ── Base de Datos (TiDB Cloud) ──────────────────────────────────────
DB_HOST=<host-de-tidb>
DB_USER=<usuario>
DB_PASSWORD=<contraseña>
DB_NAME=hyggeDB

# ── Autenticación ────────────────────────────────────────────────────
JWT_SECRET=<clave-larga-y-secreta>

# ── Google OAuth ─────────────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# ── Almacenamiento (Vercel Blob) ─────────────────────────────────────
BLOB_READ_WRITE_TOKEN=<token-de-vercel-blob>

# ── Email (Gmail SMTP) ───────────────────────────────────────────────
EMAIL_USER=<cuenta@gmail.com>
EMAIL_PASS=<app-password-de-gmail>

# ── Inteligencia Artificial (Google AI) ─────────────────────────────
GOOGLE_API_KEY=<clave-de-google-ai-studio>
AI_WEEKLY_LIMIT=5    # Número máximo de generaciones por usuario por semana
```

> **Nota sobre `EMAIL_FROM`**: El mailer de bienvenida usa `process.env.EMAIL_FROM` en el campo `from`. Asegúrate de definirla en producción aunque no aparezca en el `.env` local.

---

## 📦 11. Gestión de Pedidos

### Estados del pipeline (en orden)

| Estado | Significado |
|---|---|
| `en_carrito` | Artículos añadidos pero no confirmados. No son pedidos reales. |
| `diseñando` | Pedido confirmado, en fase de diseño previo al tufting |
| `pendiente de aprobación` | El diseño espera validación |
| `comprobando pago` | Verificación del pago |
| `tejiendo` | El pedido ha entrado físicamente en el bastidor de tufting |
| `enviado` | Producto enviado al cliente |
| `recibido` | Cliente ha confirmado la recepción |

Cambiar el estado se hace mediante `PUT /api/admin/orders/[id]`. El estado `en_carrito` nunca puede ser asignado manualmente por el admin: la query SQL lo protege con `AND order_status != 'en_carrito'`.

### Transacción atómica al crear pedido (`src/lib/db/orders.js`)

La creación de un pedido usa `beginTransaction` / `commit` / `rollback`. Si falla al insertar cualquier línea de `order_product`, todo el pedido se deshace automáticamente para evitar datos inconsistentes.

### Devoluciones (`order_returns`)

Estado inicial siempre: `pendiente`. El admin puede actualizar a través del panel de devoluciones.

---

## 🔧 12. Server Actions

Definidas en `src/lib/actions.js` con la directiva `'use server'`. Todas verifican sesión activa antes de ejecutar.

| Función | Descripción |
|---|---|
| `createSupportTicket(ticketData)` | Crea un ticket de soporte. Invalida el caché de `/dashboard/ayuda`. |
| `requestReturnAction(returnData)` | Crea una solicitud de devolución. Invalida `/dashboard/devoluciones`. |
| `createReviewAction(reviewData)` | Crea una valoración de producto. |
| `getUserOrdersAction()` | Devuelve los pedidos del usuario autenticado (excluye `en_carrito`). |
| `uploadProfileImage(formData)` | Sube imagen a Vercel Blob (`avatars/user_<id>_<timestamp>_<name>`), límite 2 MB. Actualiza `profile_image` en `users`. |
| `uploadStoreAsset(formData)` | Solo admin. Sube vídeos o banners a Vercel Blob, límite 20 MB. |
| `getLatestOrderAction()` | Devuelve el pedido más reciente del usuario (excluyendo carritos). |
| `updateUserData(field, value)` | Actualiza un campo del usuario. Solo permite: `nickname`, `email`, `profile_image`. |

---

## 🔌 13. API Endpoints

Todos los endpoints están bajo `src/app/api/`. Los prefijados con `/admin/` requieren `rol = 'admin'` en el JWT.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/...` | Login, registro y OAuth de Google |

### IA

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/generate` | Genera una imagen de patrón de alfombra con Gemini 2.5 Flash. Requiere sesión. Sujeto a límite semanal (`AI_WEEKLY_LIMIT`). |
| `POST` | `/api/generate/adjusted-image` | Subendpoint del Rug Lab (ajuste de imagen generada) |

### Pedidos (cliente y admin)

| Método | Ruta | Descripción |
|---|---|---|
| `GET/POST` | `/api/orders` | Pedidos del usuario autenticado / crear pedido |
| `GET/PUT` | `/api/admin/orders` | Listado de todos los pedidos (admin) |
| `PUT` | `/api/admin/orders/[id]` | Cambia el estado de un pedido. Valida contra `VALID_STATUSES`. |

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/api/admin/products` | CRUD completo de productos (admin) |
| `GET` | `/api/products` | Catálogo público |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| `GET/PUT` | `/api/user` | Perfil del usuario autenticado |
| `GET` | `/api/admin/users` | Listado de usuarios (admin) |

### Otros endpoints existentes

| Ruta | Descripción |
|---|---|
| `/api/cart` | Carrito sincronizado con BBDD |
| `/api/reviews` | Valoraciones de productos |
| `/api/returns` | Solicitudes de devolución |
| `/api/addresses` | Direcciones de envío |
| `/api/wishlist` | Lista de deseos |
| `/api/discounts` | Validación de códigos de descuento |
| `/api/notifications` | Notificaciones del usuario |
| `/api/contact` | Formulario de contacto (envía email al taller) |
| `/api/support` | Tickets de soporte |
| `/api/studio` | Endpoints del Rug Lab personalizado |
| `/api/admin/config` | CRUD de la tabla `config` |
| `/api/admin/upload` | Subida de assets a Vercel Blob |
| `/api/admin/support` | Gestión de tickets (admin) |

---

## 📧 14. Servicio de Email (Mailer)

El módulo `src/lib/mailer.js` usa **nodemailer** con transporte Gmail SMTP. Hay dos funciones exportadas:

### `sendWelcomeEmail(toEmail, nickname)`

Se llama al registrarse un nuevo usuario. El correo incluye:

- Encabezado con el logo textual de la marca (fondo `#FF0055`).
- Escaparate dinámico con los 2 últimos productos de la BBDD.
- Banner de bienvenida con acceso al dashboard.
- Links a Instagram y TikTok obtenidos de la tabla `config` (claves `social_instagram`, `social_tiktok`).
- Footer legal con la dirección `hyggerug.com`.

Asunto: `¡Tus suelos nos han pedido tu número, {nickname}!`

### `sendContactEmail({ name, email, subject, message })`

Se llama desde el formulario de contacto. Envía un email al buzón interno del taller con los datos del mensaje. El campo `replyTo` se configura con el email del visitante.

Asunto: `[CONTACTO] {subject} - {name}`

---

## 🛠️ 15. Infraestructura y Despliegue

### Vercel (CI/CD)

- Despliegue continuo desde la rama `main` de GitHub.
- Variables de entorno configuradas en el panel de Vercel (no en el repositorio).
- `removeConsole: true` en producción (configurado en `next.config.mjs`).

### Optimización de imágenes (`next.config.mjs`)

```js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  qualities: [75, 85],
  remotePatterns: [
    'lh3.googleusercontent.com',            // Fotos de perfil de Google OAuth
    'hebbkx1anhila5yf.public.blob.vercel-storage.com',  // Blob antiguo
    'zvo29a5tvgqtzhct.public.blob.vercel-storage.com',  // Blob actual (producción)
  ]
}
```

### Server Actions (límite de tamaño)

```js
experimental: {
  serverActions: { bodySizeLimit: '2mb' }
}
```

### TiDB Cloud Serverless

- Región: `eu-central-1` (AWS, Europa Central).
- SSL obligatorio en producción (`TLSv1.2`, `rejectUnauthorized: true`).
- Pool de 10 conexiones máximas con `waitForConnections: true`.
- `timezone: 'Z'` (UTC) para consistencia de fechas.

---

## 📁 16. Estructura de Directorios

```
HyggeRug/
├── public/
│   ├── fonts/
│   │   ├── Rubik-VariableFont_wght.ttf
│   │   ├── Rubik-Italic-VariableFont_wght.ttf
│   │   └── RubikBubbles-Regular.ttf
│   └── Hygge_logo.png
│
├── src/
│   ├── app/
│   │   ├── layout.js                  # RootLayout: fuentes, metadata global, CartProvider, SpeedInsights
│   │   ├── globals.css                # Tokens CSS, reset, scrollbar, selección de texto
│   │   │
│   │   ├── (main)/                    # Zona pública
│   │   │   ├── page.jsx               # Home: HeroSection + MarqueeStrip + FeaturedDrops + InfoSection
│   │   │   ├── tienda/                # Catálogo
│   │   │   ├── categorias/
│   │   │   ├── personalizar/
│   │   │   ├── sobre-nosotros/
│   │   │   ├── contacto/
│   │   │   ├── preguntas-frecuentes/
│   │   │   └── legal/
│   │   │
│   │   ├── (shop)/                    # Flujo de compra
│   │   │
│   │   ├── (auth)/                    # Login y registro
│   │   │
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── (admin)/admin/
│   │   │       │   ├── page.jsx       # Overview del admin
│   │   │       │   ├── pedidos/
│   │   │       │   ├── productos/
│   │   │       │   ├── usuarios/
│   │   │       │   ├── devoluciones/
│   │   │       │   ├── soporte/
│   │   │       │   ├── valoraciones/
│   │   │       │   └── ajustes/       # Config Engine
│   │   │       └── (customer)/
│   │   │           ├── resumen/
│   │   │           ├── pedidos/
│   │   │           ├── devoluciones/
│   │   │           ├── direcciones/
│   │   │           ├── deseos/
│   │   │           ├── cuenta/
│   │   │           ├── pagos/
│   │   │           ├── alertas/
│   │   │           └── ayuda/
│   │   │
│   │   ├── crear-diseno/              # Rug Lab (generador IA)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       ├── generate/
│   │       │   └── adjusted-image/
│   │       ├── orders/
│   │       ├── products/
│   │       ├── cart/
│   │       ├── reviews/
│   │       ├── returns/
│   │       ├── addresses/
│   │       ├── wishlist/
│   │       ├── discounts/
│   │       ├── notifications/
│   │       ├── contact/
│   │       ├── support/
│   │       ├── studio/
│   │       ├── user/
│   │       └── admin/
│   │           ├── orders/[id]/
│   │           ├── products/
│   │           ├── users/
│   │           ├── config/
│   │           ├── support/
│   │           └── upload/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── MobileMenu/
│   │   │   ├── Sidebar/
│   │   │   ├── SilkBackground/        # Textura de fondo persistente (Canvas)
│   │   │   ├── KineticBackground/
│   │   │   └── GlobalBackgroundText/  # Texto decorativo flotante global
│   │   ├── sections/
│   │   │   ├── HeroSection/
│   │   │   ├── MarqueeStrip/
│   │   │   ├── FeaturedDrops/
│   │   │   ├── InfoSection/           # Testimonials + vídeo TikTok
│   │   │   ├── AboutUs/
│   │   │   ├── AboutUsView/
│   │   │   ├── Contact/
│   │   │   ├── CustomOrder/
│   │   │   ├── FAQ/
│   │   │   ├── Shop/
│   │   │   └── Studio/
│   │   ├── dashboard/
│   │   │   ├── DashboardNav.jsx       # Navegación del panel privado
│   │   │   ├── DashboardHeader/
│   │   │   ├── NotificationListener/
│   │   │   ├── OrderDetail/
│   │   │   ├── OrdersHistory/
│   │   │   ├── SupportDashboard/
│   │   │   ├── SupportWizard/
│   │   │   ├── UserDetails/
│   │   │   ├── addresses/
│   │   │   └── admin/
│   │   ├── auth/
│   │   ├── store/
│   │   └── ui/
│   │       ├── Banners/
│   │       ├── Breadcrumbs/
│   │       ├── Buttons/
│   │       ├── Cards/
│   │       ├── Carousel/
│   │       ├── Containers/
│   │       ├── CuteMessage/
│   │       ├── EditableInfo/
│   │       ├── Feedback/
│   │       ├── FunnyNotification/     # Notificación animada en la Home
│   │       ├── Inputs/
│   │       ├── Legal/
│   │       ├── Logo/
│   │       ├── Marquee/
│   │       ├── Modal/
│   │       ├── ScrollHint/
│   │       ├── SectionHeader/
│   │       ├── SplitText/
│   │       ├── Timeline/
│   │       ├── Titles/
│   │       └── WeatherWidget/
│   │
│   ├── lib/
│   │   ├── db.js                      # Pool de conexiones mysql2 a TiDB
│   │   ├── auth.js                    # JWT (createSession, verifySession, getSession, buildSessionPayload)
│   │   ├── mailer.js                  # sendWelcomeEmail, sendContactEmail
│   │   ├── actions.js                 # Server Actions globales
│   │   ├── url.js                     # sanitizeHref (validación de URLs)
│   │   └── db/
│   │       ├── products.js            # getProducts, getRandomProducts, CRUD admin, getProductWithSizes
│   │       ├── orders.js              # createOrder, getOrdersByUser, getCartByUser, getOrderById, updateOrderStatus
│   │       ├── users.js               # getUserById, updateProfile
│   │       ├── config.js              # getConfigValue, getConfigValues
│   │       ├── reviews.js             # getReviewsByProduct, createReview, getAllReviews, deleteReview, getRandomReviews
│   │       ├── returns.js             # getReturnsByUser, createReturn, getAllReturns, updateReturnStatus
│   │       ├── addresses.js
│   │       ├── discounts.js
│   │       ├── support.js             # createTicket
│   │       └── wishlist.js
│   │
│   ├── context/
│   │   └── CartContext.jsx
│   │
│   └── hooks/
│       └── useIsTouchDevice.js        # Detecta si el dispositivo es táctil
│
├── .env                               # Variables de entorno (NO subir a Git)
├── .gitignore
├── next.config.mjs                    # Imágenes, compiler, experimental serverActions
├── jsconfig.json                      # Alias @/ → src/
├── eslint.config.mjs
└── package.json
```

---

## 🧱 17. Componentes

### Layout (`src/components/layout/`)

| Componente | Descripción |
|---|---|
| `Header` | Navegación global. Links sociales y de contenido obtenidos de la tabla `config`. |
| `Footer` | Links sociales y legales. Consume config dinámico. |
| `MobileMenu` | Menú lateral para dispositivos táctiles. |
| `Sidebar` | Navegación del dashboard privado. |
| `SilkBackground` | Textura de fondo oscura persistente renderizada en Canvas. |
| `GlobalBackgroundText` | Texto decorativo flotante de fondo. Se renderiza en el `RootLayout`. |
| `KineticBackground` | Fondo cinético para secciones concretas. |

### Secciones de la Home (`src/components/sections/`)

| Componente | Props recibidas |
|---|---|
| `HeroSection` | `customCards` — array de productos aleatorios de la BBDD |
| `MarqueeStrip` | Sin props |
| `FeaturedDrops` | Sin props |
| `InfoSection` | `testimonials`, `videoUrl`, `tiktokHandle`, `tiktokUrl` — todos de la BBDD |
| `FunnyNotification` | `products` — array de productos para la animación |

### UI Atoms (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `Buttons/` | Botones reutilizables del design system |
| `Inputs/` | Campos de formulario |
| `Feedback/` | Sistema de mensajes de éxito/error/carga |
| `Modal/` | Modal reutilizable |
| `Cards/` | Tarjetas de producto y contenido |
| `FunnyNotification/` | Notificación animada en la Home con productos reales |
| `WeatherWidget/` | Widget de condiciones meteorológicas |
| `Carousel/` | Carrusel de imágenes |
| `Timeline/` | Componente de línea de tiempo |
| `SplitText/` | Texto animado carácter a carácter |
| `Marquee/` | Texto en bucle animado |

### Dashboard (`src/components/dashboard/`)

| Componente | Descripción |
|---|---|
| `DashboardNav.jsx` | Navegación lateral del área privada |
| `NotificationListener/` | Polling de notificaciones del usuario |
| `OrderDetail/` | Vista detallada de un pedido con artículos |
| `OrdersHistory/` | Historial de pedidos del cliente |
| `SupportDashboard/` | Lista de tickets del cliente |
| `SupportWizard/` | Wizard para crear tickets |
| `UserDetails/` | Detalles del perfil en el admin |
| `addresses/` | Gestión de direcciones de envío |
| `admin/` | Componentes específicos del panel de administración |

---

## 🗄️ 18. Capas de Base de Datos (`src/lib/db/`)

Cada módulo agrupa exclusivamente las queries SQL de su dominio:

| Módulo | Funciones exportadas |
|---|---|
| `products.js` | `getProducts`, `getRandomProducts`, `getAdminProducts`, `getAdminProductById`, `createProduct`, `updateProduct`, `deleteProduct`, `addProductSize`, `updateProductSize`, `toggleProductSizeActive`, `getCategories`, `getProductWithSizes` |
| `orders.js` | `createOrder` (transaccional), `getOrdersByUser`, `getCartByUser`, `getOrderById`, `updateOrderStatus` |
| `users.js` | `getUserById`, `updateProfile` |
| `config.js` | `getConfigValue`, `getConfigValues` |
| `reviews.js` | `getReviewsByProduct`, `createReview`, `getAllReviews`, `deleteReview`, `getRandomReviews` |
| `returns.js` | `getReturnsByUser`, `createReturn`, `getAllReturns`, `updateReturnStatus` |
| `support.js` | `createTicket` |
| `addresses.js` | Gestión de direcciones |
| `discounts.js` | Validación y uso de códigos de descuento |
| `wishlist.js` | Lista de deseos |

---

## 🎨 19. Tipografías y Tokens CSS

### Fuentes (cargadas en `RootLayout` con `next/font`)

| Variable CSS | Fuente | Formato | Uso |
|---|---|---|---|
| `--font-rubik` | Rubik Variable | Local (`.ttf`, normal + italic) | Cuerpo de texto global (`--font-body`) |
| `--font-rubik-bubbles` | Rubik Bubbles Regular | Local (`.ttf`) | Títulos `h1`–`h6` (`--font-titles`) |
| `--font-plus-jakarta` | Plus Jakarta Sans | Google Fonts | Textos técnicos y dashboards |

### Tokens de color reales (de `globals.css`)

| Variable | Valor | Descripción |
|---|---|---|
| `--primary-bg` | `#000000` | Fondo principal |
| `--secondary-bg` | `#0a0a0a` | Fondo secundario |
| `--card-bg` | `#111111` | Fondo de tarjetas |
| `--footer-bg` | `#050505` | Fondo del footer |
| `--primary-text` | `#ffffff` | Texto principal |
| `--secondary-text` | `#dddddd` | Texto secundario |
| `--highlight-text` | `#FF0055` | Color de acento principal (rosa-rojo) |
| `--hover-text` | `#FFD701` | Color de hover (amarillo) |
| `--accent-purple` | `#6C5DD3` | Acento morado (IA, elementos creativos) |
| `--accent-cyan` | `#00F0FF` | Acento cian |

### Sombras

| Variable | Valor |
|---|---|
| `--tuft-shadow` | `0 10px 40px -5px rgba(0,0,0,0.8)` |
| `--pop-shadow` | `5px 5px 0px rgba(0,0,0,1)` |

---

## ♿ 20. Accesibilidad

- `lang="es"` en la etiqueta `<html>` raíz para lectores de pantalla.
- Uso de elementos HTML5 semánticos: `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`.
- Todos los botones de icono del dashboard incluyen atributos `aria-label`.
- Contraste diseñado para cumplir ratios mínimos WCAG AA en interfaces oscuras.
- Fuentes cargadas con `display: swap` para evitar FOIT (Flash of Invisible Text).

---

## 🔄 21. Control de Versiones

- Repositorio en GitHub.
- Rama principal: `main` (conectada al CI/CD de Vercel).
- Commits en español, describiendo la funcionalidad añadida y la razón del cambio.
- Cambios organizados por bloques lógicos: UI, Backend, Config, DB.

---

<div align="center">

---

© 2026 **Hygge Rug** · Daniel Medina Rodas & Hector Castro Cascales
Madrid, España · Handmade with Attitude.

</div>
