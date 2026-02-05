PÁGINAS - PANEL DE ADMINISTRACIÓN (admin)

Páginas protegidas que requieren rol de administrador.
Layout con sidebar de administración.

admin/page.jsx - Dashboard principal
  - Estadísticas clave:
    - Total ventas del mes
    - Pedidos pendientes
    - Productos con stock bajo
    - Nuevos clientes
  - Gráficos de ventas
  - Últimos pedidos
  - Productos más vendidos

admin/productos/page.jsx - Gestión de productos
  - Tabla de todos los productos
  - Columnas:
    - Imagen
    - Nombre
    - Categoría
    - Precio
    - Stock
    - Estado (activo/inactivo)
    - Acciones (editar/eliminar)
  - Botón "Añadir producto"
  - Filtros por categoría
  - Búsqueda

admin/productos/nuevo/page.jsx - Crear producto
  - Formulario completo (ProductForm):
    - Nombre
    - Descripción
    - Precio
    - Precio con descuento
    - Categoría
    - Dimensiones (ancho/alto)
    - Material
    - Técnica
    - Colores
    - Stock
    - Subir imágenes (múltiples)
    - Destacado (checkbox)
    - Activo (checkbox)
  - Botón "Crear producto"

admin/productos/[id]/page.jsx - Editar producto
  - Mismo formulario que nuevo
  - Precargado con datos actuales
  - Botón "Guardar cambios"
  - Botón "Eliminar producto"

admin/pedidos/page.jsx - Gestión de pedidos
  - Tabla de todos los pedidos
  - Columnas:
    - Número de pedido
    - Cliente
    - Fecha
    - Total
    - Estado
    - Estado de pago
    - Acciones
  - Filtros por estado
  - Búsqueda por número o cliente

admin/pedidos/[id]/page.jsx - Detalle y gestión de pedido
  - Información completa del pedido
  - Cambiar estado del pedido
  - Añadir número de tracking
  - Ver información del cliente
  - Lista de productos
  - Dirección de envío
  - Botón "Imprimir factura"

admin/categorias/page.jsx - Gestión de categorías
  - Lista de categorías
  - Crear nueva categoría
  - Editar categoría
  - Eliminar categoría
  - Ordenar categorías

admin/clientes/page.jsx - Gestión de clientes
  - Tabla de usuarios
  - Información básica
  - Estadísticas por cliente
  - Pedidos realizados
  - Búsqueda

layout.jsx - Layout admin
  - Sidebar izquierdo con navegación:
    - Dashboard
    - Productos
    - Pedidos
    - Categorías
    - Clientes
    - Configuración
    - Cerrar Sesión
  - Header con notificaciones
  - Contenido principal
