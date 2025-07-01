import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo";
import Boton from "../../components/Boton";
import BarraUsuario from "../../components/BarraUsuario";

// Vista de calendario que muestra las reservas del mes para el administrador
function CalendarioReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]); // Todas las reservas almacenadas
  const [mesActual, setMesActual] = useState(new Date()); // Fecha base para el calendario (mes actual)

  // Carga las reservas desde localStorage y actualiza cada 3 segundos
  useEffect(() => {
    const cargarReservas = () => {
      const datos = JSON.parse(localStorage.getItem("reservas")) || [];
      setReservas(datos);
    };

    cargarReservas(); // Primera carga al montar
    const intervalo = setInterval(cargarReservas, 3000); // Actualización periódica
    return () => clearInterval(intervalo); // Limpieza del intervalo
  }, []);

  // Cambia el mes actual del calendario hacia adelante o atrás
  const cambiarMes = (delta) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + delta);
    setMesActual(nuevoMes);
  };

  // Genera una lista de días (incluyendo espacios vacíos para días previos al primer día del mes)
  const obtenerDiasDelMes = () => {
    const anio = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const dias = [];

    const inicio = primerDia.getDay(); // Día de la semana (0=Domingo)
    for (let i = 0; i < inicio; i++) dias.push(null); // Espacios vacíos antes del primer día

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(anio, mes, d)); // Agrega los días del mes
    }
    return dias;
  };

  // Mapeo de estado → color para las reservas
  const estadoColor = {
    pendiente: "bg-yellow-400",
    confirmada: "bg-green-500",
    completada: "bg-blue-500",
    cancelada: "bg-red-500",
    "cancelada por el cliente": "bg-red-500",
  };

  // Filtra reservas correspondientes a una fecha específica
  const obtenerReservasDelDia = (fecha) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return reservas.filter((r) => r.fecha === fechaStr);
  };

  const dias = obtenerDiasDelMes(); // Días renderizados para el calendario

  return (
    <Fondo imageUrl="/fondo.webp">
      <BarraUsuario mostrarVolver /> {/* ✅ Vuelve al panel admin y tiene cerrar sesión */}

      {/* Contenido central del calendario */}
      <div className="max-w-5xl mx-auto p-4 sm:px-6 md:px-10 py-24">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Calendario de Reservas
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          {mesActual.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {/* Leyenda con colores por estado */}
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-400" />
            <span className="text-sm">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm">Completada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm">Cancelada</span>
          </div>
        </div>

        {/* Botones para cambiar el mes mostrado */}
        <div className="flex justify-between items-center mb-4 gap-4">
          <Boton texto="Mes anterior" onClickOverride={() => cambiarMes(-1)} />
          <Boton texto="Mes siguiente" onClickOverride={() => cambiarMes(1)} />
        </div>

        {/* Cuadrícula del calendario con días y reservas */}
        <div className="grid grid-cols-7 gap-2 bg-white dark:bg-black/40 p-4 rounded-lg shadow">
          {/* Encabezados de días de la semana */}
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
            <div
              key={d}
              className="text-sm font-semibold text-center text-gray-700 dark:text-gray-200"
            >
              {d}
            </div>
          ))}

          {/* Celdas del calendario por día */}
          {dias.map((dia, i) => {
            if (!dia) {
              // Espacio vacío para días anteriores al primer día del mes
              return <div key={i} className="h-20" />;
            }

            const reservasDelDia = obtenerReservasDelDia(dia);

            return (
              <div
                key={i}
                className="h-28 border rounded p-1 flex flex-col text-xs overflow-hidden bg-gray-50 dark:bg-gray-800"
              >
                {/* Número del día */}
                <div className="font-semibold text-right text-gray-800 dark:text-gray-200">
                  {dia.getDate()}
                </div>

                {/* Lista de reservas para el día */}
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
