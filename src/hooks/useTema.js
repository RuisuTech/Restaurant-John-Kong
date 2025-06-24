import { useContext } from "react";
import { TemaContext } from "../context/TemaContext";

export function useTema() {
  return useContext(TemaContext);
}
