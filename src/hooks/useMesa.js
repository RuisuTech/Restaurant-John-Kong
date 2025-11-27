import { useState, useEffect } from "react";

export function useMesa() {
  const [mesa, setMesa] = useState(() => {
    return localStorage.getItem("mesa") || null;
  });

  useEffect(() => {
    if (mesa) localStorage.setItem("mesa", mesa);
  }, [mesa]);

  return mesa;
}
