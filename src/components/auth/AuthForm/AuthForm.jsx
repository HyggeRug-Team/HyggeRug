'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './AuthForm.module.css';
import PrimaryButton from '@/components/ui/Buttons/PrimaryBtn/PrimaryBtn';
import { FaGoogle } from 'react-icons/fa';

export default function AuthForm() {
  const router = useRouter();

  // Estado para alternar entre Login (true) y Registro (false)
  const [isLogin, setIsLogin] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Mensajes de error o exito
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Funcion para alternar vista
  const toggleView = () => {
    setIsLogin(!isLogin);
    setMensaje({ texto: '', tipo: '' }); // Limpiar mensajes al cambiar
  };

  // Envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    // Validaciones especificas de registro
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Determinamos el endpoint segun la accion
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ 
          texto: isLogin ? '¡Bienvenido de nuevo!' : '¡Cuenta creada con éxito!', 
          tipo: 'success' 
        });
        
        // Redirigir al dashboard tras un leve retraso
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
    <div className={styles.authForm}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
      <p className={styles.subtitle}>
        {isLogin ? '¡Qué bueno verte otra vez!' : '¡Únete a la familia Hygge Rug!'}
      </p>

      {/* Botón Google (opcional) */}
      <div className={styles.googleButton}>
        <PrimaryButton
          text={isLogin ? "Acceder con Google" : "Registrarse con Google"}
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
        
        {/* Campo Nickname (Solo visible en Registro) */}
        {!isLogin && (
          <div className={styles.inputGroup}>
            <input
              type='text'
              id='nickname'
              name='nickname'
              value={formData.nickname}
              onChange={handleChange}
              placeholder=" "
              required={!isLogin}
              minLength={3}
            />
            <label htmlFor='nickname'>¿Cómo te llamamos? (Nickname)</label>
          </div>
        )}

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
          <label htmlFor='email'>Correo electrónico</label>
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
          <label htmlFor='password'>Contraseña</label>
        </div>

        {/* Confirmar contraseña (Solo Registro) */}
        {!isLogin && (
          <div className={styles.inputGroup}>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              required={!isLogin}
            />
            <label htmlFor='confirmPassword'>Confirma contraseña</label>
          </div>
        )}

        {/* Términos (Solo Registro) */}
        {!isLogin && (
          <div className={styles.terms}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Acepto los <Link href="/terms">términos y condiciones</Link>
            </label>
          </div>
        )}

        <button 
          type='submit' 
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarme')}
        </button>
      </form>

      {/* Toggle para cambiar entre Login y Registro */}
      <div className={styles.toggleContainer}>
        <p>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        </p>
        <button onClick={toggleView} className={styles.toggleBtn}>
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
