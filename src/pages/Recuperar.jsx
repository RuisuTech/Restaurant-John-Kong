// Importación de hooks y módulos necesarios
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importación de componentes personalizados
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import emailjs from "@emailjs/browser";
import Boton from "../components/Boton";

// Recursos
import fondo from "../assets/fondo.webp";
import { usuarios as usuariosBase } from "../utils/usuarios";

function Recuperar() {
  // Estado para guardar el correo ingresado por el usuario
  const [correo, setCorreo] = useState("");

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Función que se ejecuta al hacer clic en "Enviar"
  const enviarCodigo = () => {
    // Obtener usuarios almacenados localmente
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Combinar usuarios base con usuarios locales, evitando duplicados
    const todos = [
      ...usuariosBase,
      ...usuariosLocales.filter(
        (u) => !usuariosBase.some((base) => base.correo === u.correo)
      ),
    ];

    // Verificar si el correo existe en la base de datos
    const existe = todos.find((u) => u.correo === correo);

    if (!existe) {
      setError("Este correo no está registrado.");
      return;
    }

    // Generar un código de 6 dígitos aleatorio
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar datos temporales para el proceso de recuperación
    localStorage.setItem("recuperacionEmail", correo);
    localStorage.setItem("codigoRecuperacion", codigo);

    // Parámetros para enviar el correo con EmailJS
    const templateParams = {
      to_email: correo,
      codigo,
      name: existe.nombre || "Usuario",
      time: new Date().toLocaleString("es-PE"),
      message: "Este es tu código para recuperar tu contraseña.",
    };

    // Enviar correo utilizando EmailJS
    emailjs
      .send(
        "service_fg14qjy",      // ID del servicio de email
        "template_opzlz8g",     // ID de la plantilla
        templateParams,         // Datos a enviar
        "H3XD1-MD44C4UxsxB"     // Clave pública de EmailJS
      )
      .then(() => navigate("/verificar-codigo")) // Ir a la siguiente pantalla
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        setError("No se pudo enviar el código. Intenta más tarde.");
      });
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white dark:bg-black/40 p-8 rounded-2xl shadow-xl">
          {/* Contenedor con título e instrucciones */}
          <CajaContenido
            titulo="Recuperemos tu contraseña"
            descripcion="Ingresa tu correo electrónico y te enviaremos un código para continuar con el proceso."
            tituloSize="text-3xl"
            descripcionSize="text-sm"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            {/* Ícono decorativo */}
            <div className="flex justify-center mb-6 text-gray-800 dark:text-white">
              <i className="fa-solid fa-unlock-keyhole text-4xl" />
            </div>

            {/* Mostrar error si existe */}
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            {/* Campo para ingresar el correo electrónico */}
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            {/* Botones para enviar y volver */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Boton
                texto="Enviar"
                onClickOverride={enviarCodigo}
                bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
              />
              <Boton
                texto="Atrás"
                onClickOverride={() => navigate("/login")}
                bgColor="bg-gray-400 hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
              />
            </div>
          </CajaContenido>
        </div>
      </div>
    </Fondo>
  );
}

export default Recuperar;
