/*
 * Componente: AuthForm
 * Descripción: Gestiona el formulario de autenticación (Login/Registro), permitiendo iniciar sesión con Google o correo/contraseña. Incluye validaciones, manejo de estado y animaciones.
 */
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './AuthForm.module.css';


import PrimaryButton from '@/components/ui/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '@/components/ui/Buttons/SecondaryButton/SecondaryButton';
import TertiaryButton from '@/components/ui/Buttons/TertiaryButton/TertiaryButton';
import FloatingLabelInput from '@/components/ui/Inputs/FloatingLabelInput/FloatingLabelInput';
import SubmitButton from '@/components/ui/Buttons/SubmitButton/SubmitButton';
import StatusMessage from '@/components/ui/Feedback/StatusMessage/StatusMessage';

import { FaGoogle } from 'react-icons/fa';
import { IoPersonAddOutline } from 'react-icons/io5';

// Función para el boton de inicio de sesión de google
const handleGoogleLogin = () => {
  // State aleatorio para seguridad
    var randomState = Math.random().toString(36).substring(2);
  // Lo guardamos como cookie que dura 10 minutos 
  // SameSite es un parametro de seguridad que permite o no que acceda desde otro sitio para evitar ataques
    document.cookie = `oauth_state=${randomState}; max-age=600; path=/; SameSite=Lax`;
  // Direccion de google
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
  // Parametros que pide google
    const options = {
    // La URL que configuraste en la consola (localhost o vercel)
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",

    // Qué datos queremos pedirle (Email y Perfil)
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    // Un código aleatorio para evitar ataques, se guarda en una cookie y se verifica cuando google lo devuelve si este codigo es el mismo que ha devuelto
      state: randomState,
    };
  
  // 3. Convertimos los parámetros en una cadena de texto (query string)
    const qs = new URLSearchParams(options).toString();

  // 4. ¡Redirigimos!
    window.location.href = `${rootUrl}?${qs}`;
};
export default function AuthForm() {
  // Aquí activamos el router para poder movernos por la web como si fuera un menú
  const router = useRouter();

  // Aquí controlamos si el usuario quiere entrar o crearse una cuenta nueva
  const [isLogin, setIsLogin] = useState(true);

  // Aquí guardamos los datos del formulario para mandarlos luego a la base de datos
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Esto se encarga de avisar al usuario si todo ha ido bien o si ha habido algún fallo
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Aquí vamos actualizando los datos conforme el usuario va escribiendo en cada casilla
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Esto se encarga de cambiar entre el formulario de entrar y el de registro
  const toggleView = () => {
    setIsLogin(!isLogin);
    setMensaje({ texto: '', tipo: '' }); // Limpiar mensajes al cambiar
  };

  // Aquí realizamos el envío de los datos cuando se pulsa el botón principal
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí limpiamos los mensajes que hubiera de antes
    setMensaje({ texto: '', tipo: '' });

    // Validaciones especificas de registro
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí decidimos a qué parte de nuestra API vamos a llamar
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      // Aquí hacemos la llamada mágica al servidor y esperamos su respuesta
      const response = await fetch(endpoint, {
        method: 'POST',
        // Esto se encarga de decirle al servidor que le mandamos un JSON
        headers: { 'Content-Type': 'application/json' },
        // Aquí convertimos nuestros datos a texto para que el servidor los entienda
        body: JSON.stringify(formData),
      });

      // Aquí procesamos lo que nos ha dicho el servidor para ver qué ha pasado
      const data = await response.json();

      if (response.ok) {
        // Si todo ha salido perfecto, le damos la bienvenida al usuario
        setMensaje({
          texto: isLogin ? '¡Bienvenido!' : '¡Cuenta creada!',
          tipo: 'success'
        });

        // Aquí esperamos un poquito para que el usuario lea el mensaje y luego lo mandamos al dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // Si algo ha salido mal, aquí le explicamos qué ha pasado
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
      <div className={styles.header}>
        <AnimatePresence mode="wait">
          <motion.h1
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </motion.h1>
        </AnimatePresence>
      </div>

      <div className={styles.googleButton}>
        <PrimaryButton
          text={isLogin ? "Entrar con Google" : "Registrarse con Google"}
          Icon={FaGoogle}
          // Evitamos que el boton haga cosas que no debe
          onClick={(e) => {
            e.preventDefault();
            handleGoogleLogin();
          }}
        />
      </div>

      <StatusMessage message={mensaje.texto} type={mensaje.tipo} />

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="popLayout">
          {/* Campo Nickname */}
          {!isLogin && (
            <motion.div
                key="nickname"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 25 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
                <FloatingLabelInput 
                    type="text" 
                    id="nickname" 
                    name="nickname" 
                    value={formData.nickname} 
                    onChange={handleChange} 
                    label="¿Cómo te llamamos? (Nickname)"
                    required={!isLogin}
                    minLength={3}
                />
            </motion.div>
          )}

          {/* Campo Email */}
          <motion.div layout key="email">
            <FloatingLabelInput 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                label="Correo electrónico"
                required
            />
          </motion.div>

          {/* Campo Password */}
          <motion.div layout key="password">
            <FloatingLabelInput 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                label={isLogin ? 'Contraseña' : 'Crea una contraseña'}
                required
                minLength={6}
            />
          </motion.div>

          {/* Confirmar Password */}
          {!isLogin && (
            <motion.div
                key="confirmPassword"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
            >
                <FloatingLabelInput 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    label="Confirma contraseña"
                    required={!isLogin}
                />
            </motion.div>
          )}

          {/* Términos */}
          {!isLogin && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.terms}
            >
              <div className={styles.checkboxWrapper}>
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  Acepto los <Link href="/terms">términos y condiciones</Link>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SubmitButton 
            isLoading={isLoading} 
            isLogin={isLogin} 
            textLogin="Entrar" 
            textRegister="Registrarme"
        />
      </form>

      {/* Switcher Login/Register */}
      <div className={styles.toggleContainer}>
        <p>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        </p>
        <div className={styles.terciaryBtn}>
          <SecondaryButton
            Icon={IoPersonAddOutline}
            text={isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            onClick={toggleView}
          />
        </div>
      </div>
    </div>
  );
}
