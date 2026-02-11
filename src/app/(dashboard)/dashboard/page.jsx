// src/app/dashboard/page.jsx
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutBtn from "@/components/ui/Buttons/LogoutBtn/LogoutBtn";
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  // Verificamos quién es el usuario para saludarle
  const session = await verifySession(token);

  // Si por algún motivo llegara aquí sin sesión, lo mandamos fuera
  if (!session) {
    redirect("/auth");
  }

  return (
    <main>
      <h1>Bienvenido a tu panel, {session.nickname} 🧶</h1>
      <p>ID de Cliente: #00{session.userId}</p>
      Aquí irían sus alfombras favoritas o pedidos
      <div>
        <a href="/">Volver a la tienda</a>
      </div>
      <LogoutBtn />
    </main>
  );
}
