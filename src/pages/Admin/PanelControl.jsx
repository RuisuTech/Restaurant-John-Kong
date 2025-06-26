import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import ToggleTema from "../../components/ToggleTema";
import Boton from "../../components/Boton";

// Panel principal del administrador para gestionar reservas (hoy y futuras)
function PanelControl() {
  const [reservas, setReservas] = useState([]); // Todas las reservas
  const navigate = useNavigate(); // Navegación entre rutas

  // Al montar el componente, se cargan las reservas y se actualizan cada 3 segundos
  useEffect(() => {
    const cargarReservas = () => {
      const datos = JSON.parse(localStorage.getItem("reservas")) || [];
      setReservas(datos);
    };

    cargarReservas(); // Primera carga inicial
    const intervalo = setInterval(cargarReservas, 3000); // Actualización periódica
    return () => clearInterval(intervalo); // Limpieza del intervalo
  }, []);

  // Actualiza el estado de una reserva en memoria y localStorage
  const actualizarReserva = (id, nuevoEstado) => {
    const nuevas = reservas.map((r) =>
      r.id === id ? { ...r, estado: nuevoEstado } : r
    );
    setReservas(nuevas);
    localStorage.setItem("reservas", JSON.stringify(nuevas));
  };

  // Cálculo de estadísticas para los cuadros resumen
  const resumen = {
    hoy: reservas.filter(
      (r) => r.fecha === new Date().toISOString().split("T")[0]
    ).length,
    completadas: reservas.filter((r) => r.estado === "completada").length,
    pendientes: reservas.filter((r) => r.estado === "pendiente").length,
    canceladas: reservas.filter(
      (r) => r.estado === "cancelada" || r.estado === "cancelada por el cliente"
    ).length,
  };

  const hoy = new Date().toISOString().split("T")[0];

  // Filtra reservas para hoy y para fechas futuras
  const reservasHoy = reservas.filter((r) => r.fecha === hoy);
  const proximas = reservas.filter((r) => r.fecha > hoy);

  // Muestra botones u estado textual dependiendo del estado actual de la reserva
  const renderEstado = (reserva) => {
    const acciones = [];

    if (!reserva.estado || reserva.estado === "pendiente") {
      acciones.push(
        <Boton
          key="aceptar"
          texto="Aceptar"
          onClickOverride={() => actualizarReserva(reserva.id, "confirmada")}
          bgColor="bg-green-600"
          textColor="text-white"
        />
      );
      acciones.push(
        <Boton
          key="cancelar"
          texto="Cancelar"
          onClickOverride={() => actualizarReserva(reserva.id, "cancelada")}
          bgColor="bg-red-600"
          textColor="text-white"
        />
      );
    } else if (reserva.estado === "confirmada") {
      acciones.push(
        <Boton
          key="completar"
          texto="Completar"
          onClickOverride={() => actualizarReserva(reserva.id, "completada")}
          bgColor="bg-blue-600"
          textColor="text-white"
        />
      );
      acciones.push(
        <Boton
          key="cancelar"
          texto="Cancelar"
          onClickOverride={() => actualizarReserva(reserva.id, "cancelada")}
          bgColor="bg-red-600"
          textColor="text-white"
        />
      );
    } else if (reserva.estado === "completada") {
      acciones.push(
        <span className="text-green-600 font-semibold dark:text-green-400">
          Completada
        </span>
      );
    } else if (
      reserva.estado === "cancelada" ||
      reserva.estado === "cancelada por el cliente"
    ) {
      acciones.push(
        <span className="text-red-600 font-semibold dark:text-red-400">
          Cancelada
        </span>
      );
    }

    return <div className="flex gap-2 flex-wrap">{acciones}</div>;
  };

  return (
    <Fondo imageUrl="/fondo.webp">
      {/* Botón de volver a la vista del administrador */}
      <div className="fixed top-4 left-4 z-50">
        <Boton
          texto="Volver"
          onClickOverride={() => navigate("/admin")}
          bgColor="bg-emerald-600"
          textColor="text-white"
        />
      </div>

      {/* Alternador de tema claro/oscuro */}
      <div className="fixed top-4 right-4 z-50">
        <ToggleTema />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-24">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Panel de Control
        </h1>

        {/* Cuadros con estadísticas resumidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-indigo-600 text-white rounded-xl p-4 text-center">
            <h2 className="text-lg font-semibold">Hoy</h2>
            <p className="text-2xl font-bold">{resumen.hoy}</p>
          </div>
          <div className="bg-green-600 text-white rounded-xl p-4 text-center">
            <h2 className="text-lg font-semibold">Completadas</h2>
            <p className="text-2xl font-bold">{resumen.completadas}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-xl p-4 text-center">
            <h2 className="text-lg font-semibold">Pendientes</h2>
            <p className="text-2xl font-bold">{resumen.pendientes}</p>
          </div>
          <div className="bg-red-500 text-white rounded-xl p-4 text-center">
            <h2 className="text-lg font-semibold">Canceladas</h2>
            <p className="text-2xl font-bold">{resumen.canceladas}</p>
          </div>
        </div>

        {/* Tabla con reservas del día actual */}
        <h2 className="text-xl font-bold mb-2">Reservas de hoy</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Personas</th>
                <th className="px-4 py-2">Comentario</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black/60 divide-y divide-gray-300 dark:divide-gray-600">
              {reservasHoy.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.usuario.nombre}</td>
                  <td className="px-4 py-2">{r.hora}</td>
                  <td className="px-4 py-2">{r.personas}</td>
                  <td className="px-4 py-2">{r.comentario || "-"}</td>
                  <td className="px-4 py-2">{renderEstado(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla con próximas reservas */}
        <h2 className="text-xl font-bold mb-2">Próximas reservas</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Personas</th>
                <th className="px-4 py-2">Comentario</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black/60 divide-y divide-gray-300 dark:divide-gray-600">
              {proximas.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.fecha}</td>
                  <td className="px-4 py-2">{r.usuario.nombre}</td>
                  <td className="px-4 py-2">{r.hora}</td>
                  <td className="px-4 py-2">{r.personas}</td>
                  <td className="px-4 py-2">{r.comentario || "-"}</td>
                  <td className="px-4 py-2">{renderEstado(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fondo>
  );
}

export default PanelControl;
