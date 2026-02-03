'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';
import PrimaryButton from '../PrimaryBtn/PrimaryBtn';
import { FaGoogle } from "react-icons/fa";

export default function AuthForm() {
    // Inicializar router que es para redirigir, como un Header o href 
    const router = useRouter();

    // Constante isLogin comienza en true y para cambiarlo se usa SetIsLogin es el estado a diferencia de una variable normal esta es reactiva
    const [isLogin, SetIsLogin] = useState(true);

    // Constante que guarda los datos de nickname email y contraseña para pasar directamente este objeto al middleware
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: ''
    });

    // Guarda mensajes de error o correctos 
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Actua
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Cambia los valores del dato de formData que coincida con el nombre del input 
        // Los tres puntos permite que todos los valores antiguos se mantengan, se llama Spread Operator
        setFormData({ ...formData, [name]: value });
    };

    // Función asincrona, necesario para usar await
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Elimina los mensajes anteriores
        setMensaje({ texto: '', tipo: '' });

        // Guarda el script que se va a ejecutar dependiendo de la variable isLogin
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            // Await indica que es una promesa, es decir que se recibirá algo en el futuro, no hace falta que sea inmediato
            const response = await fetch(endpoint, {
                method: 'POST',
                // Indica al servidor El tipo del contenido, JSON
                headers: { 'Content-Type': 'application/json' },
                // El contenido es el objeto formData convertido en texto con estructura json ya que no puede recibir un objeto
                body: JSON.stringify(formData),
            });

            // Guarda en data un objeto que es lo que se recibe del servidor para despues mostrar el mensaje de error
            const data = await response.json();

            if (response.ok) {
                // Si se ha creado la cuenta o iniciado sesión se redirige a dashboard
                setMensaje({ texto: isLogin ? '¡Bienvenido!' : '¡Cuenta creada!', tipo: 'success' });
                // TODO: Cambiar la ruta a donde sea mejor
                router.push('/dashboard');
            } else {
                // Si ha fallado se guarda el mensaje de error
                setMensaje({ texto: data.error, tipo: 'error' });
            }
        } catch (err) {
            setMensaje({ texto: 'Error de conexión.', tipo: 'error' });
        }
    };

    return (
        <div className={styles.authWrapper}>
            <h1>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>

            <div className={styles.googleButton}>
                <PrimaryButton
                    text={isLogin ? 'Entrar con Google' : 'Registrarse con Google'}
                    url={'#'}
                    Icon={FaGoogle}
                />
            </div>

            {/*Es el texto de error o correcto*/}
            {mensaje.texto && (
                <p className={`${styles.message} ${styles[mensaje.tipo]}`}>
                    {mensaje.texto}
                </p>
            )}

            <form className={styles.authForm} onSubmit={handleSubmit}>
                {/*Si no es login si pide el nombre, los && hacen que si la condición no se cumple directamente deje de leer ese codigo */}
                {!isLogin &&
                    <label>
                        {isLogin ? 'Nombre de usuario:' : '¿Cómo te llamamos? (Nickname):'}
                        <input type='text' name='nickname' value={formData.nickname} onChange={handleChange} required />
                    </label>
                }
                <label>
                    Correo electrónico:
                    <input type='email' name='email' value={formData.email} onChange={handleChange} required />
                </label>

                <label>
                    {isLogin ? 'Contraseña:' : 'Crea una contraseña:'}
                    <input type='password' name='password' value={formData.password} onChange={handleChange} required />
                </label>

                {/* BOTÓN 1: El de enviar el formulario (Submit) */}
                <button type='submit' className={styles.submitBtn}>
                    {isLogin ? 'Entrar' : 'Registrarme'}
                </button>
            </form>

            {/* BOTÓN 2: El de cambiar de modo (Fuera del <form>) */}
            <div className={styles.toggleContainer}>
                <span>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
                <button
                    type="button" // Importante: type="button" para que NO envíe el formulario
                    className={styles.linkBtn}
                    onClick={() => SetIsLogin(!isLogin)}
                >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
            </div>
        </div>
    );
}