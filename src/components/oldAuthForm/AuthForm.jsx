'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';
import PrimaryButton from '@/components/ui/Buttons/PrimaryBtn/PrimaryBtn';
import { FaGoogle } from "react-icons/fa";
import TerciaryButton from '@/components/ui/Buttons/TerciaryBtn/TerciaryBtn';
import { IoPersonAddOutline } from "react-icons/io5";

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
            <div className={styles.imgWrapper}>
                <h1>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
            </div>
            <div className={styles.formWrapper}>
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
                    {/* Campo Nickname (Solo en registro) */}
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <input
                                type='text'
                                id='nickname'
                                name='nickname'
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label htmlFor='nickname'>¿Cómo te llamamos? (Nickname):</label>
                        </div>
                    )}

                    {/* Campo Correo */}
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

                    {/* Campo Contraseña */}
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
                        <label htmlFor='password'>
                            {isLogin ? 'Contraseña:' : 'Crea una contraseña:'}
                        </label>
                    </div>

                    <button type='submit' className={styles.submitBtn}>
                        {isLogin ? 'Entrar' : 'Registrarme'}
                    </button>
                </form>

                {/* BOTÓN 2: El de cambiar de modo (Fuera del <form>) */}
                <div className={styles.toggleContainer}>

                    <p>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</p>
                    <div className={styles.terciaryBtn}>
                        <TerciaryButton
                            Icon={IoPersonAddOutline}
                            text={isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                            onClick={() => SetIsLogin(!isLogin)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}