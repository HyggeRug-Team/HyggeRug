import React from 'react'
import Header from '../../components/Header/Header'
import LoginForm from '../../components/LoginForm/LoginForm'
export default function page() {
  return (
    <>
        <Header/>
        {/*Div recomendado por Gemini porque el header es fixed*/}
        <div style={{height: '70px'}}></div>
        <LoginForm/>
    </>
  )
}
