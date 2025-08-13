// PanelControl.jsx
import { useEffect, useState } from "react";
import Fondo from "../../components/Fondo";
import ToggleTema from "../../components/ToggleTema";
import Boton from "../../components/Boton";
import BarraUsuario from "../../components/BarraUsuario";
import { obtenerReservas, actualizarReserva } from "../../utils/api";

function PanelControl() {
  const [reservas, setReservas] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await obtenerReservas();
        setReservas(r);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
    };

    cargar(); // Solo se ejecuta una vez al montar el componente
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const actualizada = await actualizarReserva(id, { estado: nuevoEstado });
      setReservas((prev) => prev.map((r) => (r.id === id ? actualizada : r)));
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      alert("No se pudo actualizar la reserva.");
    }
  };

  const hoy = new Date().toISOString().split("T")[0];

  const resumen = {
    hoy: reservas.filter((r) => r.fecha === hoy).length,
    completadas: reservas.filter((r) => r.estado === "completada").length,
    pendientes: reservas.filter((r) => r.estado === "pendiente").length,
    canceladas: reservas.filter(
      (r) => r.estado === "cancelada" || r.estado === "cancelada por el cliente"
    ).length,
  };

  const reservasHoy = reservas.filter((r) => r.fecha === hoy);
  const proximas = reservas.filter((r) => r.fecha > hoy);
  const anteriores = reservas.filter((r) => r.fecha < hoy);

  const aplicarFiltros = (lista) =>
    lista.filter(
      (r) =>
        (estadoFiltro === "todas" || r.estado === estadoFiltro) &&
        (!fechaFiltro || r.fecha === fechaFiltro) &&
        (!busquedaUsuario ||
          r.usuario?.nombre?.toLowerCase().includes(busquedaUsuario))
    );

  const renderEstado = (reserva) => {
    const acciones = [];
    const id = reserva.id;

    if (!reserva.estado || reserva.estado === "pendiente") {
      acciones.push(
        <Boton
          key={`aceptar-${id}`}
          texto="Aceptar"
          onClickOverride={() => cambiarEstado(id, "confirmada")}
          bgColor="bg-green-600"
          textColor="text-white"
        />,
        <Boton
          key={`cancelar-${id}`}
          texto="Cancelar"
          onClickOverride={() => cambiarEstado(id, "cancelada")}
          bgColor="bg-red-600"
          textColor="text-white"
        />
      );
    } else if (reserva.estado === "confirmada") {
      acciones.push(
        <Boton
          key={`completar-${id}`}
          texto="Completar"
          onClickOverride={() => cambiarEstado(id, "completada")}
          bgColor="bg-blue-600"
          textColor="text-white"
        />,
        <Boton
          key={`cancelar-confirmada-${id}`}
          texto="Cancelar"
          onClickOverride={() => cambiarEstado(id, "cancelada")}
          bgColor="bg-red-600"
          textColor="text-white"
        />
      );
    } else if (reserva.estado === "completada") {
      acciones.push(
        <span
          key={`estado-completada-${id}`}
          className="text-green-600 font-semibold dark:text-green-400"
        >
          Completada
        </span>
      );
    } else if (
      reserva.estado === "cancelada" ||
      reserva.estado === "cancelada por el cliente"
    ) {
      acciones.push(
        <span
          key={`estado-cancelada-${id}`}
          className="text-red-600 font-semibold dark:text-red-400"
        >
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
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Panel de Control
        </h1>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Object.entries(resumen).map(([k, v]) => (
            <div
              key={k}
              className={`rounded-xl p-2 md:p-4 text-center text-white ${
                {
                  hoy: "bg-indigo-600",
                  completadas: "bg-green-600",
                  pendientes: "bg-yellow-500",
                  canceladas: "bg-red-500",
                }[k]
              }`}
            >
              <h2 className="md:text-lg font-semibold capitalize">{k}</h2>
              <p className="md:text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-8 shadow-md w-full max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <div className="flex flex-col">
              <label
                htmlFor="filtro-usuario"
                className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200"
              >
                Buscar por cliente:
              </label>
              <input
                type="text"
                id="filtro-usuario"
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800"
                value={busquedaUsuario}
                onChange={(e) =>
                  setBusquedaUsuario(e.target.value.toLowerCase())
                }
              />
            </div>

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
              <th className="px-4 py-2">Mesa</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Fecha Confirmación</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black/60 divide-y divide-gray-300 dark:divide-gray-600">
            {lista.map((r, index) => {
              const key = r.id || `${r.fecha}-${r.hora}-${index}`;
              return (
                <tr key={key}>
                  <td className="px-4 py-2">{r.fecha}</td>
                  <td className="px-4 py-2">
                    {r.usuario?.nombre || "Desconocido"}
                  </td>
                  <td className="px-4 py-2">{r.hora}</td>
                  <td className="px-4 py-2">{r.personas}</td>
                  <td className="px-4 py-2">{r.comentario || "-"}</td>
                  <td className="px-4 py-2">{renderEstado(r)}</td>
                  <td className="px-4 py-2">{r.mesa}</td>
                  <td className="px-4 py-2 capitalize">{r.tipo || "-"}</td>
                  <td className="px-4 py-2 capitalize">{r.estado}</td>
                  <td className="px-4 py-2">
                    {r.fechaConfirmacion?.split("T")[0] || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PanelControl;
