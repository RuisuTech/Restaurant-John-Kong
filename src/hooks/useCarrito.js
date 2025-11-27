import { useState, useEffect } from "react";

export function useCarrito() {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoLS = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(carritoLS);
  }, []);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregar = (item) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === item.id);
      if (existe) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const reducir = (item) => {
    setCarrito((prev) =>
      prev
        .map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  const eliminar = (item) => {
    setCarrito((prev) => prev.filter((i) => i.id !== item.id));
  };

  const vaciar = () => {
    setCarrito([]);
    localStorage.removeItem("carrito"); // Solo se borra al confirmar pago
  };

  return { carrito, agregar, reducir, eliminar, vaciar };
}
