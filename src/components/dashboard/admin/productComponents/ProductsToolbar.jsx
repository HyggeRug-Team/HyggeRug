/**
 * @file ProductsToolbar.jsx
 * @description Barra de herramientas con buscador y botón de creación para gestionar el catálogo.
 */
'use client';

import { FaMagnifyingGlass, FaXmark, FaPlus, FaTag } from 'react-icons/fa6';
import styles from '../AdminProductsClient/AdminProductsClient.module.css';

const VIS_LABELS = { all: 'Todos', community0: 'Sin comunidad', community1: 'Comunidad' };

export default function ProductsToolbar({
  search, onSearch,
  catFilter, onCatFilter,
  visFilter, onVisFilter,
  categories,
  onNew,
  onNewCategory,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrapper}>
        <FaMagnifyingGlass className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Buscar por nombre…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => onSearch('')}>
            <FaXmark />
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={catFilter}
          onChange={e => onCatFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.category_id} value={String(c.category_id)}>{c.name}</option>
          ))}
        </select>

        {Object.entries(VIS_LABELS).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.filterBtn} ${visFilter === val ? styles.filterActive : ''}`}
            onClick={() => onVisFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className={styles.catBtn} onClick={onNewCategory}>
        <FaTag /> Nueva categoría
      </button>

      <button className={styles.newBtn} onClick={onNew}>
        <FaPlus /> Nuevo diseño
      </button>
    </div>
  );
}
