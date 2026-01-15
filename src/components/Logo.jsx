// src/components/Logo.jsx
export const Logo = ({ size = 40 }) => {
  return (
    <img 
      src="/favicon.svg" 
      alt="Nombre de mi Marca" 
      style={{ width: size, height: 'auto' }} 
    />
  );
};