LIB - Utilidades y configuraciones

db/mysql.js - Conexión a MySQL
  - Pool de conexiones
  - Funciones helper para queries

auth/
  jwt.js - Funciones JWT
    - Crear token
    - Verificar token
    - Decodificar token
  
  bcrypt.js - Hash de contraseñas
    - Hashear contraseña
    - Comparar contraseña

api/ - Cliente API para el frontend
  client.js - Wrapper de fetch
  auth.js - Endpoints de auth
  products.js - Endpoints de productos
  cart.js - Endpoints de carrito
  orders.js - Endpoints de pedidos
  reviews.js - Endpoints de reseñas

utils/
  formatters.js - Formatear datos
    - formatPrice(price) → "89,99 €"
    - formatDate(date) → "5 de febrero de 2026"
  
  validators.js - Validaciones
    - isValidEmail(email)
    - isValidPassword(password)
    - isValidPhone(phone)
  
  helpers.js - Funciones auxiliares
    - generateSlug(text)
    - truncateText(text, length)

constants.js - Constantes globales
  - ORDER_STATUSES
  - PAYMENT_METHODS
  - CATEGORIES
  - etc.
