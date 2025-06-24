import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import fondo from "../assets/fondo.webp";
import { usuarios as usuariosBase } from "../utils/usuarios";

function CambiarContrasena() {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const correo = localStorage.getItem("recuperacionEmail");
  if (!correo) {
    navigate("/recuperar");
    return null;
  }

  const guardar = () => {
    if (!nueva || !confirmar) {
      setError("Completa todos los campos.");
      return;
    }

    if (nueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || [];
    const todos = [
      ...usuariosBase,
      ...usuariosLocales.filter(
        (u) => !usuariosBase.some((base) => base.correo === u.correo)
      ),
    ];

    const actualizados = todos.map((u) =>
      u.correo === correo ? { ...u, password: nueva } : u
    );

    const nuevosLocales = actualizados.filter(
      (u) => !usuariosBase.some((base) => base.correo === u.correo) || true
    );

    localStorage.setItem("usuarios", JSON.stringify(nuevosLocales));
    localStorage.removeItem("recuperacionEmail");
    navigate("/login");
  };

  return (
    <Fondo imageUrl={fondo}>
      <CajaContenido
        titulo="Crea una nueva contraseña"
        descripcion="Introduce una nueva contraseña para tu cuenta. Asegúrate de que sea segura y fácil de recordar."
        tituloSize="text-3xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center mb-6 text-black dark:text-white">
          <i class="fa-solid fa-lock text-4xl"></i>
        </div>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full mb-1 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <p className="text-xs mb-4 text-gray-600 dark:text-gray-300">
          Debe tener al menos 8 caracteres y combinar letras, números o símbolos.
        </p>

        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <Boton
          children="Guardar contraseña"
          onClickOverride={guardar}
          bgColor="bg-green-600 dark:bg-green-400"
          textColor="text-white dark:text-black"
          className="h-[50px] w-full"
        />
      </CajaContenido>
    </Fondo>
  );
}

export default CambiarContrasena;
