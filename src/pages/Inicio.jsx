import Fondo from "../components/Fondo";
import CajaContenido from "../components/CajaContenido";
import Boton from "../components/Boton";
import fondoInicio from "../assets/fondo.webp";

function Inicio() {
  return (
    <Fondo imageUrl={fondoInicio}>
      <CajaContenido
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
      </CajaContenido>
    </Fondo>
  );
}

export default Inicio;
