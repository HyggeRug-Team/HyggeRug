'use client'; // 1. Obligatorio para usar estados y eventos

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirigir al dashboard
import styles from './LoginForm.module.css';
import PrimaryButton from '../PrimaryBtn/PrimaryBtn';
import { FaGoogle } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  
  // 2. Definimos los "cubos" donde guardaremos lo que el usuario escribe
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // 3. Función para actualizar los cubos cada vez que el usuario teclea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. La función que se activa al dar a "Enviar"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError('');

    try {
      const response = await fetch('/api/auth/login', { // <-- Llamamos a tu API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ¡Éxito! El Middleware ahora verá la cookie y nos dejará pasar
        router.push('/dashboard'); 
      } else {
        // Mostramos el error que viene de la API (ej: "Contraseña incorrecta")
        setError(data.error);
      }
    } catch (err) {
      setError('Algo salió mal. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <h1>Iniciar sesión</h1>
      <div className={styles.googleButton}>
        <PrimaryButton 
          text={'Iniciar sesión con Google'}
          url={'#'}
          Icon={FaGoogle}
        />
      </div>

      {/* 5. Si hay un error, lo mostramos aquí */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input 
            type='text' 
            name='nickname' // Importante: debe coincidir con el estado
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
          Contraseña:
          <input 
            type='password' 
            name='password'
            value={formData.password}
            onChange={handleChange} 
            required 
          />
        </label>
        
        {/* Usamos un botón normal de submit para disparar el onSubmit del form */}
        <button type='submit' className={styles.submitBtn}>
          Enviar formulario
        </button>
      </form>
    </>
  );
}

export default LoginForm;