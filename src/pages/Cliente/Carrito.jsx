import { useState } from "react";

export function Carrito() {
  const [carrito, setCarrito] = useState([]); // ✅ arreglo vacío

  const agregar = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const reducir = (id) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      ).filter(item => item.cantidad > 0)
    );
  };

  const eliminar = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  return { carrito, agregar, reducir, eliminar };
}
