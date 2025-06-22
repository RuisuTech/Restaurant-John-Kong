import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import logo from "../assets/logo.webp";
import fondo from "../assets/fondo.webp";

function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verificar = () => {
  const codigoGuardado = localStorage.getItem("codigoRecuperacion");

  if (codigo !== codigoGuardado) {
    setError("El código ingresado es incorrecto.");
    return;
  }

  // Código válido → limpiar y continuar
  localStorage.removeItem("codigoRecuperacion");
  navigate("/cambiar-contraseña");
};


  return (
    <Fondo imageUrl={fondo}>
      <CajaContenido
        titulo="Código enviado"
        descripcion="Revisa tu correo electrónico. Te hemos enviado un código de verificación."
        tituloSize="text-3xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Verifica el código"
          className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Boton
            texto="Verificar"
            onClickOverride={verificar}
            bgColor="bg-green-600 dark:bg-green-400"
            textColor="text-white dark:text-black"
          />
          <Boton
            texto="Atrás"
            onClickOverride={() => navigate("/recuperar")}
            bgColor="bg-gray-400 dark:bg-gray-600"
            textColor="text-black dark:text-white"
          />
        </div>
      </CajaContenido>
    </Fondo>
  );
}

export default VerificarCodigo;
