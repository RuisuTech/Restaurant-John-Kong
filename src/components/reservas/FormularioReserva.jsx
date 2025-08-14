import { useMemo } from "react";

import CalendarioReserva from "../layout/CalendarioReserva";
import Horarios from "../reservas/Horarios";
import Boton from "../ui/Boton";

function FormularioReserva({
  // Estados del formulario
  tipo,
  setTipo,
  personas,
  setPersonas,
  personalizado,
  setPersonalizado,
  fechaSeleccionada,
  setFechaSeleccionada,
  horaSeleccionada,
  setHoraSeleccionada,
  mesaSeleccionada,
  setMesaSeleccionada,
  comentario,
  setComentario,
  reservas,
  
  // Handlers
  onSubmit,
  onCancel,
  
  // Configuración
  MESAS = ["M1", "M2", "M3", "M4", "M5", "M6"],
  submitButtonText = "Continuar",
  cancelButtonText = "Atrás"
}) {
  const TOTAL_MESAS = MESAS.length;

  // Funciones auxiliares memoizadas
  const horasBasePorTipo = useMemo(() => ({
    almuerzo: Array.from({ length: 6 }, (_, i) => `${11 + i}:00`),
    cena: Array.from({ length: 6 }, (_, i) => `${18 + i}:00`)
  }), []);

  // Conteo de reservas por hora optimizado
  const conteoReservasPorHora = useMemo(() => {
    if (!fechaSeleccionada) return {};
    
    const fechaStr = new Date(fechaSeleccionada).toISOString().split("T")[0];
    const conteo = {};
    
    reservas.forEach((r) => {
      if (
        r.fecha === fechaStr &&
        (r.estado === "confirmada" || r.estado === "pendiente")
      ) {
        if (!conteo[r.hora]) conteo[r.hora] = new Set();
        conteo[r.hora].add(r.mesa);
      }
    });
    
    // Convertir Sets a números
    Object.keys(conteo).forEach((hora) => {
      conteo[hora] = conteo[hora].size;
    });
    
    return conteo;
  }, [fechaSeleccionada, reservas]);

  // Obtener horas disponibles por tipo
  const obtenerHorasDisponibles = useMemo(() => {
    return (tipoServicio) => {
      if (!tipoServicio) return [];
      
      let horas = horasBasePorTipo[tipoServicio] || [];

      // Si es hoy, filtrar horas pasadas
      if (fechaSeleccionada) {
        const hoy = new Date();
        const hoySinHora = new Date(hoy);
        hoySinHora.setHours(0, 0, 0, 0);
        const fechaSinHora = new Date(fechaSeleccionada);
        fechaSinHora.setHours(0, 0, 0, 0);

        if (fechaSinHora.getTime() === hoySinHora.getTime()) {
          const horaActual = hoy.getHours();
          horas = horas.filter((h) => parseInt(h, 10) > horaActual);
        }
      }

      // Filtrar horas ocupadas
      return horas.filter((h) => (conteoReservasPorHora[h] || 0) < TOTAL_MESAS);
    };
  }, [fechaSeleccionada, conteoReservasPorHora, horasBasePorTipo, TOTAL_MESAS]);

  // Tipos disponibles para la fecha seleccionada
  const tiposDisponibles = useMemo(() => {
    if (!fechaSeleccionada) return ["almuerzo", "cena"];
    
    return ["almuerzo", "cena"].filter(
      (opcion) => obtenerHorasDisponibles(opcion).length > 0
    );
  }, [fechaSeleccionada, obtenerHorasDisponibles]);

  // Mesas ocupadas para la fecha y hora seleccionadas
  const mesasOcupadas = useMemo(() => {
    if (!fechaSeleccionada || !horaSeleccionada) return [];
    
    const fechaStr = new Date(fechaSeleccionada).toISOString().split("T")[0];
    return reservas
      .filter(
        (r) =>
          r.fecha === fechaStr &&
          r.hora === horaSeleccionada &&
          (r.estado === "confirmada" || r.estado === "pendiente")
      )
      .map((r) => r.mesa);
  }, [fechaSeleccionada, horaSeleccionada, reservas]);

  // Handlers internos
  const handleTipoChange = (nuevoTipo) => {
    if (tipo !== nuevoTipo) {
      setTipo(nuevoTipo);
      setHoraSeleccionada(null);
      setMesaSeleccionada(null);
    }
  };

  const handlePersonasChange = (cantidad) => {
    setPersonas(cantidad);
    setPersonalizado("");
  };

  const handlePersonalizadoChange = (e) => {
    const valor = e.target.value;
    if (!valor || (parseInt(valor, 10) >= 11 && parseInt(valor, 10) <= 20)) {
      setPersonalizado(valor);
      setPersonas(null);
    }
  };

  const handlePersonalizadoKeyDown = (e) => {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* Paso 1: Tipo */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">1. ¿Qué servicio deseas?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["almuerzo", "cena"].map((opcion) => {
            // Si hay fecha seleccionada, mostrar solo opciones disponibles
            if (fechaSeleccionada && !tiposDisponibles.includes(opcion)) {
              return null;
            }

            return (
              <Boton
                key={opcion}
                texto={opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                onClickOverride={() => handleTipoChange(opcion)}
                bgColor={tipo === opcion ? "bg-green-600" : "bg-white dark:bg-black/40"}
                textColor={tipo === opcion ? "text-white" : "text-black dark:text-white"}
                className="px-4 py-2 rounded-lg font-semibold"
              />
            );
          })}
        </div>

        {/* Mensaje si no hay tipos disponibles */}
        {fechaSeleccionada && tiposDisponibles.length === 0 && (
          <p className="text-center text-sm text-red-200">
            No hay servicios disponibles para la fecha seleccionada.
          </p>
        )}

        {/* Paso 2: Personas */}
        <h3 className="text-lg font-bold pt-2">
          2. ¿Cuántas personas vendrán? Límite de 20.
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePersonasChange(i + 1)}
              className={`w-10 h-10 rounded-full font-bold transition text-sm ${
                personas === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-black/40 text-black dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <input
            type="number"
            placeholder="+"
            min="11"
            max="20"
            step="1"
            className="w-10 h-10 rounded-full text-center font-bold bg-white dark:bg-black/40 text-black dark:text-white text-sm"
            value={personalizado}
            onChange={handlePersonalizadoChange}
            onKeyDown={handlePersonalizadoKeyDown}
          />
        </div>

        {/* Paso 3: Fecha */}
        <h3 className="text-lg font-bold pt-2">3. ¿Qué día vendrán?</h3>
      </div>

      {/* Calendario y horarios */}
      <div className="grid grid-cols-1 gap-6 justify-items-center">
        <CalendarioReserva
          fecha={fechaSeleccionada}
          setFecha={setFechaSeleccionada}
          fechasReservadas={reservas.map((r) => r.fecha)}
          reservas={reservas}
          tipo={tipo}
          minDate={new Date()}
        />

        <div className="w-full">
          <h3 className="text-lg font-bold mb-2">
            4. ¿Qué horario prefieren?
          </h3>

          {tipo && fechaSeleccionada ? (
            <div className="mb-4">
              <Horarios
                tipo={tipo}
                fecha={fechaSeleccionada}
                reservas={reservas}
                onSelect={(hora) => setHoraSeleccionada(hora)}
                columnas={3}
                horasDisponibles={obtenerHorasDisponibles(tipo)}
                conteoMesasPorHora={conteoReservasPorHora}
              />
            </div>
          ) : fechaSeleccionada && tiposDisponibles.length > 0 ? (
            <p className="text-center text-sm text-gray-200 mb-4">
              Selecciona un servicio (almuerzo o cena) para ver los horarios.
            </p>
          ) : fechaSeleccionada ? (
            <p className="text-center text-sm text-red-200 mb-4">
              No hay horarios disponibles para la fecha seleccionada.
            </p>
          ) : (
            <p className="text-center text-sm text-gray-200 mb-4">
              Selecciona una fecha para ver los horarios disponibles.
            </p>
          )}
        </div>
      </div>

      {/* Paso 5: Comentario */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">
          5. ¿Alguna indicación adicional?
        </h3>
        <textarea
          className="w-full h-24 p-3 rounded bg-white backdrop-blur-md text-black dark:bg-black/40 dark:text-white"
          placeholder="Escríbelo aquí..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        {/* Paso 6: Mesa */}
        <h3 className="text-lg font-bold pt-2">
          6. ¿En qué mesa deseas sentarte?
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {MESAS.map((mesa) => {
            const estaOcupada = mesasOcupadas.includes(mesa);
            const esSeleccionada = mesaSeleccionada === mesa;

            let clase =
              "px-4 py-2 rounded-lg font-semibold text-sm transition ";
            if (estaOcupada) {
              clase += "bg-red-600 text-white cursor-not-allowed";
            } else if (esSeleccionada) {
              clase += "bg-green-400 text-black";
            } else {
              clase +=
                "bg-green-700 hover:bg-green-600 text-white cursor-pointer";
            }

            return (
              <button
                key={mesa}
                onClick={() => {
                  if (!estaOcupada) setMesaSeleccionada(mesa);
                }}
                className={clase}
                disabled={estaOcupada}
              >
                {mesa}
              </button>
            );
          })}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Boton
            texto={cancelButtonText}
            onClickOverride={onCancel}
            bgColor="bg-gray-400 hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
            textColor="text-white dark:text-black"
            className="w-full sm:w-48"
          />
          <Boton
            texto={submitButtonText}
            onClickOverride={onSubmit}
            bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
            textColor="text-white dark:text-black"
            className="w-full sm:w-48"
          />
        </div>
      </div>
    </div>
  );
}

export default FormularioReserva;