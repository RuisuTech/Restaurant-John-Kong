import { useContext } from "react";
import { TemaContext } from "../context/TemaContext";

// Hook personalizado para acceder fácilmente al contexto del tema (claro/oscuro)
export function useTema() {
  return useContext(TemaContext); // Devuelve { modo, alternar }
}
