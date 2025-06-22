import { useEffect, useState } from "react";

export function useTema() {
  const [modo, setModo] = useState("claro");

  useEffect(() => {
    const almacenado = localStorage.getItem("tema");
    if (almacenado) setModo(almacenado);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", modo === "oscuro");
    localStorage.setItem("tema", modo);
  }, [modo]);

  const alternar = () => {
    setModo((prev) => (prev === "oscuro" ? "claro" : "oscuro"));
  };

  return { modo, alternar };
}
