import React from 'react'
import styles from './LoginForm.module.css'
import PrimaryButton from '../PrimaryBtn/PrimaryBtn';
import { FaGoogle } from "react-icons/fa";
function LoginForm() {
  return (
    <>
      <h1>Iniciar sesión </h1>
      <div className={styles.googleButton}>
        <PrimaryButton 
          text={'Iniciar sesión con Google'}
          url={'#'}
          Icon={FaGoogle}
        />
      </div>

      <form className={styles.loginForm}>
        <label>
          Nombre:
          <input type='text' />
        </label>
        <label>
          Correo electronico:
          <input type='email' />
        </label>
        <label>
          Contraseña:
          <input type='password' />
        </label>
        <input type='submit' value={'Enviar formulario '} />
      </form>
    </>
  )
}

export default LoginForm