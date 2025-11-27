import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("carrito");
    return saved ? JSON.parse(saved) : { mesa: null, items: [], total: 0 };
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const setMesaCarrito = (mesa) => {
    setCarrito((prev) => ({ ...prev, mesa }));
  };

  const agregarItem = (plato) => {
    setCarrito((prev) => {
      const existe = prev.items.find((i) => i.id === plato.id);

      let nuevosItems;
      if (existe) {
        nuevosItems = prev.items.map((i) =>
          i.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      } else {
        nuevosItems = [...prev.items, { ...plato, cantidad: 1 }];
      }

      return {
        ...prev,
        items: nuevosItems,
        total: nuevosItems.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        ),
      };
    });
  };

  const limpiarCarrito = () => {
    setCarrito({ mesa: null, items: [], total: 0 });
    localStorage.removeItem("carrito");
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, setMesaCarrito, agregarItem, limpiarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
