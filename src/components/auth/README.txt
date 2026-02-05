COMPONENTES DE AUTENTICACIÓN

LoginForm/ - Formulario de login
  - Campo email
  - Campo contraseña
  - Checkbox "Recordarme"
  - Botón "Iniciar sesión"
  - Link "¿Olvidaste tu contraseña?"
  - Link "Crear cuenta"

RegisterForm/ - Formulario de registro
  - Nombre
  - Apellido
  - Email
  - Contraseña
  - Confirmar contraseña
  - Checkbox aceptar términos
  - Botón "Registrarse"
  - Link "Ya tengo cuenta"

ProtectedRoute/ - HOC para proteger rutas
  - Verifica si el usuario está autenticado
  - Redirige a /login si no lo está
  - Permite acceso si está autenticado
