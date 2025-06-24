import { useState, useEffect } from "react";
import { TemaContext } from "./TemaContext";

export function ProveedorTema({ children }) {
  const [modo, setModo] = useState("claro");

  useEffect(() => {
    const almacenado = localStorage.getItem("tema");
    if (almacenado) setModo(almacenado);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", modo === "oscuro");
    localStorage.setItem("tema", modo);
  }, [modo]);

  const alternar = () => {
    setModo((prev) => (prev === "oscuro" ? "claro" : "oscuro"));
  };

  return (
    <TemaContext.Provider value={{ modo, alternar }}>
      {children}
    </TemaContext.Provider>
  );
}
