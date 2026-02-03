'use client';
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './auth.module.css';

export default function AuthPage(){
  return (
    <>
      <Header styles={styles.header} />
        <AuthForm styles={styles.authForm}/> 
    </>
  );
}