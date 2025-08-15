import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormularioReserva from "../../components/reservas/FormularioReserva";
import Fondo from "../../components/layout/Fondo";
import CajaContenido from "../../components/ui/CajaContenido";
import ModalAlerta from "../../components/ui/ModalAlerta";
import BarraUsuario from "../../components/layout/BarraUsuario";

import fondo from "../../assets/fondo.webp";
import { obtenerReservas } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function ReservaCliente() {
  // Estados del formulario
  const [tipo, setTipo] = useState(null);
  const [tipoInicializado, setTipoInicializado] = useState(false);
  const [personas, setPersonas] = useState(null);
  const [personalizado, setPersonalizado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  
  // Estados de la aplicación
  const [reservas, setReservas] = useState([]);
  const [modal, setModal] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const navigate = useNavigate();
  const { usuario } = useAuth()  || {};

  const MESAS = ["M1", "M2", "M3", "M4", "M5", "M6"];

  // Cargar reservas al montar
  useEffect(() => {
    obtenerReservas().then(setReservas).catch(console.error);
  }, []);

  // Inicializar tipo solo una vez según hora actual
  useEffect(() => {
    if (!tipoInicializado && !fechaSeleccionada) {
      const horaActual = new Date().getHours();
      const tipoInicial = horaActual < 15 ? "almuerzo" : "cena";
      setTipo(tipoInicial);
      setTipoInicializado(true);
    }
  }, [tipoInicializado, fechaSeleccionada]);

  // Reset de estados cuando cambia la fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      setMesaSeleccionada(null);
      // Solo resetear hora si el tipo cambia debido a disponibilidad
      // Esta lógica ahora está en el FormularioReserva
    }
  }, [fechaSeleccionada]);

  // Reset mesa cuando cambia fecha u hora
  useEffect(() => {
    setMesaSeleccionada(null);
  }, [fechaSeleccionada, horaSeleccionada]);

  // Handlers
  const mostrarAlerta = (mensaje, tipo = "warning") => {
    setModal({ mostrar: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setModal({ mostrar: false, mensaje: "", tipo: "info" });
  };

  // Función principal: validar y preparar reserva
  const prepararReserva = () => {
    const cantidadPersonas = personalizado
      ? parseInt(personalizado, 10)
      : personas;

    // Validar campos obligatorios
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

    // Validar rango de personas
    if (cantidadPersonas < 1 || cantidadPersonas > 20) {
      mostrarAlerta("El número de personas debe estar entre 1 y 20.", "warning");
      return;
    }

    const fechaStr = new Date(fechaSeleccionada).toISOString().split("T")[0];

    // Verificar si ya existe una reserva en esa mesa a esa hora
    const yaReservado = reservas.some(
      (r) =>
        r.fecha === fechaStr &&
        r.hora === horaSeleccionada &&
        r.mesa === mesaSeleccionada &&
        (r.estado === "confirmada" || r.estado === "pendiente")
    );

    if (yaReservado) {
      mostrarAlerta(
        "Ya existe una reserva en esa mesa a esa hora. Elige otra mesa u horario.",
        "error"
      );
      return;
    }

    // Preparar objeto de reserva para confirmar (SIN guardar aún)
    const reservaParaConfirmar = {
      tipo,
      personas: cantidadPersonas,
      fecha: fechaStr,
      hora: horaSeleccionada,
      mesa: mesaSeleccionada,
      comentario: comentario.trim(),
      usuario: { 
        nombre: usuario?.nombre || "", 
        correo: usuario?.correo || "" 
      },
    };

    try {
      // Guardar temporalmente en sessionStorage para la vista de confirmación
      sessionStorage.setItem(
        "reservaPendiente",
        JSON.stringify(reservaParaConfirmar)
      );

      // Navegar a confirmación
      navigate("/confirmar-reserva");
    } catch (error) {
      console.error("Error al preparar reserva:", error);
      mostrarAlerta(
        "Error al procesar la reserva. Intenta nuevamente.",
        "error"
      );
    }
  };

  const volverAtras = () => {
    navigate("/cliente");
  };

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

        {/* Formulario de Reserva */}
        <FormularioReserva
          tipo={tipo}
          setTipo={setTipo}
          personas={personas}
          setPersonas={setPersonas}
          personalizado={personalizado}
          setPersonalizado={setPersonalizado}
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
          horaSeleccionada={horaSeleccionada}
          setHoraSeleccionada={setHoraSeleccionada}
          mesaSeleccionada={mesaSeleccionada}
          setMesaSeleccionada={setMesaSeleccionada}
          comentario={comentario}
          setComentario={setComentario}
          reservas={reservas}
          
          onSubmit={prepararReserva}
          onCancel={volverAtras}
          
          MESAS={MESAS}
          submitButtonText="Continuar"
          cancelButtonText="Atrás"
        />

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