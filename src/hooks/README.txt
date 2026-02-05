CUSTOM HOOKS - Hooks reutilizables de React

useAuth.js - Hook de autenticación
  - user (objeto del usuario)
  - login(email, password)
  - logout()
  - register(userData)
  - isAuthenticated (boolean)
  - isLoading (boolean)

useCart.js - Hook del carrito
  - items (array de items)
  - addToCart(productId, quantity)
  - removeFromCart(itemId)
  - updateQuantity(itemId, quantity)
  - clearCart()
  - total (número)
  - itemCount (número)

useProducts.js - Hook de productos
  - products (array)
  - loading (boolean)
  - error (string)
  - fetchProducts(filters)
  - searchProducts(query)

useOrders.js - Hook de pedidos
  - orders (array)
  - createOrder(orderData)
  - getOrderById(id)
  - loading (boolean)

useLocalStorage.js - Hook de localStorage
  - setValue(key, value)
  - getValue(key)
  - removeValue(key)

useDebounce.js - Hook de debounce
  - Retrasa la ejecución de una función
  - Útil para búsquedas en tiempo real

useMediaQuery.js - Hook de media queries
  - isMobile (boolean)
  - isTablet (boolean)
  - isDesktop (boolean)
