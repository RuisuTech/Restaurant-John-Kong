import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import BarraUsuario from "../../components/BarraUsuario";
import { useAuth } from "../../context/AuthContext";
import { obtenerReservas, actualizarEstadoReserva } from "../../utils/api";

function HistorialReservas() {
  const [reservasUsuario, setReservasUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroMesa, setFiltroMesa] = useState("todas");
  const [orden, setOrden] = useState("desc");
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    const obtener = async () => {
      try {
        const todas = await obtenerReservas();
        const delUsuario = todas.filter(
          (r) => r.usuario?.correo === usuario.correo
        );
        setReservasUsuario(delUsuario);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtener();
    const intervalo = setInterval(obtener, 10000);
    return () => clearInterval(intervalo);
  }, [usuario, navigate]);

  const getEstadoTexto = (reserva) => {
    const { estado, fecha, hora } = reserva;
    const fechaReserva = new Date(`${fecha}T${hora}`);
    const ahora = new Date();

    if (estado === "cancelada" || estado === "cancelada por el cliente") {
      return "Cancelada";
    }

    if (estado === "completada") {
      return "Reserva terminada";
    }

    if (estado === "confirmada") {
      return fechaReserva < ahora ? "Reserva terminada" : "Reserva lista";
    }

    return "Aún no lista";
  };

  const getEstadoColor = (estadoTexto) => {
    const estilos = {
      "Reserva lista":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Reserva terminada":
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      Cancelada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Aún no lista":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return estilos[estadoTexto] || "bg-gray-100 text-gray-800";
  };

  const cancelarReserva = async (id) => {
    try {
      const actualizada = await actualizarEstadoReserva(
        id,
        "cancelada por el cliente"
      );
      setReservasUsuario((prev) =>
        prev.map((r) => (r.id === id ? actualizada : r))
      );
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Hubo un error al cancelar la reserva.");
    }
  };

  const reservasFiltradas = [...reservasUsuario]
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return orden === "desc" ? fechaB - fechaA : fechaA - fechaB;
    })
    .filter((reserva) => {
      const estadoTexto = getEstadoTexto(reserva);
      const cumpleEstado =
        filtroEstado === "todos" || estadoTexto === filtroEstado;
      const cumpleTipo = filtroTipo === "todos" || reserva.tipo === filtroTipo;
      const cumpleMesa = filtroMesa === "todas" || reserva.mesa === filtroMesa;
      return cumpleEstado && cumpleTipo && cumpleMesa;
    });

  const mesasUnicas = [
    ...new Set(reservasUsuario.map((r) => r.mesa).filter(Boolean)),
  ];

  if (cargando) {
    return (
      <Fondo imageUrl="/fondo.webp">
        <BarraUsuario mostrarVolver />
        <div className="min-h-screen pt-20 flex justify-center items-center">
          <p className="text-white text-lg">Cargando historial...</p>
        </div>
      </Fondo>
    );
  }

  return (
    <Fondo imageUrl="/fondo.webp" className="px-0">
      <BarraUsuario mostrarVolver />
      <div className="w-full min-h-screen pt-20 pb-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          Historial de Reservas
        </h2>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="Reserva lista">Reserva lista</option>
            <option value="Reserva terminada">Reserva terminada</option>
            <option value="Aún no lista">Aún no lista</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todos">Todos los servicios</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
          </select>

          <select
            value={filtroMesa}
            onChange={(e) => setFiltroMesa(e.target.value)}
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todas">Todas las mesas</option>
            {mesasUnicas.map((mesa) => (
              <option key={mesa} value={mesa}>
                {mesa}
              </option>
            ))}
          </select>

          {/* Botón de orden con mismo estilo */}
          <button
            onClick={() =>
              setOrden((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-black dark:text-white"
          >
            Orden:{" "}
            {orden === "desc"
              ? "Más recientes primero"
              : "Más antiguas primero"}
          </button>
        </div>

        {/* Resultado vacío */}
        {reservasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/90 dark:bg-black/60 rounded-lg w-full max-w-2xl mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mt-4">
              No hay reservas
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              No se encontraron reservas con esos filtros.
            </p>
          </div>
        ) : (
          <>
            {/* Vista móvil */}
            <div className="block sm:hidden space-y-4">
              {reservasFiltradas.map((reserva) => {
                const estadoTexto = getEstadoTexto(reserva);
                return (
                  <div
                    key={reserva.id}
                    className="bg-white/90 dark:bg-black/60 rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{reserva.tipo}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {reserva.fecha} - {reserva.hora}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getEstadoColor(
                          estadoTexto
                        )}`}
                      >
                        {estadoTexto}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>
                        <span className="font-medium">Personas:</span>{" "}
                        {reserva.personas}
                      </p>
                      <p>
                        <span className="font-medium">Mesa:</span>{" "}
                        {reserva.mesa || "No asignada"}
                      </p>
                      {reserva.comentario && (
                        <p className="mt-1 truncate">
                          <span className="font-medium">Comentario:</span>{" "}
                          {reserva.comentario}
                        </p>
                      )}
                    </div>
                    {["pendiente", "confirmada"].includes(reserva.estado) && (
                      <button
                        onClick={() => cancelarReserva(reserva.id)}
                        className="mt-3 text-red-600 underline text-sm hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Cancelar reserva
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Vista escritorio */}
            <div className="hidden sm:block overflow-x-auto mt-4">
              <table className="w-full min-w-[800px] divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Personas
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Hora
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Comentario
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Mesa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-600 bg-white/90 dark:bg-black/60">
                  {reservasFiltradas.map((reserva) => {
                    const estadoTexto = getEstadoTexto(reserva);
                    return (
                      <tr
                        key={reserva.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-sm">{reserva.tipo}</td>
                        <td className="px-4 py-3 text-sm">
                          {reserva.personas}
                        </td>
                        <td className="px-4 py-3 text-sm">{reserva.fecha}</td>
                        <td className="px-4 py-3 text-sm">{reserva.hora}</td>
                        <td className="px-4 py-3 text-sm">
                          {reserva.comentario || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {reserva.mesa || "No asignada"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(
                              estadoTexto
                            )}`}
                          >
                            {estadoTexto}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {["pendiente", "confirmada"].includes(
                            reserva.estado
                          ) ? (
                            <button
                              onClick={() => cancelarReserva(reserva.id)}
                              className="text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Cancelar
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Fondo>
  );
}

export default HistorialReservas;
