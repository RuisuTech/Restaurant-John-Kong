import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Recuperar from "./pages/Recuperar";
import VerificarCodigo from "./pages/VerificarCodigo";
import CambiarContrasena from "./pages/CambiarContrasena";
import Admin from "./pages/Admin/Admin";
import Cliente from "./pages/Cliente/Cliente";
import RutaPrivada from "./routes/RutaPrivada";
import ToggleTema from "./components/ToggleTema"; // Nuevo botón

function App() {

  return (
    <>
      <ToggleTema />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/cambiar-contraseña" element={<CambiarContrasena />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <RutaPrivada rolRequerido="admin">
              <Admin />
            </RutaPrivada>
          }
        />
        <Route
          path="/cliente"
          element={
            <RutaPrivada rolRequerido="cliente">
              <Cliente />
            </RutaPrivada>
          }
        />
      </Routes>
    </>
  );
}

export default App;
