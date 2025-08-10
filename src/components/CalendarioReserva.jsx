import { useState, useEffect } from "react";

// Calendario interactivo para seleccionar una fecha
function CalendarioReserva({ fecha, setFecha, reservas = [], tipo }) {
  const hoy = new Date();
  const TOTAL_MESAS = 6;

  const [mesActual, setMesActual] = useState(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  );

  const diasSemana = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

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

  const formatear = (date) => date.toISOString().split("T")[0];

  const obtenerFechasCompletamenteReservadas = () => {
    const mapa = new Map();

    reservas.forEach((r) => {
      if (r.tipo !== tipo || r.estado !== "confirmada") return;

      if (!mapa.has(r.fecha)) {
        mapa.set(r.fecha, new Map());
      }

      const mapaHoras = mapa.get(r.fecha);
      if (!mapaHoras.has(r.hora)) {
        mapaHoras.set(r.hora, new Set());
      }

      mapaHoras.get(r.hora).add(r.mesa);
    });

    const bloqueadas = new Set();

    for (const [fecha, horasMap] of mapa.entries()) {
      let todasLasHorasLlenas = true;

      for (const hora of horasEsperadas) {
        const mesasEnHora = horasMap.get(hora);
        if (!mesasEnHora || mesasEnHora.size < TOTAL_MESAS) {
          todasLasHorasLlenas = false;
          break;
        }
      }

      if (todasLasHorasLlenas) {
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

  // 📌 Función para saber si una fecha ya pasó
  const esFechaPasada = (date) => {
    if (!date) return false;
    const soloFecha = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const soloHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return soloFecha < soloHoy;
  };

  const cambiarMes = (inc) => {
    const nuevo = new Date(
      mesActual.getFullYear(),
      mesActual.getMonth() + inc,
      1
    );
    setMesActual(nuevo);
  };

  const diasDisponibles = dias.filter(
    (d) => d && !fechasBloqueadas.has(formatear(d)) && !esFechaPasada(d)
  ).length;

  return (
    <div className="text-center bg-white/10 dark:bg-black/60 backdrop-blur-sm p-4 rounded-lg w-1/2">
      {/* Encabezado */}
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
          const isDisabled =
            day &&
            (fechasBloqueadas.has(formatear(day)) || esFechaPasada(day));

          return (
            <div
              key={i}
              title={isDisabled ? "No disponible" : ""}
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

      {/* Contador */}
      <p className="mt-3 text-xs sm:text-sm text-white/80">
        Días disponibles este mes:{" "}
        <span className="font-semibold">{diasDisponibles}</span> de{" "}
        <span className="font-semibold">
          {dias.filter((d) => d !== null).length}
        </span>
      </p>
    </div>
  );
}

export default CalendarioReserva;
