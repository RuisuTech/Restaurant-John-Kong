// src/components/PantallaCargando.jsx
import Fondo from "./Fondo";
import fondoInicio from "../assets/fondo.webp";
import CajaContenido from "./CajaContenido";

function PantallaCargando() {
  return (
    <Fondo imageUrl={fondoInicio}>
      <div className="flex justify-center items-center min-h-screen px-4">
        <CajaContenido
          glass
          titulo="Cargando..."
          descripcion="Estamos preparando todo para ti, un momento por favor."
          tituloSize="text-4xl md:text-5xl"
          descripcionSize="text-lg"
          textAlign="text-center"
          className="max-w-xl animate-pulse"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-dashed rounded-full animate-spin mx-auto mt-4"></div>
        </CajaContenido>
      </div>
    </Fondo>
  );
}

export default PantallaCargando;
