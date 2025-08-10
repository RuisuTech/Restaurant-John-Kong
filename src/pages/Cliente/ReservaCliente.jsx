import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioReserva from "../../components/CalendarioReserva";
import Horarios from "../../components/Horarios";
import Fondo from "../../components/Fondo";
import CajaContenido from "../../components/CajaContenido";
import Boton from "../../components/Boton";
import ModalAlerta from "../../components/ModalAlerta";
import fondo from "../../assets/fondo.webp";
import BarraUsuario from "../../components/BarraUsuario";
import { obtenerReservas, crearReserva } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function ReservaCliente() {
  const [tipo, setTipo] = useState(null);
  const [personas, setPersonas] = useState(null);
  const [personalizado, setPersonalizado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [reservas, setReservas] = useState([]);
  const [modal, setModal] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Mesas del local (úsalas coherentes con las que muestras)
  const MESAS = ["M1", "M2", "M3", "M4", "M5", "M6"];
  const TOTAL_MESAS = MESAS.length;

  useEffect(() => {
    obtenerReservas().then(setReservas);
  }, []);

  const mostrarAlerta = (mensaje, tipo = "warning") => {
    setModal({ mostrar: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setModal({ mostrar: false, mensaje: "", tipo: "info" });
  };

  const guardarReserva = async () => {
    if (!usuario) {
      mostrarAlerta("Debes iniciar sesión para hacer una reserva", "error");
      navigate("/login");
      return;
    }

    const cantidadPersonas = personalizado
      ? parseInt(personalizado, 10)
      : personas;

    // 📌 Validación: Campos requeridos
    if (
      !tipo ||
      !cantidadPersonas ||
      !fechaSeleccionada ||
      !horaSeleccionada ||
      !mesaSeleccionada
    ) {
      mostrarAlerta("Completa todos los pasos (incluye la mesa).", "warning");
      return;
    }

    // 📌 Validación: Límite de personas
    if (cantidadPersonas < 1 || cantidadPersonas > 50) {
      mostrarAlerta(
        "El número de personas debe estar entre 1 y 50.",
        "warning"
      );
      return;
    }

    // 📌 Validación: No permitir fechas pasadas
    const hoy = new Date();
    const hoySinHora = new Date(hoy);
    hoySinHora.setHours(0, 0, 0, 0);
    const fechaSinHora = new Date(fechaSeleccionada);
    fechaSinHora.setHours(0, 0, 0, 0);

    if (fechaSinHora < hoySinHora) {
      mostrarAlerta("No puedes reservar en una fecha pasada.", "warning");
      return;
    }

    const fechaStr = new Date(fechaSeleccionada).toISOString().split("T")[0];

    // 📌 Validación: Mesa ya ocupada
    const yaReservado = reservas.some(
      (r) =>
        r.fecha === fechaStr &&
        r.hora === horaSeleccionada &&
        r.mesa === mesaSeleccionada &&
        (r.estado === "confirmada" || r.estado === "pendiente")
    );

    if (yaReservado) {
      mostrarAlerta(
        "Ya existe una reserva en esa mesa a esa hora. Elige otra.",
        "error"
      );
      return;
    }

    const nuevaReserva = {
      tipo,
      personas: cantidadPersonas,
      fecha: fechaStr,
      hora: horaSeleccionada,
      mesa: mesaSeleccionada,
      comentario,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
      estado: "pendiente",
    };

    try {
      const reservaCreada = await crearReserva(nuevaReserva);
      sessionStorage.setItem("reservaPendiente", JSON.stringify(reservaCreada));
      navigate(`/confirmar-reserva?id=${reservaCreada.id}`);
    } catch (error) {
      console.error("Error al crear reserva:", error);
      mostrarAlerta(
        "No se pudo guardar la reserva. Intenta nuevamente.",
        "error"
      );
    }
  };

  // Devuelve las horas base según tipo
  const horasBasePorTipo = (tipoServicio) => {
    if (tipoServicio === "almuerzo") {
      return Array.from({ length: 6 }, (_, i) => `${11 + i}:00`); // 11:00 - 16:00
    }
    if (tipoServicio === "cena") {
      return Array.from({ length: 6 }, (_, i) => `${18 + i}:00`); // 18:00 - 23:00
    }
    return [];
  };

  // Cuenta mesas ocupadas por hora para la fecha seleccionada
  const contarReservasPorHora = () => {
    if (!fechaSeleccionada) return {};
    const fechaStr = new Date(fechaSeleccionada).toISOString().split("T")[0];
    const conteo = {};
    reservas.forEach((r) => {
      if (
        r.fecha === fechaStr &&
        (r.estado === "confirmada" || r.estado === "pendiente")
      ) {
        if (!conteo[r.hora]) {
          conteo[r.hora] = new Set();
        }
        conteo[r.hora].add(r.mesa);
      }
    });
    Object.keys(conteo).forEach((hora) => {
      conteo[hora] = conteo[hora].size;
    });
    return conteo; // ej: { "11:00": 2, "12:00": 4, ... }
  };

  // Devuelve las horas disponibles para un tipo (filtra horas pasadas si la fecha es hoy
  // y filtra horas que estén totalmente ocupadas)
  const obtenerHorasDisponibles = (tipoServicio = tipo) => {
    if (!tipoServicio) return [];

    let horas = horasBasePorTipo(tipoServicio);

    // Si la fecha seleccionada es hoy -> filtrar horas pasadas
    if (fechaSeleccionada) {
      const hoy = new Date();
      const hoySinHora = new Date(hoy);
      hoySinHora.setHours(0, 0, 0, 0);
      const fechaSinHora = new Date(fechaSeleccionada);
      fechaSinHora.setHours(0, 0, 0, 0);

      if (fechaSinHora.getTime() === hoySinHora.getTime()) {
        const horaActual = hoy.getHours();
        // ocultamos las horas menores o iguales a la hora actual (si deseas incluir la hora actual,
        // cambia la condición a parseInt(h,10) >= horaActual)
        horas = horas.filter((h) => parseInt(h, 10) > horaActual);
      }
    }

    // Filtrar horas completamente ocupadas
    const conteo = contarReservasPorHora();
    horas = horas.filter((h) => {
      const ocupadas = conteo[h] || 0;
      return ocupadas < TOTAL_MESAS; // si hay al menos 1 mesa libre
    });

    return horas;
  };

  // Obtiene mesas ocupadas para la fecha/hora seleccionada (igual que antes)
  const obtenerMesasOcupadas = () => {
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
  };

  // Cuando cambia la fecha o las reservas, calculamos qué servicios tienen horas libres.
  // Si solo queda uno, lo seleccionamos automáticamente.
  useEffect(() => {
    if (!fechaSeleccionada) {
      setTipo(null);
      setHoraSeleccionada(null);
      return;
    }

    const disponibles = ["almuerzo", "cena"].filter(
      (opcion) => obtenerHorasDisponibles(opcion).length > 0
    );

    if (disponibles.length === 1) {
      setTipo(disponibles[0]);
      setHoraSeleccionada(null);
    } else {
      // si hay 2 o 0, deseleccionar tipo para que el usuario elija (o mostrar mensaje si 0)
      setTipo(null);
      setHoraSeleccionada(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada, reservas]); // recalcula al cambiar fecha o reservas

  return (
    <Fondo imageUrl={fondo}>
      <div className="w-full min-h-screen px-4 pt-20 flex flex-col gap-6 text-white max-w-7xl mx-auto pb-14">
        <BarraUsuario />

        <CajaContenido
          titulo="¡Iniciemos con tu reserva!"
          descripcion="Completa los pasos para reservar una experiencia inolvidable."
          tituloSize="text-2xl sm:text-3xl"
          descripcionSize="text-sm sm:text-base"
          className="w-full bg-white dark:bg-black/40 text-black dark:text-white"
          textAlign="text-center"
        />

        {/* Paso 1: Tipo */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">1. ¿Qué servicio deseas?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Mostramos botones solo si hay horas para ese servicio.
                Si no hay fecha seleccionada, mostrar ambos (se asume día futuro). */}
            {["almuerzo", "cena"].map((opcion) => {
              const horasDisp = fechaSeleccionada
                ? obtenerHorasDisponibles(opcion)
                : horasBasePorTipo(opcion);
              if (fechaSeleccionada && horasDisp.length === 0) return null; // no mostramos botón si no hay horas
              return (
                <Boton
                  key={opcion}
                  texto={opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                  onClickOverride={() => {
                    setTipo(opcion);
                    setHoraSeleccionada(null);
                  }}
                  bgColor={
                    tipo === opcion
                      ? "bg-green-600"
                      : "bg-white dark:bg-black/40"
                  }
                  textColor={
                    tipo === opcion
                      ? "text-white"
                      : "text-black dark:text-white"
                  }
                  className="px-4 py-2 rounded-lg font-semibold"
                />
              );
            })}
          </div>

          {/* Paso 2: Personas */}
          <h3 className="text-lg font-bold pt-2">
            2. ¿Cuántas personas vendrán?
          </h3>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPersonas(i + 1);
                  setPersonalizado("");
                }}
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
              max="50"
              step="1"
              className="w-10 h-10 rounded-full text-center font-bold bg-white dark:bg-black/40 text-black dark:text-white text-sm"
              value={personalizado}
              onChange={(e) => {
                const valor = e.target.value;
                if (
                  !valor ||
                  (parseInt(valor, 10) >= 11 && parseInt(valor, 10) <= 50)
                ) {
                  setPersonalizado(valor);
                  setPersonas(null);
                }
              }}
              onKeyDown={(e) => {
                // Bloquear letras y símbolos no deseados
                if (
                  e.key.length === 1 && // evita permitir teclas como "ArrowLeft"
                  !/[0-9]/.test(e.key) // solo números
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Paso 3: Fecha */}
          <h3 className="text-lg font-bold pt-2">3. ¿Qué día vendrán?</h3>
        </div>

        {/* Calendario y (ahora) horas debajo */}
        <div className="grid grid-cols-1 gap-6 justify-items-center">
          <CalendarioReserva
            fecha={fechaSeleccionada}
            setFecha={setFechaSeleccionada}
            fechasReservadas={reservas.map((r) => r.fecha)}
            reservas={reservas}
            tipo={tipo}
            minDate={new Date()} // ⬅ Bloquea fechas pasadas
          />

          <div className="w-full">
            <h3 className="text-lg font-bold mb-2">
              4. ¿Qué horario prefieren?
            </h3>

            {/* Si no hay ningún servicio con horas, mostramos mensaje */}
            {fechaSeleccionada &&
              ["almuerzo", "cena"].every(
                (opcion) => obtenerHorasDisponibles(opcion).length === 0
              ) && (
                <p className="text-center text-sm text-red-200">
                  No hay horarios disponibles para la fecha seleccionada.
                </p>
              )}

            {/* Horas: se muestran debajo del calendario sólo cuando hay un tipo seleccionado */}
            {tipo ? (
              <div className="mb-4">
                <Horarios
                  tipo={tipo}
                  fecha={fechaSeleccionada}
                  reservas={reservas}
                  onSelect={(hora) => setHoraSeleccionada(hora)}
                  columnas={3}
                  horasDisponibles={obtenerHorasDisponibles(tipo)}
                  conteoMesasPorHora={contarReservasPorHora()}
                />
              </div>
            ) : (
              // Si no hay tipo seleccionado y sí hay horas disponibles para alguno,
              // mostramos una pista para que el usuario elija servicio.
              fechaSeleccionada && (
                <p className="text-center text-sm text-gray-200 mb-4">
                  Selecciona un servicio (almuerzo o cena) para ver los
                  horarios.
                </p>
              )
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
              const ocupadas = obtenerMesasOcupadas();
              const estaOcupada = ocupadas.includes(mesa);
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
                >
                  {mesa}
                </button>
              );
            })}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Boton
              texto="Atrás"
              onClickOverride={() => navigate("/cliente")}
              bgColor="bg-gray-400 hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
              textColor="text-white dark:text-black"
              className="w-full sm:w-48"
            />
            <Boton
              texto="Enviar"
              onClickOverride={guardarReserva}
              bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
              textColor="text-white dark:text-black"
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Modal de alerta */}
        <ModalAlerta
          visible={modal.mostrar}
          mensaje={modal.mensaje}
          tipo={modal.tipo}
          onClose={cerrarAlerta}
        />
      </div>
    </Fondo>
  );
}

export default ReservaCliente;
