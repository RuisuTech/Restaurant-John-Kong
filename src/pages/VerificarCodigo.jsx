// Hooks de React y navegación
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componentes personalizados y recursos
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import fondo from "../assets/fondo.webp";

function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verificar = () => {
    const codigoGuardado = localStorage.getItem("codigoRecuperacion");
    const timestampGuardado = localStorage.getItem("codigoTimestamp");
    const ahora = Date.now();
    const expiracion = 5 * 60 * 1000; // 5 minutos

    // Validación: formato correcto (6 dígitos)
    if (!/^\d{6}$/.test(codigo)) {
      setError("El código debe tener exactamente 6 dígitos.");
      return;
    }

    // Validación: código expirado
    if (!timestampGuardado || ahora - parseInt(timestampGuardado) > expiracion) {
      setError("El código ha expirado. Por favor, solicita uno nuevo.");
      localStorage.removeItem("codigoRecuperacion");
      localStorage.removeItem("codigoTimestamp");
      return;
    }

    // Validación: coincidencia exacta
    if (codigo !== codigoGuardado) {
      setError("El código ingresado es incorrecto.");
      return;
    }

    // Código correcto: continuar con el flujo
    localStorage.removeItem("codigoRecuperacion");
    localStorage.removeItem("codigoTimestamp");
    navigate("/cambiar-contraseña");
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white dark:bg-black/40 p-8 rounded-2xl shadow-xl">
          <CajaContenido
            titulo="Código enviado"
            descripcion="Revisa tu correo electrónico. Te hemos enviado un código de verificación."
            tituloSize="text-3xl"
            descripcionSize="text-sm"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            {/* Ícono decorativo */}
            <div className="flex justify-center mb-6 text-gray-800 dark:text-white">
              <i className="fa-solid fa-paper-plane text-4xl"></i>
            </div>

            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Verifica el código"
              className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Boton
                texto="Verificar"
                onClickOverride={verificar}
                bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
                textColor="text-white dark:text-black"
                className="h-[50px] w-full"
              />
              <Boton
                texto="Atrás"
                onClickOverride={() => navigate("/recuperar")}
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

export default VerificarCodigo;
