PÁGINAS - PROCESO DE COMPRA (shop)

Este grupo de rutas usa un layout minimalista sin distracciones.
Solo se centra en el proceso de compra.

carrito/page.jsx - Carrito de compras
  - Lista de productos en el carrito
  - Cantidades ajustables
  - Subtotal
  - Botón "Proceder al pago"
  - Opción de vaciar carrito

checkout/page.jsx - Paso 1: Datos de envío
  - Formulario de dirección
    - Nombre completo
    - Dirección
    - Ciudad
    - Código postal
    - País
    - Teléfono
  - Opción de guardar dirección
  - Botón "Continuar al pago"

checkout/pago/page.jsx - Paso 2: Método de pago
  - Selección de método
    - Tarjeta de crédito/débito
    - PayPal
    - Transferencia
  - Integración con Stripe
  - Resumen del pedido
  - Botón "Confirmar pedido"

checkout/confirmacion/page.jsx - Paso 3: Confirmación
  - Mensaje de éxito
  - Número de pedido
  - Resumen del pedido
  - Información de seguimiento
  - Botón "Ver mis pedidos"

layout.jsx - Layout minimalista
  - Solo logo
  - Indicador de pasos (1/3, 2/3, 3/3)
  - Sin navbar completo ni footer
