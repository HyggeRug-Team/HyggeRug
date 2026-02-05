import AuthForm from '@/components/auth/AuthForm/AuthForm';

export const metadata = {
  title: 'Acceso | Hygge Rug',
  description: 'Inicia sesión o regístrate en Hygge Rug'
};

export default function AuthPage() {
  return <AuthForm />;
}
