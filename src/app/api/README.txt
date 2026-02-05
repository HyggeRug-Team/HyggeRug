API ROUTES - Backend de Next.js

Estas son las rutas del backend (serverless functions)

auth/
  login/route.js - POST /api/auth/login
  register/route.js - POST /api/auth/register
  logout/route.js - POST /api/auth/logout
  session/route.js - GET /api/auth/session

products/
  route.js - GET /api/products (listar), POST /api/products (crear)
  [id]/route.js - GET/PUT/DELETE /api/products/:id
  featured/route.js - GET productos destacados
  search/route.js - GET búsqueda de productos

categories/
  route.js - GET/POST /api/categories
  [id]/route.js - GET/PUT/DELETE /api/categories/:id

cart/
  route.js - GET/POST /api/cart
  [itemId]/route.js - PUT/DELETE /api/cart/:itemId

orders/
  route.js - GET/POST /api/orders
  [id]/route.js - GET/PUT /api/orders/:id

reviews/
  route.js - GET/POST /api/reviews
  product/[productId]/route.js - GET reseñas de un producto
  [id]/route.js - PUT/DELETE /api/reviews/:id

users/
  [id]/route.js - GET/PUT/DELETE /api/users/:id
  addresses/route.js - GET/POST direcciones

upload/route.js - POST subida de imágenes
webhook/route.js - Webhooks de Stripe
