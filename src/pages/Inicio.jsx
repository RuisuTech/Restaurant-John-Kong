import Fondo from "../components/Fondo"
import Boton from "../components/Boton"
import fondoInicio from "../assets/fondo.webp"

function Inicio() {
  return (
    <Fondo imageUrl={fondoInicio} className="brightness-50">
      <section className="flex flex-col items-start gap-8 justify-center text-left h-screen w-[700px]">
        <h1
          className="text-6xl text-left text-white font-black leading-[70px]"
          style={{ fontFamily: "Mulish" }}
        >
          ¡Bienvenido a John Kong!
        </h1>
        <p className="text-xl text-white font-semibold">
          Reserva tu mesa de forma rápida y sencilla. <br />
          Queremos ofrecerte una experiencia gastronómica inolvidable ✨{" "}
        </p>
        <Boton
          ruta="/login"
          bgColor="bg-green-600"
          textColor="text-white"
          className="h-[50px]"
        >
          <section className="flex items-center gap-4 justify-between">
            <span>Inicia Sesión o Regístrate</span>
            <span>
              <i class="fa-solid fa-user"></i>
            </span>
          </section>
        </Boton>
      </section>
      {/* <CajaContenido
        titulo="¡Bienvenido a John Kong!"
        descripcion="Reserva tu mesa de forma rápida y sencilla. Queremos ofrecerte una experiencia gastronómica inolvidable ✨"
        tituloSize="text-5xl"
        descripcionSize="text-base"
        textAlign="text-center"
      >
        <Boton
          texto="Inicia Sesión o Regístrate"
          ruta="/login"
          bgColor="bg-green-600"
          textColor="text-white"
        />
      </CajaContenido> */}
    </Fondo>
  )
}

export default Inicio
