API: Productos
UBICACIÓN: src/app/api/products/route.js

TAREAS:
1. GET:
   - Recibir query params (category, minPrice, maxPrice, sort).
   - Construir query SQL dinámica.
   - Devolver JSON { products: [], total: N }.
   
2. POST (Solo admin):
   - Validar sesión admin.
   - Recibir datos del producto.
   - Insertar en DB.
