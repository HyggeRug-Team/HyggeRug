import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaSortDown } from 'react-icons/fa6';
import styles from './FloatingFilterBar.module.css';

/**
 * FLOATING FILTER BAR (GENÉRICO)
 * Una barra flotante para buscar, filtrar por categorías y ordenar.
 */
const FloatingFilterBar = ({ 
    search, // { value, onChange, placeholder }
    filters, // { options, active, onSelect }
    sort // { options, active, onSelect, isOpen, onToggle }
}) => {
    
    // Obtenemos el label actual para mostrar en el dropdown
    const currentSortLabel = sort.options?.find(opt => opt.id === sort.active)?.label || 'ORDENAR';

    return (
        <div className={styles.stickyContainer}>
            <div className={styles.barInner}>
                
                {/* 1. BUSCADOR */}
                {search && (
                    <>
                        <div className={styles.searchSection}>
                            <FaMagnifyingGlass className={styles.icon} />
                            <input 
                                type="text" 
                                placeholder={search.placeholder || "Buscar..."}
                                className={styles.input}
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                            />
                        </div>
                        <div className={styles.divider} />
                    </>
                )}

                {/* 2. FILTROS (CATEGORÍAS / GRUPOS) */}
                {filters && (
                    <>
                        <div className={styles.filterSection}>
                            {filters.options.map(opt => (
                                <button 
                                    key={opt}
                                    onClick={() => filters.onSelect(opt)}
                                    className={`${styles.filterBtn} ${filters.active === opt ? styles.active : ''}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className={styles.divider} />
                    </>
                )}

                {/* 3. ORDENACIÓN (DROPDOWN) */}
                {sort && (
                    <div className={styles.sortSection} onClick={sort.onToggle}>
                        <span className={styles.sortLabel}>
                            {currentSortLabel}
                        </span>
                        <FaSortDown className={`${styles.sortIcon} ${sort.isOpen ? styles.rotated : ''}`} />
                        
                        <AnimatePresence>
                            {sort.isOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: -10, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className={styles.dropdownMenu}
                                >
                                    {sort.options.map(opt => (
                                        <button 
                                            key={opt.id}
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                sort.onSelect(opt.id);
                                            }}
                                            className={sort.active === opt.id ? styles.activeOption : ''}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingFilterBar;
