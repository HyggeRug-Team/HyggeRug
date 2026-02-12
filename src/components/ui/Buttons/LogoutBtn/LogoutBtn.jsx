'use client';
import { useRouter } from "next/navigation";

/**
 * Componente LogoutBtn - Botón de Cierre de Sesión
 * 
 * Botón flexible para cerrar sesión del usuario.
 * Implementamos la lógica de logout llamando a la API y redirigiendo.
 * 
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
function LogoutBtn({ icon = null, text = "Cerrar sesión", className = "" }) {
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

export default LogoutBtn;
