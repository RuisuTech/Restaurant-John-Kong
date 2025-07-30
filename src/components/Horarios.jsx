import { useEffect, useState } from "react";

function Horarios({
  tipo,
  fecha,
  reservas = [],
  onSelect,
  columnas = 3,
  horasDisponibles = [],
  conteoMesasPorHora = {}, // <-- nuevo prop
}) {
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    setSeleccionado(null); // Limpiar cuando cambia fecha o tipo
  }, [tipo, fecha]);

  const seleccionarHora = (hora) => {
    const ocupadas = conteoMesasPorHora[hora] || 0;
    const todasMesasOcupadas = ocupadas >= 6;

    if (!todasMesasOcupadas) {
      setSeleccionado(hora);
      onSelect?.(hora);
    }
  };

  return (
    <div className="w-full mt-2 px-2 sm:px-4 md:px-6 lg:px-8">
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columnas} gap-2 justify-center`}
      >
        {horasDisponibles.map((hora) => {
          const ocupadas = conteoMesasPorHora[hora] || 0;
          const todasMesasOcupadas = ocupadas >= 6;
          const esActivo = seleccionado === hora;

          let clases = `px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-center transition `;

          if (todasMesasOcupadas) {
            clases += "bg-red-600 text-white cursor-not-allowed";
          } else if (esActivo) {
            clases += "bg-green-400 text-black";
          } else {
            clases += "bg-green-700 hover:bg-green-600 text-white cursor-pointer";
          }

          return (
            <div
              key={hora}
              className={clases}
              onClick={() => seleccionarHora(hora)}
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
