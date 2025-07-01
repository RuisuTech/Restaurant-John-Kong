// PanelControl.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import ToggleTema from "../../components/ToggleTema";
import Boton from "../../components/Boton";
import BarraUsuario from "../../components/BarraUsuario";

function PanelControl() {
  const [reservas, setReservas] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarReservas = () => {
      const datos = JSON.parse(localStorage.getItem("reservas")) || [];
      setReservas(datos);
    };
    cargarReservas();
    const intervalo = setInterval(cargarReservas, 3000);
    return () => clearInterval(intervalo);
  }, []);

  const actualizarReserva = (id, nuevoEstado) => {
    const nuevas = reservas.map((r) =>
      r.id === id ? { ...r, estado: nuevoEstado } : r
    );
    setReservas(nuevas);
    localStorage.setItem("reservas", JSON.stringify(nuevas));
  };

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

  const reservasHoy = reservas.filter((r) => r.fecha === hoy);
  const proximas = reservas.filter((r) => r.fecha > hoy);
  const anteriores = reservas.filter((r) => r.fecha < hoy);

  const aplicarFiltros = (lista) => {
    return lista.filter((r) => {
      const coincideEstado =
        estadoFiltro === "todas" || r.estado === estadoFiltro;
      const coincideFecha = !fechaFiltro || r.fecha === fechaFiltro;
      return coincideEstado && coincideFecha;
    });
  };

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
      <BarraUsuario mostrarVolver />

      <div className="fixed top-4 right-4 z-50">
        <ToggleTema />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-24">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Panel de Control
        </h1>

        {/* Resumen */}
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

        {/* Filtros*/}
        <div className="bg-white/80 dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-8 shadow-md w-full max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Filtro de fecha */}
            <div className="flex flex-col">
              <label
                htmlFor="filtro-fecha"
                className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
              >
                Filtrar por fecha:
              </label>
              <input
                id="filtro-fecha"
                type="date"
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>

            {/* Filtro de estado */}
            <div className="flex flex-col">
              <label
                htmlFor="filtro-estado"
                className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
              >
                Filtrar por estado:
              </label>
              <select
                id="filtro-estado"
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="todas">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
                <option value="cancelada por el cliente">
                  Cancelada por el cliente
                </option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="flex flex-col sm:mt-6">
              <button
                onClick={() => {
                  setFechaFiltro("");
                  setEstadoFiltro("todas");
                }}
                className="mt-4 sm:mt-0 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-black dark:text-white transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tablas */}
        <SeccionTabla
          titulo="Reservas de hoy"
          lista={aplicarFiltros(reservasHoy)}
          renderEstado={renderEstado}
        />
        <SeccionTabla
          titulo="Próximas reservas"
          lista={aplicarFiltros(proximas)}
          renderEstado={renderEstado}
        />
        <SeccionTabla
          titulo="Reservas anteriores"
          lista={aplicarFiltros(anteriores)}
          renderEstado={renderEstado}
        />
      </div>
    </Fondo>
  );
}

function SeccionTabla({ titulo, lista, renderEstado }) {
  if (lista.length === 0) return null;

  return (
    <>
      <h2 className="text-xl font-bold mb-2">{titulo}</h2>
      <div className="overflow-x-auto mb-10">
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
            {lista.map((r, index) => (
              <tr key={r.id || index}>
                <td className="px-4 py-2">{r.fecha}</td>
                <td className="px-4 py-2">
                  {r.usuario?.nombre || "Desconocido"}
                </td>
                <td className="px-4 py-2">{r.hora}</td>
                <td className="px-4 py-2">{r.personas}</td>
                <td className="px-4 py-2">{r.comentario || "-"}</td>
                <td className="px-4 py-2">{renderEstado(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PanelControl;
