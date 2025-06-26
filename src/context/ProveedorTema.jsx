import { useState, useEffect } from "react";
import { TemaContext } from "./TemaContext";

// Proveedor global de tema (claro/oscuro) usando Context API
export function ProveedorTema({ children }) {
  const [modo, setModo] = useState("claro"); // Estado del tema: 'claro' o 'oscuro'

  // Al montar el componente, intenta recuperar el tema almacenado en localStorage
  useEffect(() => {
    const almacenado = localStorage.getItem("tema");
    if (almacenado) setModo(almacenado);
  }, []);

  // Cada vez que cambia el modo, actualiza la clase HTML y guarda el valor en localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", modo === "oscuro");
    localStorage.setItem("tema", modo);
  }, [modo]);

  // Cambia entre modo claro y oscuro
  const alternar = () => {
    setModo((prev) => (prev === "oscuro" ? "claro" : "oscuro"));
  };

  return (
    <TemaContext.Provider value={{ modo, alternar }}>
      {children} {/* Resto de la app que usará el contexto */}
    </TemaContext.Provider>
  );
}
