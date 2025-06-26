import { useState, useEffect } from "react";

// Calendario interactivo para seleccionar una fecha,
// deshabilita las que estén completamente ocupadas (según el tipo y hora)
function CalendarioReserva({ fecha, setFecha, reservas = [], tipo }) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  );

  const diasSemana = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Horarios disponibles según tipo
  const obtenerHorasDisponibles = () => {
    if (tipo === "almuerzo") {
      return Array.from({ length: 6 }, (_, i) => `${11 + i}:00`);
    }
    if (tipo === "cena") {
      return Array.from({ length: 6 }, (_, i) => `${18 + i}:00`);
    }
    return [];
  };

  const horasEsperadas = obtenerHorasDisponibles();

  // Días del mes actual para renderizar
  const obtenerDiasDelMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);

    const dias = [];
    const offset = (primerDia.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) dias.push(null);
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(year, month, d));
    }
    return dias;
  };

  // Formatea fecha a yyyy-mm-dd
  const formatear = (date) => date.toISOString().split("T")[0];

  // Devuelve un Set de fechas que están completamente ocupadas
  const obtenerFechasCompletamenteReservadas = () => {
    const mapa = new Map();

    reservas.forEach((r) => {
      if (r.tipo !== tipo) return;
      if (!mapa.has(r.fecha)) mapa.set(r.fecha, new Set());
      mapa.get(r.fecha).add(r.hora);
    });

    const bloqueadas = new Set();
    for (const [fecha, horas] of mapa) {
      if (horasEsperadas.every((h) => horas.has(h))) {
        bloqueadas.add(fecha);
      }
    }

    return bloqueadas;
  };

  const fechasBloqueadas = obtenerFechasCompletamenteReservadas();
  const dias = obtenerDiasDelMes();

  const esHoy = (date) =>
    date.getDate() === hoy.getDate() &&
    date.getMonth() === hoy.getMonth() &&
    date.getFullYear() === hoy.getFullYear();

  const cambiarMes = (inc) => {
    const nuevo = new Date(
      mesActual.getFullYear(),
      mesActual.getMonth() + inc,
      1
    );
    setMesActual(nuevo);
  };

  return (
    <div className="text-center bg-white/10 dark:bg-black/60 backdrop-blur-sm p-4 rounded-lg">
      {/* Encabezado del mes */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button
          onClick={() => cambiarMes(-1)}
          className="text-white px-2 py-1 rounded hover:bg-white/20 text-sm sm:text-base"
        >
          &lt;
        </button>
        <h3 className="text-base sm:text-lg font-semibold">
          {mesActual.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => cambiarMes(1)}
          className="text-white px-2 py-1 rounded hover:bg-white/20 text-sm sm:text-base"
        >
          &gt;
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-xs sm:text-sm mb-2 font-semibold">
        {diasSemana.map((dia) => (
          <div key={dia}>{dia}</div>
        ))}
      </div>

      {/* Celdas del calendario */}
      <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
        {dias.map((day, i) => {
          const isSelected = fecha?.toDateString() === day?.toDateString();
          const isDisabled = day && fechasBloqueadas.has(formatear(day));

          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded-full cursor-pointer transition
                ${
                  !day
                    ? ""
                    : isDisabled
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : esHoy(day)
                    ? "border border-green-400"
                    : "hover:bg-white/20"
                }`}
              onClick={() =>
                day && !isDisabled && setFecha(new Date(day))
              }
            >
              {day ? day.getDate() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarioReserva;
