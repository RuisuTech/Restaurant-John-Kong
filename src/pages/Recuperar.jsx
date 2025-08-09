// Importación de hooks y módulos necesarios
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

// Importación de componentes personalizados
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import { obtenerUsuarios } from "../utils/api"; // 🔹 Reutilizamos la API centralizada

// Recursos
import fondo from "../assets/fondo.webp";

function Recuperar() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const enviarCodigo = async () => {
    const correoNormalizado = correo.trim().toLowerCase();

    // Validación: campo vacío
    if (!correoNormalizado) {
      setError("Por favor, ingresa tu correo.");
      return;
    }

    // Validación: formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoNormalizado)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      const usuarios = await obtenerUsuarios();
      const usuario = usuarios.find(
        (u) => u.correo.toLowerCase() === correoNormalizado
      );

      if (!usuario) {
        setError("Este correo no está registrado.");
        return;
      }

      // Generar código de 6 dígitos
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();

      // Guardar temporalmente en localStorage (en producción → backend)
      localStorage.setItem("recuperacionEmail", correoNormalizado);
      localStorage.setItem("codigoRecuperacion", codigo);
      localStorage.setItem("codigoTimestamp", Date.now());

      // Parámetros para EmailJS
      const templateParams = {
        to_email: correoNormalizado,
        codigo,
        name: usuario.nombre || "Usuario",
        time: new Date().toLocaleString("es-PE"),
        message: "Este es tu código para recuperar tu contraseña.",
      };

      await emailjs.send(
        "service_fg14qjy",
        "template_opzlz8g",
        templateParams,
        "H3XD1-MD44C4UxsxB"
      );

      alert("Código enviado a tu correo. Revisa tu bandeja de entrada."); // 🔹 Mensaje antes de redirigir
      navigate("/verificar-codigo");
    } catch (err) {
      console.error("Error al enviar el correo:", err);
      setError(
        "Hubo un error al intentar enviar el código. Intenta nuevamente."
      );
    }
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white dark:bg-black/40 p-8 rounded-2xl shadow-xl">
          <CajaContenido
            titulo="Recuperemos tu contraseña"
            descripcion="Ingresa tu correo electrónico y te enviaremos un código para continuar con el proceso."
            tituloSize="text-3xl"
            descripcionSize="text-sm"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            <div className="flex justify-center mb-6 text-gray-800 dark:text-white">
              <i className="fa-solid fa-unlock-keyhole text-4xl" />
            </div>

            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError(""); // 🔹 Limpia el error al escribir
              }}
            />

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
