"use client";

import { useState } from "react";
import styles from "./AddressForm.module.css";

/**
 * Formulario para crear una nueva dirección de envío.
 * Validación manual sin librerías externas.
 *
 * @param {function} onSuccess  - Callback: recibe la nueva dirección creada para añadirla al estado del padre
 * @param {function} onClose    - Callback: cierra el modal al cancelar o tras guardar
 */
export default function AddressForm({ onSuccess, onClose }) {
  // Estado del formulario con todos los campos de una dirección
  const [form, setForm] = useState({
    calle: "",
    portal_piso_puerta: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    pais: "España",
    phone_number: "",
    is_default: false,
  });

  // Errores de validación por campo
  const [errors, setErrors] = useState({});

  // Controla el estado de envío para deshabilitar el botón mientras carga
  const [loading, setLoading] = useState(false);

  // Actualiza el campo correspondiente en el estado del formulario
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      // Los checkboxes usan checked, el resto usan value
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiamos el error del campo al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  // Valida los campos requeridos y formato del código postal
  function validate() {
    const newErrors = {};

    if (!form.calle.trim())            newErrors.calle = "La calle es obligatoria";
    if (!form.ciudad.trim())           newErrors.ciudad = "La ciudad es obligatoria";
    if (!form.provincia.trim())        newErrors.provincia = "La provincia es obligatoria";
    if (!form.pais.trim())             newErrors.pais = "El país es obligatorio";
    if (!form.phone_number.trim())     newErrors.phone_number = "El teléfono es obligatorio";

    // Código postal español: exactamente 5 dígitos
    if (!/^\d{5}$/.test(form.codigo_postal)) {
      newErrors.codigo_postal = "Código postal inválido (5 dígitos)";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Si hay errores de validación los mostramos y no enviamos
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar la dirección");

      const newAddress = await res.json();

      // Avisamos al padre con la nueva dirección para actualizar el estado local
      onSuccess(newAddress);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ general: "No se pudo guardar la dirección. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>

      {/* Error general de la API */}
      {errors.general && (
        <p className={styles.errorGeneral}>{errors.general}</p>
      )}

      {/* Calle */}
      <div className={styles.field}>
        <label className={styles.label}>Calle *</label>
        <input
          className={`${styles.input} ${errors.calle ? styles.inputError : ""}`}
          type="text"
          name="calle"
          value={form.calle}
          onChange={handleChange}
          placeholder="Ej: Calle Mayor 23"
        />
        {errors.calle && <span className={styles.error}>{errors.calle}</span>}
      </div>

      {/* Portal / Piso / Puerta */}
      <div className={styles.field}>
        <label className={styles.label}>Portal, piso, puerta</label>
        <input
          className={styles.input}
          type="text"
          name="portal_piso_puerta"
          value={form.portal_piso_puerta}
          onChange={handleChange}
          placeholder="Ej: 2º B"
        />
      </div>

      {/* Ciudad y Código postal en fila */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Ciudad *</label>
          <input
            className={`${styles.input} ${errors.ciudad ? styles.inputError : ""}`}
            type="text"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            placeholder="Ej: Madrid"
          />
          {errors.ciudad && <span className={styles.error}>{errors.ciudad}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Código postal *</label>
          <input
            className={`${styles.input} ${errors.codigo_postal ? styles.inputError : ""}`}
            type="text"
            name="codigo_postal"
            value={form.codigo_postal}
            onChange={handleChange}
            placeholder="Ej: 28001"
            maxLength={5}
          />
          {errors.codigo_postal && <span className={styles.error}>{errors.codigo_postal}</span>}
        </div>
      </div>

      {/* Provincia y País en fila */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Provincia *</label>
          <input
            className={`${styles.input} ${errors.provincia ? styles.inputError : ""}`}
            type="text"
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            placeholder="Ej: Madrid"
          />
          {errors.provincia && <span className={styles.error}>{errors.provincia}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>País *</label>
          <input
            className={`${styles.input} ${errors.pais ? styles.inputError : ""}`}
            type="text"
            name="pais"
            value={form.pais}
            onChange={handleChange}
            placeholder="Ej: España"
          />
          {errors.pais && <span className={styles.error}>{errors.pais}</span>}
        </div>
      </div>

      {/* Teléfono */}
      <div className={styles.field}>
        <label className={styles.label}>Teléfono de contacto *</label>
        <input
          className={`${styles.input} ${errors.phone_number ? styles.inputError : ""}`}
          type="tel"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Ej: 612 345 678"
        />
        {errors.phone_number && <span className={styles.error}>{errors.phone_number}</span>}
      </div>

      {/* Checkbox predeterminada */}
      <div className={styles.checkboxField}>
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className={styles.checkbox}
        />
        <label htmlFor="is_default" className={styles.checkboxLabel}>
          Establecer como dirección predeterminada
        </label>
      </div>

      {/* Acciones */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? "Guardando..." : "GUARDAR DIRECCIÓN"}
        </button>
      </div>

    </form>
  );
}