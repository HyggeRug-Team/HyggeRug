SCRIPTS - Scripts de utilidad

Scripts auxiliares para tareas comunes del proyecto.

seed-database.js - Poblar base de datos
  - Lee los archivos de src/data/
  - Inserta categorías
  - Inserta productos de ejemplo
  - Crea usuarios de prueba
  
  Uso:
  node scripts/seed-database.js

generate-slugs.js - Generar slugs (opcional)
  - Actualiza productos sin slug
  - Genera slugs a partir de nombres
  
  Uso:
  node scripts/generate-slugs.js

backup-database.js - Backup de BD (opcional)
  - Exporta la base de datos
  - Guarda en carpeta backups/
  
  Uso:
  node scripts/backup-database.js

clear-sessions.js - Limpiar sesiones (opcional)
  - Elimina sesiones expiradas
  - Limpia carritos abandonados
  
  Uso:
  node scripts/clear-sessions.js

Todos los scripts deben:
- Usar ES modules (import/export)
- Tener manejo de errores
- Mostrar progreso en consola
- Documentar su uso
