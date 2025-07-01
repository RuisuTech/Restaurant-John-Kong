import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import BarraUsuario from "../../components/BarraUsuario";

function HistorialReservas() {
  const [reservasUsuario, setReservasUsuario] = useState([]); // Estado para guardar solo las reservas del usuario
  const navigate = useNavigate(); // Hook para redireccionar

  useEffect(() => {
    // Verificamos si el usuario está autenticado
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/login"); // Si no hay usuario, redirige al login
      return;
    }

    // Función que carga las reservas desde localStorage
    const cargarReservas = () => {
      const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
      const delUsuario = reservas.filter(
        (r) => r.usuario?.correo === usuario.correo
      );
      setReservasUsuario(delUsuario); // Filtra solo las del usuario actual
    };

    cargarReservas(); // Primera carga al montar el componente
    const intervalo = setInterval(cargarReservas, 3000); // Actualiza cada 3 segundos (auto-refresh)
    return () => clearInterval(intervalo); // Limpia el intervalo cuando el componente se desmonta
  }, [navigate]);

  // Función para mostrar un estado amigable al cliente
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

    return "Aún no lista"; // Estado por defecto para "pendiente"
  };

  // Función que devuelve las clases de estilo CSS según el estado textual
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

  // Permite al usuario cancelar su reserva
  const cancelarReserva = (id) => {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    // Cambia el estado de la reserva si coincide el ID
    const actualizadas = reservas.map((r) =>
      r.id === id ? { ...r, estado: "cancelada por el cliente" } : r
    );

    localStorage.setItem("reservas", JSON.stringify(actualizadas));

    // Actualiza la lista visible al usuario
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    setReservasUsuario(
      actualizadas.filter((r) => r.usuario?.correo === usuario.correo)
    );
  };

  return (
    <Fondo imageUrl="/fondo.webp" className="px-0">
      <BarraUsuario mostrarVolver />

      {/* Contenedor principal del historial */}
      <div className="w-full min-h-screen pt-20 pb-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          Historial de Reservas
        </h2>

        {/* Mostrar mensaje si no hay reservas */}
        {reservasUsuario.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/90 dark:bg-black/60 rounded-lg w-full max-w-2xl mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-base sm:text-lg font-semibold mt-4">
              No hay reservas
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              No se encontraron reservas realizadas.
            </p>
          </div>
        ) : (
          <>
            {/* Vista móvil - tarjetas por reserva */}
            <div className="block sm:hidden space-y-4">
              {reservasUsuario.map((reserva, i) => {
                const estadoTexto = getEstadoTexto(reserva);
                return (
                  <div
                    key={i}
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
                      {reserva.comentario && (
                        <p className="mt-1 truncate">
                          <span className="font-medium">Comentario:</span>{" "}
                          {reserva.comentario}
                        </p>
                      )}
                    </div>
                    {/* Botón para cancelar, solo si la reserva está pendiente o confirmada */}
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

            {/* Vista de escritorio - tabla */}
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
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-600 bg-white/90 dark:bg-black/60">
                  {reservasUsuario.map((reserva, i) => {
                    const estadoTexto = getEstadoTexto(reserva);
                    return (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {reserva.tipo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {reserva.personas}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {reserva.fecha}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {reserva.hora}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-[200px] truncate">
                          {reserva.comentario || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(
                              estadoTexto
                            )}`}
                          >
                            {estadoTexto}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {/* Solo permitir cancelar si aún está activa */}
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
                            "-" // Sin acción para reservas ya terminadas o canceladas
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
