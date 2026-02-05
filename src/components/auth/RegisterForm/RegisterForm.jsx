'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './RegisterForm.module.css';
import PrimaryButton from '@/components/ui/Buttons/PrimaryBtn/PrimaryBtn';
import { FaGoogle } from 'react-icons/fa';

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: '¡Cuenta creada con éxito!', tipo: 'success' });
        // Redirigir al dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
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
    <div className={styles.registerForm}>
      <h2>Crear cuenta</h2>
      <p className={styles.subtitle}>¡Únete a la familia Hygge Rug!</p>

      {/* Botón Google (opcional) */}
      <div className={styles.googleButton}>
        <PrimaryButton
          text="Registrarse con Google"
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
        {/* Nickname */}
        <div className={styles.inputGroup}>
          <input
            type='text'
            id='nickname'
            name='nickname'
            value={formData.nickname}
            onChange={handleChange}
            placeholder=" "
            required
            minLength={3}
          />
          <label htmlFor='nickname'>¿Cómo te llamamos? (Nickname):</label>
        </div>

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
            minLength={6}
          />
          <label htmlFor='password'>Crea una contraseña:</label>
        </div>

        {/* Confirmar contraseña */}
        <div className={styles.inputGroup}>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label htmlFor='confirmPassword'>Confirma tu contraseña:</label>
        </div>

        <div className={styles.terms}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            Acepto los <Link href="/terms">términos y condiciones</Link>
          </label>
        </div>

        <button 
          type='submit' 
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <div className={styles.toggleContainer}>
        <p>¿Ya tienes cuenta?</p>
        <Link href="/login">Inicia sesión</Link>
      </div>
    </div>
  );
}

