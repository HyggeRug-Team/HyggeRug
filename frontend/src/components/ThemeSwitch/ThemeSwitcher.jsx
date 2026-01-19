"use client";
import { IoMoon, IoSunny, IoDesktopOutline } from "react-icons/io5";

export const ThemeSwitcher = ({ value, onChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '5px', 
      background: 'var(--bg-secundario)', 
      padding: '4px',
      width: 'fit-content', 
      borderRadius: '20px',
      border: '1px solid var(--border-shadow)'
    }}>
      {/* Botón LIGHT */}
      <button
        onClick={() => onChange("light")}
        style={{
          background: value === "light" ? "#fff" : "transparent",
          color: value === "light" ? "#000" : "var(--texto-secundario)",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: value === "light" ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.2s"
        }}
        title="Modo Claro"
      >
        <IoSunny />
      </button>
      {/* Botón SYSTEM */}
      <button
        onClick={() => onChange("system")}
        style={{
          background: value === "system" ? "#fff" : "transparent",
          color: value === "system" ? "#000" : "var(--texto-secundario)",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: value === "system" ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.2s"
        }}
        title="Sistema"
      >
        <IoDesktopOutline />
      </button>
      {/* Botón DARK */}
      <button
        onClick={() => onChange("dark")}
        style={{
          background: value === "dark" ? "#333" : "transparent",
          color: value === "dark" ? "#fff" : "var(--texto-secundario)",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: value === "dark" ? "0 2px 5px rgba(0,0,0,0.3)" : "none",
          transition: "all 0.2s"
        }}
        title="Modo Oscuro"
      >
        <IoMoon />
      </button>
    </div>
  );
};