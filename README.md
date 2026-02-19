# 🧶 Hygge Rug - Estructura del Proyecto

```
src/
├── app/
│   ├── (main)/             # Zona Pública
│   │   ├── layout.jsx      # Header + Footer
│   │   ├── page.jsx        # Home
│   │   └── tienda/         # Catálogo
│   │
│   ├── (auth)/             # Zona de Autenticación
│   │   ├── auth/           # Página única Login/Registro
│   │   └── layout.jsx      # Layout minimalista (solo logo)
│   │
│   ├── api/                # Backend API Routes
│   │   └── auth/           # Endpoints de autenticación
│   │
│   ├── dashboard/          # Área privada de usuario
│   ├── globals.css         # Estilos globales
│   └── layout.js           # Layout raíz
│
├── components/             # Biblioteca de Componentes
│   ├── auth/               # AuthForm
│   ├── common/             # Logo, Mensajes
│   ├── layout/             # Header, Footer, Menu
│   ├── sections/           # Hero, Info
│   └── ui/                 # Botones, Carousel
│
├── lib/                    # Utilidades
│   ├── auth.js             # Lógica JWT
│   └── db.js               # Conexión MySQL
│
└── proxy.js                # Middleware de protección de rutas
```

# ·······················································································