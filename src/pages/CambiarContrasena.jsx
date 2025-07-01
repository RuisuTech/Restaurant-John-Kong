import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Componentes personalizados
import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import fondo from "../assets/fondo.webp";
import ModalBase from "../components/ModalBase";
import { usuarios as usuariosBase } from "../utils/usuarios";

function CambiarContrasena() {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para mostrar el modal
  const navigate = useNavigate();

  const correo = localStorage.getItem("recuperacionEmail");

  // Redirigir si no hay correo (dentro de useEffect para evitar errores)
  useEffect(() => {
    if (!correo) {
      navigate("/recuperar");
    }
  }, [correo, navigate]);

  if (!correo) return null;

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

    setMostrarModal(true); // Muestra el modal de confirmación
  };

  return (
    <Fondo imageUrl={fondo}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white dark:bg-black/40 p-8 rounded-2xl shadow-xl">
          <CajaContenido
            titulo="Crea una nueva contraseña"
            descripcion="Introduce una nueva contraseña para tu cuenta. Asegúrate de que sea segura y fácil de recordar."
            tituloSize="text-3xl"
            descripcionSize="text-sm"
            textAlign="text-center"
            className="!bg-transparent !p-0 !shadow-none"
          >
            <div className="flex justify-center mb-6 text-black dark:text-white">
              <i className="fa-solid fa-lock text-4xl"></i>
            </div>

            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />
            <p className="text-xs my-4 text-gray-600 dark:text-gray-300">
              Debe tener al menos 8 caracteres y combinar letras, números o
              símbolos.
            </p>

            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full mb-6 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            <Boton
              texto="Guardar contraseña"
              onClickOverride={guardar}
              bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
              textColor="text-white dark:text-black"
              className="h-[50px] w-full"
            />

            <Boton
              texto="Volver"
              onClickOverride={() => navigate("/verificar-codigo")}
              bgColor="bg-gray-400 hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
              textColor="text-white dark:text-b"
              className="h-[50px] w-full mt-4"
            />
          </CajaContenido>
        </div>
      </div>

      {/* ✅ Modal de éxito */}
      {mostrarModal && (
        <ModalBase
          icono={<i className="fa-solid fa-circle-check" />}
          iconoColor="text-green-500"
          titulo="¡Contraseña actualizada!"
          descripcion="Ahora puedes iniciar sesión con tu nueva contraseña."
        >
          <Boton
            texto="Ir al inicio de sesión"
            onClickOverride={() => {
              localStorage.removeItem("recuperacionEmail");
              navigate("/login");
            }}
            bgColor="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
            textColor="text-white dark:text-black"
            className="h-[45px] w-full mt-4"
          />
        </ModalBase>
      )}
    </Fondo>
  );
}

export default CambiarContrasena;
