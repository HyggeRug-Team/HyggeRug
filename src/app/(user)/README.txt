PÁGINAS - ÁREA DE USUARIO (user)

Páginas protegidas que requieren autenticación.
Layout con sidebar de navegación del usuario.

perfil/page.jsx - Mi perfil
  - Información personal
  - Email (no editable)
  - Nombre, apellido
  - Teléfono
  - Botón "Guardar cambios"
  - Opción de cambiar contraseña
  - Opción de eliminar cuenta

pedidos/page.jsx - Lista de mis pedidos
  - Tabla/grid de pedidos
  - Número de pedido
  - Fecha
  - Total
  - Estado (pending, processing, shipped, delivered)
  - Botón "Ver detalles"
  - Filtros por estado
  - Ordenar por fecha

pedidos/[id]/page.jsx - Detalle de un pedido
  - Número de pedido
  - Estado actual
  - Fecha de pedido
  - Productos comprados
    - Imagen
    - Nombre
    - Cantidad
    - Precio
  - Dirección de envío
  - Total pagado
  - Número de tracking (si existe)
  - Botón "Cancelar pedido" (si es posible)

direcciones/page.jsx - Mis direcciones
  - Lista de direcciones guardadas
  - Cada dirección muestra:
    - Nombre
    - Calle
    - Ciudad
    - CP
    - País
    - Badge "Predeterminada"
  - Botón "Añadir nueva dirección"
  - Botón "Editar"
  - Botón "Eliminar"
  - Botón "Marcar como predeterminada"

favoritos/page.jsx - Productos favoritos
  - Grid de productos favoritos
  - Mismo diseño que ProductCard
  - Botón "Eliminar de favoritos"
  - Botón "Añadir al carrito"
  - Mensaje si no hay favoritos

layout.jsx - Layout con sidebar
  - Sidebar izquierdo con navegación:
    - Mi Perfil
    - Mis Pedidos
    - Mis Direcciones
    - Favoritos
    - Cerrar Sesión
  - Contenido principal a la derecha
  - Responsive: sidebar colapsable en móvil
