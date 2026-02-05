CONTEXTS - React Context para estado global

AuthContext.jsx - Contexto de autenticación
  - Provee el estado del usuario
  - Funciones de login/logout/register
  - Persistencia de sesión
  - Verifica autenticación en cada carga

CartContext.jsx - Contexto del carrito
  - Estado del carrito
  - Funciones para añadir/remover/actualizar
  - Sincronización con backend
  - Persistencia en localStorage

ThemeContext.jsx - Contexto del tema
  - theme (light/dark)
  - toggleTheme()
  - Persistencia de preferencia

Uso típico:
  - Envolver la app en <AuthProvider>
  - Usar useContext(AuthContext) en componentes
  - O mejor: crear custom hooks (useAuth)
