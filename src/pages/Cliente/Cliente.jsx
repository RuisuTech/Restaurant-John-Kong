import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fondo from "../../components/Fondo"
import Boton from "../../components/Boton"
import CajaContenido from "../../components/CajaContenido"
import ToggleTema from "../../components/ToggleTema"
import fondoCliente from "../../assets/fondo.webp"

function Cliente() {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"))
    setUsuario(data)
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  return (
    <Fondo imageUrl={fondoCliente} className="brightness-50">
      <ToggleTema onLogout={cerrarSesion} />

      <section className="flex flex-col items-start gap-8 justify-center text-left h-screen w-[730px]">
        <h1
          className="text-6xl text-left text-white font-black leading-[70px]"
          style={{ fontFamily: "Mulish" }}
        >
          ¡Hola {usuario?.nombre}!👋
        </h1>
        <p className="text-xl flex flex-col gap-3 text-white font-semibold">
          <span>Gracias por ser parte de nuestra comunidad.</span>
          <span>Aquí puedes gestionar
          fácilmente tus reservas y mantener el control de tus visitas. Tienes
          dos opciones para continuar:</span> 
        </p>
        <div className="flex justify-center gap-4 mt-4 w-2/3 h-[50px]">
          <Boton
            children="📅 Reservar"
            onClickOverride={() => navigate("/cliente/reservar")}
            bgColor="bg-green-600 dark:bg-green-400"
            textColor="text-white dark:text-black"
          />
          <Boton
            children="🕓 Historial de Reservas"
            onClickOverride={() => navigate("/cliente/historial")}
            bgColor="bg-emerald-600 dark:bg-emerald-400"
            textColor="text-white dark:text-black"
          />
        </div>
      </section>

      {/* <CajaContenido
        titulo={`¡Hola ${usuario?.nombre}! 👋`}
        subtitulo="Bienvenido a John Kong"
        descripcion="Gracias por ser parte de nuestra comunidad. Aquí puedes gestionar fácilmente tus reservas y mantener el control de tus visitas. Tienes dos opciones para continuar:"
        tituloSize="text-4xl"
        subtituloSize="text-2xl"
        descripcionSize="text-sm"
        textAlign="text-center"
      >
        <div className="flex justify-center gap-4 mt-4">
          <Boton
            children="Reservar"
            onClickOverride={() => navigate("/cliente/reservar")}
            bgColor="bg-green-600 dark:bg-green-400"
            textColor="text-white dark:text-black"
          />
          <Boton
            children="Historial de Reservas"
            onClickOverride={() => navigate("/cliente/historial")}
            bgColor="bg-emerald-600 dark:bg-emerald-400"
            textColor="text-white dark:text-black"
          />
        </div>
      </CajaContenido> */}
    </Fondo>
  )
}

export default Cliente
