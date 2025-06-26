import { useEffect, useState } from "react";

function Horarios({ tipo, fecha, reservas = [], onSelect, columnas = 3, horasDisponibles = [] }) {
  const [ocupados, setOcupados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    if (fecha) {
      const fechaStr = fecha.toISOString().split("T")[0];
      const bloqueados = reservas
        .filter((r) => r.fecha === fechaStr)
        .map((r) => r.hora);
      setOcupados(bloqueados);
      setSeleccionado(null);
    } else {
      setOcupados([]);
    }
  }, [tipo, fecha, reservas]);

  const seleccionarHora = (hora) => {
    if (!ocupados.includes(hora)) {
      setSeleccionado(hora);
      onSelect?.(hora);
    }
  };

  const horarios = horasDisponibles;

  return (
    <div className="w-full mt-2 px-2 sm:px-4 md:px-6 lg:px-8">
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columnas} gap-2 justify-center`}
      >
        {horarios.map((hora) => {
          const esOcupado = ocupados.includes(hora);
          const esActivo = seleccionado === hora;

          const clases = `px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white text-center transition
            ${esOcupado ? "bg-red-600 cursor-not-allowed" : ""}
            ${esActivo ? "bg-green-400 text-black" : ""}
            ${
              !esOcupado && !esActivo
                ? "bg-green-700 hover:bg-green-600 cursor-pointer"
                : ""
            }`;

          return (
            <div
              key={hora}
              className={clases}
              onClick={() => !esOcupado && seleccionarHora(hora)}
            >
              {hora}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Horarios;
