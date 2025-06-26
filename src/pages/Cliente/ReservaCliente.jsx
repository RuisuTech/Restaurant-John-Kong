// ✅ ReservaCliente.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioReserva from "../../components/CalendarioReserva";
import Horarios from "../../components/Horarios";
import Fondo from "../../components/Fondo";
import CajaContenido from "../../components/CajaContenido";
import Boton from "../../components/Boton";
import ModalAlerta from "../../components/ModalAlerta";
import fondo from "../../assets/fondo.webp";

function ReservaCliente() {
  const [tipo, setTipo] = useState(null);
  const [personas, setPersonas] = useState(null);
  const [personalizado, setPersonalizado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [reservas, setReservas] = useState(
    JSON.parse(localStorage.getItem("reservas")) || []
  );
  const [modal, setModal] = useState({ mostrar: false, mensaje: "", tipo: "info" });

  const navigate = useNavigate();

  const mostrarAlerta = (mensaje, tipo = "warning") => {
    setModal({ mostrar: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setModal({ mostrar: false, mensaje: "", tipo: "info" });
  };

  const guardarReserva = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      mostrarAlerta("Debes iniciar sesión para hacer una reserva", "error");
      navigate("/login");
      return;
    }

    const cantidadPersonas = personalizado || personas;
    if (!tipo || !cantidadPersonas || !fechaSeleccionada || !horaSeleccionada) {
      mostrarAlerta("Por favor, completa todos los pasos antes de continuar.", "warning");
      return;
    }

    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
    const yaReservado = reservas.some(
      (r) => r.fecha === fechaStr && r.hora === horaSeleccionada
    );
    if (yaReservado) {
      mostrarAlerta("Ya existe una reserva en ese horario. Elige otra hora.", "error");
      return;
    }

    const nueva = {
      id: Date.now(),
      tipo,
      personas: cantidadPersonas,
      fecha: fechaStr,
      hora: horaSeleccionada,
      comentario,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
      estado: "pendiente",
    };

    localStorage.setItem("reservaPendiente", JSON.stringify(nueva));
    navigate("/confirmar-reserva");
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

  return (
    <Fondo imageUrl={fondo}>
      <div className="w-full min-h-screen px-4 py-8 flex flex-col gap-6 text-white max-w-7xl mx-auto">
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
                bgColor={tipo === opcion ? "bg-green-600" : "bg-white dark:bg-black/40"}
                textColor={tipo === opcion ? "text-white" : "text-black dark:text-white"}
                className="px-4 py-2 rounded-lg font-semibold"
              />
            ))}
          </div>

          {/* Paso 2: Personas */}
          <h3 className="text-lg font-bold pt-2">2. ¿Cuántas personas vendrán?</h3>
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
              className="w-10 h-10 rounded-full text-center font-bold bg-white dark:bg-black/40 text-black dark:text-white text-sm"
              value={personalizado}
              onChange={(e) => {
                setPersonalizado(e.target.value);
                setPersonas(null);
              }}
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
          />
          <div className="w-full">
            <h3 className="text-lg font-bold mb-2">4. ¿Qué horario prefieren?</h3>
            <Horarios
              tipo={tipo}
              fecha={fechaSeleccionada}
              reservas={reservas}
              onSelect={(hora) => setHoraSeleccionada(hora)}
              columnas={3}
              horasDisponibles={obtenerHorasDisponibles()}
            />
          </div>
        </div>

        {/* Comentario */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">5. ¿Alguna indicación adicional?</h3>
          <textarea
            className="w-full h-24 p-3 rounded bg-white backdrop-blur-md text-black dark:bg-black/40 dark:text-white"
            placeholder="Escríbelo aquí..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

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
