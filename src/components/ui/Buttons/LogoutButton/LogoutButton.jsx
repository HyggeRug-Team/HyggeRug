/*
 * Componente: LogoutButton
 * Descripción: Botón funcional para cerrar la sesión del usuario. Maneja la petición a la API de logout y redirige a la página de autenticación. Personalizable con texto e iconos.
 */
'use client';
import { useRouter } from "next/navigation";

/**
 * Podemos personalizar el botón con:
 * - Solo icono (para el sidebar)
 * - Solo texto
 * - Icono + texto
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.icon - Icono opcional a mostrar (ej: <FaArrowRightFromBracket />)
 * @param {string} props.text - Texto opcional a mostrar (ej: "Cerrar sesión")
 * @param {string} props.className - Clases CSS adicionales opcionales
 * @returns {JSX.Element} Botón de logout
 */
function LogoutButton({ icon = null, text = "Cerrar sesión", className = "" }) {
    const router = useRouter();
    
    /**
     * Manejador del evento de logout
     * Llama a la API de logout y redirige al usuario a la página de autenticación
     */
    const HandleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                router.push('/auth');
                router.refresh();
            }
        } catch(err) {
            console.error("Error al cerrar sesión", err);
        }
    }
    
    return (
        <button onClick={HandleLogout} className={className}>
            {icon && <span className="logout-icon">{icon}</span>}
            {text && <span className="logout-text">{text}</span>}
        </button>
    );
}

export default LogoutButton;
