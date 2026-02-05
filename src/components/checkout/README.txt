COMPONENTES DE CHECKOUT - Proceso de compra

ShippingForm/ - Formulario de dirección de envío
  - Nombre completo
  - Dirección
  - Ciudad
  - Código postal
  - País
  - Teléfono
  - Opción de guardar dirección

PaymentForm/ - Formulario de pago
  - Método de pago (tarjeta/PayPal/transferencia)
  - Campos de tarjeta (si aplica)
  - Integración con Stripe

OrderSummary/ - Resumen del pedido
  - Productos
  - Cantidades
  - Dirección de envío
  - Total a pagar

StepIndicator/ - Indicador de pasos
  - Paso 1: Carrito
  - Paso 2: Envío
  - Paso 3: Pago
  - Paso 4: Confirmación
  - Indicador visual del paso actual
