DATOS - Mock data y seeds

Archivos JSON con datos de ejemplo para desarrollo y testing.

categories.json - Categorías de ejemplo
[
  {
    "id": 1,
    "name": "Modern",
    "slug": "modern",
    "description": "Alfombras de diseño moderno",
    "image": "/images/categories/modern.jpg"
  },
  ...
]

products.json - Productos de ejemplo
[
  {
    "id": 1,
    "name": "Alfombra Sunset Dreams",
    "slug": "alfombra-sunset-dreams",
    "price": 89.99,
    "category": "modern",
    "width": 120,
    "height": 80,
    "material": "Lana acrílica",
    "colors": ["#FF6B6B", "#FFA500"],
    "stock": 15,
    "images": ["/images/products/1-1.jpg", "/images/products/1-2.jpg"]
  },
  ...
]

Estos datos son útiles para:
- Desarrollo sin necesidad de base de datos
- Testing de componentes
- Previsualización de diseño
- Seeds para la base de datos real
