import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/layout/Fondo";
import BarraUsuario from "../../components/layout/BarraUsuario";
import Boton from "../../components/ui/Boton";
import fondoCliente from "../../assets/fondo.webp";

export default function Cocina() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Cargar pedidos desde localStorage
    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos") || "[]");
    setPedidos(pedidosGuardados);
  }, []);

  // Función para actualizar el estado de un pedido
  const cambiarEstado = (id) => {
    const nuevosPedidos = pedidos.map((p) => {
      if (p.id === id) {
        if (p.estado === "En cocina") return { ...p, estado: "Listo para recoger" };
        if (p.estado === "Listo para recoger") return { ...p, estado: "Recogido" };
      }
      return p;
    });

    // Guardar solo los pedidos que no estén "Recogido"
    const pedidosActivos = nuevosPedidos.filter((p) => p.estado !== "Recogido");

    // Actualizar el estado
    setPedidos(pedidosActivos);
    localStorage.setItem("pedidos", JSON.stringify(pedidosActivos));
  };

  const estadoColor = (estado) => {
    if (estado === "En cocina") return "bg-yellow-400 text-black";
    if (estado === "Listo para recoger") return "bg-blue-500 text-white";
    if (estado === "Recogido") return "bg-green-500 text-white";
    return "bg-gray-400 text-black";
  };

  return (
    <Fondo imageUrl={fondoCliente}>
      <BarraUsuario />
      <section className="flex justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-6xl flex flex-col gap-6 text-white">
          <h1 className="text-4xl font-black mb-4 text-center" style={{ fontFamily: "Mulish" }}>
            Panel de Cocina
          </h1>

          {pedidos.length === 0 ? (
            <p className="text-center text-lg text-gray-300">No hay pedidos activos.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pedidos.map((pedido) => {
                const total = pedido.items.reduce(
                  (sum, item) => sum + item.precio * item.cantidad,
                  0
                );

                return (
                  <div
                    key={pedido.id}
                    className="bg-black/50 rounded-xl shadow-lg flex flex-col justify-between h-full"
                  >
                    <div className="p-4 flex flex-col gap-3 flex-grow">
                      {/* Header: ID, método y estado */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h2 className="text-xl font-bold">{`Pedido #${pedido.id}`}</h2>
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base ${estadoColor(
                            pedido.estado
                          )}`}
                        >
                          {pedido.estado}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm sm:text-base">
                        Método de pago: {pedido.metodo}
                      </p>
                      <p className="text-gray-400 text-sm sm:text-base">{pedido.fecha}</p>

                      {/* Productos */}
                      <div className="flex flex-col gap-2 mt-2 max-h-60 overflow-y-auto">
                        {pedido.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between bg-white/10 p-3 rounded-lg"
                          >
                            <span>
                              {item.nombre} × {item.cantidad}
                            </span>
                            <span>S/ {item.precio * item.cantidad}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Total y botón de actualizar estado */}
                    <div className="mt-4 bg-white/10 p-4 text-lg font-bold flex justify-between items-center rounded-b-xl flex-col sm:flex-row gap-2 sm:gap-0">
                      <span>Total: S/ {total}</span>
                      {pedido.estado !== "Recogido" && (
                        <button
                          onClick={() => cambiarEstado(pedido.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
                        >
                          {pedido.estado === "En cocina"
                            ? "Marcar listo para recoger"
                            : "Marcar recogido"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Boton
              texto="🏠 Volver al inicio"
              onClickOverride={() => navigate("/admin")}
              bgColor="bg-gray-600 hover:bg-gray-700"
              textColor="text-white"
              className="px-6 py-3 rounded-lg"
            />
          </div>
        </div>
      </section>
    </Fondo>
  );
}
