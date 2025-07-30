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
import { useAuth } from "../../context/AuthContext"; // ✅ Usar contexto

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
  const { usuario } = useAuth(); // ✅ Obtener usuario desde el contexto

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

    const cantidadPersonas = personalizado || personas;
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

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

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

      // ✅ Guardar en sessionStorage en lugar de localStorage
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

  const obtenerHorasDisponibles = () => {
    if (tipo === "almuerzo") {
      return Array.from({ length: 6 }, (_, i) => `${11 + i}:00`);
    }
    if (tipo === "cena") {
      return Array.from({ length: 6 }, (_, i) => `${18 + i}:00`);
    }
    return [];
  };

  const contarReservasPorHora = () => {
    if (!fechaSeleccionada) return {};

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
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

    // Convertimos Set a número de mesas ocupadas
    Object.keys(conteo).forEach((hora) => {
      conteo[hora] = conteo[hora].size;
    });

    return conteo;
  };

  const obtenerMesasOcupadas = () => {
    if (!fechaSeleccionada || !horaSeleccionada) return [];

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

    return reservas
      .filter(
        (r) =>
          r.fecha === fechaStr &&
          r.hora === horaSeleccionada &&
          (r.estado === "confirmada" || r.estado === "pendiente")
      )
      .map((r) => r.mesa);
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="w-full min-h-screen px-4 pt-20 pb-8 flex flex-col gap-6 text-white max-w-7xl mx-auto">
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
            {["almuerzo", "cena"].map((opcion) => (
              <Boton
                key={opcion}
                texto={opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                onClickOverride={() => {
                  setTipo(opcion);
                  setHoraSeleccionada(null);
                }}
                bgColor={
                  tipo === opcion ? "bg-green-600" : "bg-white dark:bg-black/40"
                }
                textColor={
                  tipo === opcion ? "text-white" : "text-black dark:text-white"
                }
                className="px-4 py-2 rounded-lg font-semibold"
              />
            ))}
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
              step="1"
              className="w-10 h-10 rounded-full text-center font-bold bg-white dark:bg-black/40 text-black dark:text-white text-sm"
              value={personalizado}
              onChange={(e) => {
                const valor = e.target.value;
                if (!valor || parseInt(valor) >= 11) {
                  setPersonalizado(valor);
                  setPersonas(null);
                }
              }}
              onKeyDown={(e) =>
                ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
              }
            />
          </div>

          {/* Paso 3: Fecha */}
          <h3 className="text-lg font-bold pt-2">3. ¿Qué día vendrán?</h3>
        </div>

        {/* Calendario y horarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarioReserva
            fecha={fechaSeleccionada}
            setFecha={setFechaSeleccionada}
            fechasReservadas={reservas.map((r) => r.fecha)}
            reservas={reservas}
            tipo={tipo}
          />

          <div className="w-full">
            <h3 className="text-lg font-bold mb-2">
              4. ¿Qué horario prefieren?
            </h3>
            <Horarios
              tipo={tipo}
              fecha={fechaSeleccionada}
              reservas={reservas}
              onSelect={(hora) => setHoraSeleccionada(hora)}
              columnas={3}
              horasDisponibles={obtenerHorasDisponibles()}
              conteoMesasPorHora={contarReservasPorHora()} // <- NUEVO
            />
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

          {/* Paso 6: Selección de Mesa */}
          <h3 className="text-lg font-bold pt-2">
            6. ¿En qué mesa deseas sentarte?
          </h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {["M1", "M2", "M3", "M4", "M5", "M6"].map((mesa) => {
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
