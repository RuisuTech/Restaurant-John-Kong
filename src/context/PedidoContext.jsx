// src/context/PedidoContext.jsx
import { createContext, useState, useContext } from "react";

// Creamos el contexto
const PedidoContext = createContext();

// Provider del contexto
export const PedidoProvider = ({ children }) => {
  const [pedido, setPedido] = useState([]); // Array de items del pedido
  const [mesa, setMesa] = useState(null); // Mesa asociada al pedido

  // Agregar un item al pedido
  const agregarItem = (item) => {
    setPedido((prev) => {
      const existe = prev.find((p) => p.id === item.id);
      if (existe) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  // Reducir cantidad de un item
  const reducirItem = (id) => {
    setPedido((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0)
    );
  };

  // Eliminar item del pedido
  const eliminarItem = (id) => {
    setPedido((prev) => prev.filter((p) => p.id !== id));
  };

  // Vaciar pedido
  const vaciarPedido = () => {
    setPedido([]);
    setMesa(null);
  };

  return (
    <PedidoContext.Provider
      value={{
        pedido,
        mesa,
        setMesa,
        agregarItem,
        reducirItem,
        eliminarItem,
        vaciarPedido,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const usePedido = () => useContext(PedidoContext);
