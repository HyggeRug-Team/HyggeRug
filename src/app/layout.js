import "./globals.css";

export const metadata = {
  title: "Hygge Rug",
  description: "Web de alfombras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Aquí podrías poner un Navbar en el futuro */}
        {children} 
      </body>
    </html>
  );
}