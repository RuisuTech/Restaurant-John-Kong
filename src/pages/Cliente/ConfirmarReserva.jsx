import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../../components/Fondo"; // Componente para fondo con imagen
import CajaContenido from "../../components/CajaContenido"; // Componente reutilizable tipo card con fondo blur
import Boton from "../../components/Boton"; // Botón estilizado reutilizable
import ModalExito from "../../components/ModalExito"; // Modal de confirmación de éxito
import fondo from "../../assets/fondo.webp"; // Imagen de fondo

// Componente para confirmar y guardar la reserva
function ConfirmarReserva() {
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null); // Datos de la reserva pendiente
  const [usuario, setUsuario] = useState(null); // Datos del usuario actual
  const [reservaConfirmada, setReservaConfirmada] = useState(false); // Estado para mostrar el modal de éxito

  // Al cargar el componente, intenta recuperar la reserva pendiente y el usuario
  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("reservaPendiente"));
    const u = JSON.parse(localStorage.getItem("usuario"));

    if (r && u) {
      setReserva(r);
      setUsuario(u);
    }
  }, []);

  // Función que confirma la reserva
  const confirmar = () => {
    if (!reserva || !usuario || reservaConfirmada) return;

    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const nuevaReserva = {
      ...reserva,
      id: reserva.id || crypto.randomUUID(), // ✅ Genera un ID único
      estado: "pendiente", // Estado inicial
      fechaConfirmacion: new Date().toISOString(), // Fecha actual
      usuario,
    };

    // Previene duplicados exactos en fecha/hora/usuario
    const yaExiste = reservas.some(
      (r) =>
        r.fecha === reserva.fecha &&
        r.hora === reserva.hora &&
        r.usuario?.correo === usuario.correo
    );

    if (!yaExiste) {
      reservas.push(nuevaReserva);
    }

    // Guarda en localStorage
    localStorage.setItem("reservas", JSON.stringify(reservas));
    localStorage.removeItem("reservaPendiente"); // Limpia el estado temporal
    setReservaConfirmada(true); // Muestra el modal
  };

  // Si falta la reserva o el usuario, se muestra un mensaje de error
  if (!reserva || !usuario) {
    return (
      <Fondo imageUrl={fondo}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <CajaContenido
            titulo="Reserva no encontrada"
            descripcion="No se encontró una reserva pendiente. Por favor, realiza una nueva."
          >
            <div className="flex justify-center mt-4">
              <Boton
                texto="Volver a reservar"
                onClickOverride={() => navigate("/reservar")}
                bgColor="bg-blue-600"
                textColor="text-white"
                className="px-6 py-2"
              />
            </div>
          </CajaContenido>
        </div>
      </Fondo>
    );
  }

  // Desestructura los datos de la reserva para mostrarlos
  const { tipo, personas, fecha, hora, comentario } = reserva;

  // Formatea la fecha a formato legible (ej. lunes 25 de junio de 2025)
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Fondo imageUrl={fondo}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <CajaContenido
          titulo="Confirmar tu Reserva"
          descripcion="Revisa los detalles antes de confirmar tu reserva."
          tituloSize="text-2xl"
          descripcionSize="text-sm"
          textAlign="text-center"
          glass // ✅ Aplica fondo blur transparente
        >
          {/* Muestra los detalles de la reserva */}
          <div className="text-left space-y-2 text-base">
            <p><strong>Servicio:</strong> {tipo}</p>
            <p><strong>Personas:</strong> {personas}</p>
            <p><strong>Fecha:</strong> {fechaFormateada}</p>
            <p><strong>Hora:</strong> {hora}</p>
            {comentario && (
              <p><strong>Comentario:</strong> {comentario}</p>
            )}
            <p><strong>Usuario:</strong> {usuario.nombre} ({usuario.correo})</p>
          </div>

          {/* Botones: Atrás o Confirmar */}
          <div className="flex justify-center gap-4 mt-6">
            <Boton
              texto="Atrás"
              onClickOverride={() => {
                localStorage.removeItem("reservaPendiente");
                navigate("/reservar");
              }}
              bgColor="bg-gray-500"
              textColor="text-white"
              className="w-40 h-10"
            />
            <Boton
              texto="Reservar ahora"
              onClickOverride={confirmar}
              bgColor="bg-green-600"
              textColor="text-white"
              className="w-40 h-10"
            />
          </div>
        </CajaContenido>
      </div>

      {/* Modal de éxito cuando se confirma la reserva */}
      {reservaConfirmada && (
        <ModalExito
          mensaje="¡Reserva completada!"
          descripcion="Tu reserva ha sido registrada exitosamente."
          textoBoton="Volver al inicio"
          onClose={() => navigate("/cliente")}
        />
      )}
    </Fondo>
  );
}

export default ConfirmarReserva;
