// src/pages/Recuperar.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Fondo from "../components/Fondo"
import CajaContenido from "../components/CajaContenido"
import emailjs from "@emailjs/browser"
import Boton from "../components/Boton"
import fondo from "../assets/fondo.webp"
import { usuarios as usuariosBase } from "../utils/usuarios"

function Recuperar() {
  const [correo, setCorreo] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const CODIGO_GENERADO = Math.floor(100000 + Math.random() * 900000).toString() // 6 dígitos

  const enviarCodigo = () => {
    const usuariosLocales = JSON.parse(localStorage.getItem("usuarios")) || []
    const todos = [
      ...usuariosBase,
      ...usuariosLocales.filter(
        (u) => !usuariosBase.some((base) => base.correo === u.correo)
      ),
    ]

    const existe = todos.find((u) => u.correo === correo)

    if (!existe) {
      setError("Este correo no está registrado.")
      return
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString()

    localStorage.setItem("recuperacionEmail", correo)
    localStorage.setItem("codigoRecuperacion", codigo)

    const templateParams = {
      to_email: correo,
      codigo: codigo,
      name: existe.nombre || "Usuario",
      time: new Date().toLocaleString("es-PE"),
      message: "Este es tu código para recuperar tu contraseña.",
    }

    emailjs
      .send(
        "service_fg14qjy",
        "template_opzlz8g",
        templateParams,
        "H3XD1-MD44C4UxsxB"
      )
      .then(() => {
        navigate("/verificar-codigo")
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error)
        setError("No se pudo enviar el código. Intenta más tarde.")
      })
  }

  return (
    <Fondo imageUrl={fondo}>
      <CajaContenido
        titulo="Recuperemos tu contraseña"
        descripcion="Ingresa tu correo electrónico y te enviaremos un código para continuar con el proceso."
        tituloSize="text-3xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center mb-6 text-black dark:text-white">
          <i class="fa-solid fa-unlock-keyhole text-4xl"></i>
        </div>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-3 bg-transparent border border-gray-400 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:border-white dark:text-white dark:placeholder-gray-300"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Boton
            children="Enviar"
            onClickOverride={enviarCodigo}
            bgColor="bg-green-600 dark:bg-green-400"
            textColor="text-white dark:text-black"
            className="h-[50px] w-full"
          />
          <Boton
            children="Atrás"
            onClickOverride={() => navigate("/login")}
            bgColor="bg-gray-400 dark:bg-gray-600"
            textColor="text-black dark:text-white"
            className="h-[50px] w-full"
          />
        </div>
      </CajaContenido>
    </Fondo>
  )
}

export default Recuperar
