"use client";

import { useEffect, useState } from "react";
import { 
  FaSun, 
  FaCloudSun, 
  FaCloudRain, 
  FaSnowflake, 
  FaBolt, 
  FaSmog, 
  FaLocationDot 
} from "react-icons/fa6";

/**
 * Componente WeatherWidget (Geolocalizado)
 * 
 * 1. Intenta obtener la ubicación del usuario.
 * 2. Consulta Open-Meteo para el clima.
 * 3. Muestra Temperatura, Icono y Ciudad.
 * 4. Fallback a Madrid si no hay permisos.
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Ubicando...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener clima
    const fetchWeather = async (lat, lon, cityName = null) => {
      try {
        // 1. Clima
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        
        // 2. Ciudad (Si no viene definida, intentamos reverse geocoding simple)
        let finalCity = cityName;
        if (!finalCity) {
           try {
             const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`);
             const geoData = await geoRes.json();
             finalCity = geoData.city || geoData.locality || "Tu Ubicación";
           } catch (e) {
             finalCity = "Local";
           }
        }

        if (data.current_weather) {
          setWeather(data.current_weather);
          setCity(finalCity);
        }
      } catch (error) {
        console.error("Error clima:", error);
        setCity("Error");
      } finally {
        setLoading(false);
      }
    };

    // Pedir ubicación
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Fallback: Madrid
          console.log("Ubicación denegada, usando Madrid por defecto.");
          fetchWeather(40.4168, -3.7038, "Madrid");
        }
      );
    } else {
      fetchWeather(40.4168, -3.7038, "Madrid");
    }
  }, []);

  // Iconos
  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <FaSun style={{ color: "#FFD700" }} />;
    if (code <= 3) return <FaCloudSun style={{ color: "#dcdde1" }} />;
    if (code <= 67 || code >= 80) return <FaCloudRain style={{ color: "#3498db" }} />;
    if (code >= 71 && code <= 77) return <FaSnowflake style={{ color: "#ecf0f1" }} />;
    if (code >= 95) return <FaBolt style={{ color: "#f1c40f" }} />;
    return <FaSmog style={{ color: "#95a5a6" }} />;
  };

  if (loading || !weather) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", 
        background: "rgba(255,255,255,0.05)", borderRadius: "12px", minWidth: "120px", height: "45px"
      }}>
        <div style={{width:"20px", height:"20px", borderRadius:"50%", background:"rgba(255,255,255,0.1)", animation:"pulse 1s infinite"}}></div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "rgba(255, 255, 255, 0.05)",
      padding: "8px 16px",
      borderRadius: "16px",
      border: "2px dashed rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(5px)",
      color: "var(--white)",
      transition: "all 0.3s ease"
    }}>
      <div style={{ fontSize: "1.5rem", display: "flex", alignItems: "center" }}>
        {getWeatherIcon(weather.weathercode)}
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: "800", fontFamily: "var(--font-titles)" }}>
          {Math.round(weather.temperature)}°C
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--grey-400)", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600", textTransform:"uppercase" }}>
          <FaLocationDot size={8} style={{color:"var(--highlight-text)"}} /> {city}
        </span>
      </div>
    </div>
  );
}
