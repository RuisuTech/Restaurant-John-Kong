import { useEffect, useState } from "react";
import Fondo from "../../components/layout/Fondo";
import Boton from "../../components/ui/Boton";
import BarraUsuario from "../../components/layout/BarraUsuario";
import { obtenerReservas } from "../../utils/api";

function CalendarioReservas() {
  const [reservas, setReservas] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await obtenerReservas();
        setReservas(data);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
    const intervalo = setInterval(cargarReservas, 3000);
    return () => clearInterval(intervalo);
  }, []);

  const cambiarMes = (delta) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + delta);
    setMesActual(nuevoMes);
  };

  const obtenerDiasDelMes = () => {
    const anio = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const dias = [];

    const inicio = primerDia.getDay();
    for (let i = 0; i < inicio; i++) dias.push(null);
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(anio, mes, d));
    }

    return dias;
  };

  const obtenerReservasDelDia = (fecha) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return reservas.filter((r) => r.fecha === fechaStr);
  };

  const estadoColor = {
    pendiente: "bg-yellow-400",
    confirmada: "bg-green-500",
    completada: "bg-blue-500",
    cancelada: "bg-red-500",
    "cancelada por el cliente": "bg-red-500",
  };

  const dias = obtenerDiasDelMes();

  if (cargando) {
    return (
      <Fondo imageUrl="/fondo.webp">
        <BarraUsuario mostrarVolver />
        <div className="min-h-screen pt-20 flex justify-center items-center">
          <p className="text-white text-lg">Cargando calendario...</p>
        </div>
      </Fondo>
    );
  }

  return (
    <Fondo imageUrl="/fondo.webp">
      <BarraUsuario mostrarVolver />

      <div className="max-w-5xl mx-auto p-4 sm:px-6 md:px-10 py-24">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">
          Calendario de Reservas
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-white">
          {mesActual.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex justify-center gap-4 mb-4 flex-wrap text-white">
          {["Pendiente", "Confirmada", "Completada", "Cancelada"].map(
            (estado, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded ${
                    estadoColor[estado.toLowerCase()] || "bg-gray-400"
                  }`}
                />
                <span className="text-sm">{estado}</span>
              </div>
            )
          )}
        </div>

        <div className="flex justify-between items-center mb-4 gap-4">
          <Boton texto="Mes anterior" onClickOverride={() => cambiarMes(-1)} />
          <Boton texto="Mes siguiente" onClickOverride={() => cambiarMes(1)} />
        </div>

        <div className="grid grid-cols-7 gap-2 bg-white dark:bg-black/40 p-4 rounded-lg shadow">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
            <div
              key={d}
              className="text-sm font-semibold text-center text-gray-700 dark:text-gray-200"
            >
              {d}
            </div>
          ))}

          {dias.map((dia, i) => {
            if (!dia) return <div key={i} className="h-20" />;

            const reservasDelDia = obtenerReservasDelDia(dia);

            return (
              <div
                key={i}
                className="h-28 border rounded p-1 flex flex-col text-xs overflow-hidden bg-gray-50 dark:bg-gray-800"
              >
                <div className="font-semibold text-right text-gray-800 dark:text-gray-200">
                  {dia.getDate()}
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 mt-1">
                  {reservasDelDia.map((r, idx) => (
                    <div
                      key={idx}
                      className={`w-full text-white rounded px-1 truncate ${
                        estadoColor[r.estado] || "bg-gray-300"
                      }`}
                      title={`${r.tipo} - ${r.hora}`}
                    >
                      {r.tipo} ({r.hora})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Fondo>
  );
}

export default CalendarioReservas;
