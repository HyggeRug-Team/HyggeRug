'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import PrimaryButton from '@/components/ui/Buttons/PrimaryBtn/PrimaryBtn';
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: '¡Bienvenido!', tipo: 'success' });
        // Redirigir al dashboard después del login
        router.push('/dashboard');
      } else {
        setMensaje({ texto: data.error, tipo: 'error' });
      }
    } catch (err) {
      setMensaje({ texto: 'Error de conexión.', tipo: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2>Iniciar sesión</h2>
      <p className={styles.subtitle}>¡Bienvenido de nuevo!</p>

      {/* Botón Google (opcional) */}
      <div className={styles.googleButton}>
        <PrimaryButton
          text="Entrar con Google"
          url={'#'}
          Icon={FaGoogle}
        />
      </div>

      <div className={styles.divider}>
        <span>o</span>
      </div>

      {/* Mensaje de error o éxito */}
      {mensaje.texto && (
        <p className={`${styles.message} ${styles[mensaje.tipo]}`}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className={styles.inputGroup}>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label htmlFor='email'>Correo electrónico:</label>
        </div>

        {/* Contraseña */}
        <div className={styles.inputGroup}>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label htmlFor='password'>Contraseña:</label>
        </div>

        <button 
          type='submit' 
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className={styles.links}>
        <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>

      <div className={styles.toggleContainer}>
        <p>¿No tienes cuenta?</p>
        <Link href="/register">Regístrate aquí</Link>
      </div>
    </div>
  );
}

