"use client"
import { useState, useEffect } from "react"
import { ThemeSwitcher } from "./ThemeSwitcher"

const Example = () => {
  // Estado inicial
  const [theme, setTheme] = useState("system")

  useEffect(() => {
    // Referencia al elemento <html> (donde vive tu CSS :root y data-theme)
    const root = document.documentElement

    // Función para eliminar el atributo viejo y poner el nuevo
    const applyTheme = (themeToApply) => {
      if (themeToApply === "dark") {
        root.setAttribute("data-theme", "dark")
      } else if (themeToApply === "light") {
        root.setAttribute("data-theme", "light") // O removeAttribute('data-theme') si prefieres
      }
    }

    // Lógica principal
    if (theme === "system") {
      // Preguntamos al navegador cuál es la preferencia del sistema operativo
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light"
      applyTheme(systemTheme)
    } else {
      // Si el usuario eligió explícitamente "light" o "dark"
      applyTheme(theme)
    }

  }, [theme]) // Este efecto se ejecuta cada vez que cambia la variable 'theme'

  return (
    <ThemeSwitcher 
      defaultValue="system" 
      onChange={setTheme} 
      value={theme} 
    />
  )
}

export default Example