import { useCarrito } from "../../hooks/useCarrito";
import { useMesa } from "../../hooks/useMesa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PagoSimulado() {
  const { carrito, vaciar } = useCarrito();
  const mesa = useMesa();
  const navigate = useNavigate();

  const [metodo, setMetodo] = useState(null);
  const [pedidoListo, setPedidoListo] = useState(false);

  const total = carrito.reduce((s, item) => s + item.precio * item.cantidad, 0);

  const confirmarPedido = () => {
    if (!metodo) {
      alert("Selecciona un método de pago");
      return;
    }

    const pedido = {
      id: Date.now(),
      mesa,
      items: carrito.map((item) => ({ ...item, id: `${item.nombre}-${Date.now()}` })),
      total,
      metodo,
      estado: "pendiente",
      fecha: new Date().toLocaleString(),
    };

    const pedidosPrevios = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidosPrevios.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosPrevios));

    vaciar(); // borrar carrito al confirmar
    setPedidoListo(true);

    setTimeout(() => navigate("/gracias"), 1500);
  };

  if (carrito.length === 0) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Pago</h1>
        <p className="mt-4">No tienes productos en el carrito</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">Resumen y Pago</h1>

      <p className="text-gray-600 text-center">
        Mesa: <strong>{mesa || "No asignada"}</strong>
      </p>

      {/* Productos */}
      <div className="flex flex-col gap-4">
        {carrito.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/10 p-4 rounded shadow hover:bg-white/20 transition">
            <div>
              <p className="font-semibold text-white">{item.nombre}</p>
              <p className="text-gray-300">Cantidad: {item.cantidad}</p>
            </div>
            <p className="font-bold text-white">S/ {item.precio * item.cantidad}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center bg-black/50 p-4 rounded shadow">
        <span className="font-semibold text-white text-lg">Total</span>
        <span className="font-bold text-white text-lg">S/ {total}</span>
      </div>

      {/* Métodos de pago */}
      <h2 className="text-lg font-bold text-white">Selecciona un método de pago</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className={`flex-1 p-3 rounded border text-white ${
            metodo === "yape" ? "bg-purple-500" : "border-gray-400"
          }`}
          onClick={() => setMetodo("yape")}
        >
          Yape
        </button>

        <button
          className={`flex-1 p-3 rounded border text-white ${
            metodo === "plin" ? "bg-blue-500" : "border-gray-400"
          }`}
          onClick={() => setMetodo("plin")}
        >
          Plin
        </button>

        <button
          className={`flex-1 p-3 rounded border text-white ${
            metodo === "efectivo" ? "bg-green-500" : "border-gray-400"
          }`}
          onClick={() => setMetodo("efectivo")}
        >
          Efectivo
        </button>
      </div>

      <button
        onClick={confirmarPedido}
        className="w-full bg-blue-700 text-white p-3 rounded mt-4 font-semibold hover:bg-blue-800 transition"
      >
        Confirmar pago
      </button>

      {pedidoListo && (
        <p className="text-green-400 text-center font-semibold mt-2">
          ¡Pago registrado! Redirigiendo...
        </p>
      )}
    </div>
  );
}
