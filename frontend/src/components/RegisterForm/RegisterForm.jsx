'use client';

import React, { useState } from 'react';
import styles from './RegisterForm.module.css'; 
import PrimaryButton from '../PrimaryBtn/PrimaryBtn';
import { FaGoogle } from "react-icons/fa";

function RegisterForm({ onRegistroExitoso }) {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: '¡Cuenta creada! Redirigiendo...', tipo: 'success' });
        setFormData({ nickname: '', email: '', password: '' });

        if (onRegistroExitoso) {
          setTimeout(() => {
            onRegistroExitoso();
          }, 2000);
        }
      } else {
        setMensaje({ texto: data.error, tipo: 'error' });
      }
    } catch (err) {
      setMensaje({ texto: 'Error de conexión con el servidor.', tipo: 'error' });
    }
  };

  return (
    <>
      <h1>Crear cuenta</h1>
      
      <div className={styles.googleButton}>
        <PrimaryButton text={'Registrarse con Google'} url={'#'} Icon={FaGoogle} />
      </div>

      {mensaje.texto && (
        <p className={`${styles.message} ${mensaje.tipo === 'error' ? styles.error : styles.success}`}>
          {mensaje.texto}
        </p>
      )}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>
          ¿Cómo te llamamos? (Nickname):
          <input 
            type='text' 
            name='nickname' 
            value={formData.nickname} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Correo electrónico:
          <input 
            type='email' 
            name='email' 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Crea una contraseña:
          <input 
            type='password' 
            name='password' 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <button type='submit' className={styles.submitBtn}>
          Registrarme
        </button>
      </form>
    </>
  );
}

export default RegisterForm;