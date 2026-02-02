'use client';
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';

export default function AuthPage() {
  const [esLogin, setEsLogin] = useState(true); // Estado para alternar

  return (
    <>
      <Header />
      <div></div>
      
      <main >
        {esLogin ? <LoginForm /> : <RegisterForm />}

        <button 
          onClick={() => setEsLogin(!esLogin)}
        >
          {esLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </main>
    </>
  );
}