import { useNavigate } from "react-router-dom";
import Fondo from "../../components/layout/Fondo";
import BarraUsuario from "../../components/layout/BarraUsuario";
import Boton from "../../components/ui/Boton";
import fondoCliente from "../../assets/fondo.webp";

export default function Pedido() {
  const navigate = useNavigate();

  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  const estadoColor = (estado) => {
    if (estado === "En cocina") return "bg-yellow-400 text-black";
    if (estado === "Listo para recoger") return "bg-blue-500 text-white";
    if (estado === "Recogido") return "bg-green-500 text-white";
    return "bg-gray-400 text-black"; // fallback para valores desconocidos
  };

  // Solo mostrar pedidos activos
  const pedidosActivos = pedidos.filter((p) => p.estado !== "Recogido");

  return (
    <Fondo imageUrl={fondoCliente}>
      <BarraUsuario />
      <section className="flex justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-6xl flex flex-col gap-6 text-white">
          {/* Título */}
          <h1
            className="text-4xl font-black mb-2 text-center"
            style={{ fontFamily: "Mulish" }}
          >
            Mis Pedidos
          </h1>

          {/* Leyenda de colores */}
          <div className="flex justify-center gap-4 flex-wrap mb-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-yellow-400 text-black font-semibold">
              En cocina
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500 text-white font-semibold">
              Listo para recoger
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500 text-white font-semibold">
              Recogido
            </span>
          </div>

          {/* Explicación de estados */}
          <p className="text-center text-gray-300 mb-6">
            Estos colores indican el estado de tus pedidos: <br />
            <span className="font-semibold">En cocina</span> → tu pedido está
            siendo preparado,{" "}
            <span className="font-semibold">Listo para recoger</span> →
            disponible para recoger,{" "}
            <span className="font-semibold">Recogido</span> → entregado
          </p>

          {/* Pedidos */}
          {pedidosActivos.length === 0 ? (
            <p className="text-center text-lg text-gray-300">
              No tienes pedidos en proceso.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pedidosActivos.map((pedido) => {
                const total = pedido.items.reduce(
                  (sum, item) => sum + item.precio * item.cantidad,
                  0
                );

                return (
                  <div
                    key={pedido.id}
                    className="bg-black/50 rounded-xl shadow-lg flex flex-col justify-between h-full"
                  >
                    {/* Contenido principal */}
                    <div className="p-4 flex flex-col gap-3 flex-grow">
                      {/* Header: ID y Estado */}
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

                      {/* Fecha / descripción */}
                      <p className="text-gray-400 text-sm sm:text-base">
                        {pedido.fecha}
                      </p>

                      {/* Lista de productos */}
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

                    {/* Footer: Total */}
                    <div className="mt-4 bg-white/10 p-4 text-lg font-bold flex justify-between items-center rounded-b-xl">
                      <span>Total</span>
                      <span>S/ {total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Botón volver al inicio */}
          <div className="flex justify-center mt-4">
            <Boton
              texto="🏠 Volver al inicio"
              onClickOverride={() => navigate("/cliente")}
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
