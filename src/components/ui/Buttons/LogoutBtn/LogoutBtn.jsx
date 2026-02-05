'use client';
import { useRouter } from "next/navigation";

function LogoutBtn() {
    const router = useRouter();
    const HandleLogout = async () => {
        try {


            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                router.push('/auth');
                router.refresh();
            }
        }catch(err){
            console.error("Error al cerrar sesión", error)
        }
    }
    return (
        <button onClick={HandleLogout}>
            Cerrar sesión
        </button>
    )
}

export default LogoutBtn