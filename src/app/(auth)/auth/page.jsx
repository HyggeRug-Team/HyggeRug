import AuthForm from '@/components/auth/AuthForm/AuthForm';

export const metadata = {
  title: 'Acceso | Hygge Rug - Únete a la Comunidad',
  description: 'Inicia sesión o regístrate en Hygge Rug para gestionar tus pedidos personalizados, guardar tus diseños favoritos y acceder al Laboratorio IA.',
  keywords: 'login, registro, Hygge Rug, cuenta usuario, pedidos personalizados, tufting community'
};

/**
 * @file page.jsx (Auth)
 * @description Página de acceso: mostramos `AuthForm` (Login/Registro) y gestionamos su metadata.
 *
 * [Nuestro enfoque]
 * Hemos mantenido esta página simple: delega toda la lógica a `AuthForm` para que el código sea
 * fácil de mantener.
 *
 * [Por qué lo hemos hecho así]
 * Así evitamos duplicar lógica de autenticación y logramos una separación clara:
 * “la página” solo coordina, “el componente” hace el trabajo.
 */
export default function AuthPage() {
  return <AuthForm />;
}
