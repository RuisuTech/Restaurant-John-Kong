// Importamos rutas y componentes necesarios
import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Recuperar from "./pages/Recuperar";
import VerificarCodigo from "./pages/VerificarCodigo";
import CambiarContrasena from "./pages/CambiarContrasena";
import ReservaCliente from "./pages/Cliente/ReservaCliente";
import ConfirmarReserva from "./pages/Cliente/ConfirmarReserva";
import HistorialReservas from "./pages/Cliente/HistorialReservas";

import Admin from "./pages/Admin/Admin";
import Cliente from "./pages/Cliente/Cliente";
import RutaPrivada from "./routes/RutaPrivada";
import ToggleTema from "./components/ToggleTema";
import PanelControl from "./pages/Admin/PanelControl";
import CalendarioAdmin from "./pages/Admin/CalendarioAdmin";

import Pagina404 from "./pages/Pagina404";


function App() {
  return (
    <>
      {/* Componente para cambiar entre modo claro/oscuro */}
      <ToggleTema />

      {/* Definición de todas las rutas de la aplicación */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/cambiar-contraseña" element={<CambiarContrasena />} />

        {/* Rutas protegidas para clientes */}
        <Route
          path="/reservar"
          element={
            <RutaPrivada rolRequerido="cliente">
              <ReservaCliente />
            </RutaPrivada>
          }
        />
        <Route
          path="/confirmar-reserva"
          element={
            <RutaPrivada rolRequerido="cliente">
              <ConfirmarReserva />
            </RutaPrivada>
          }
        />
        <Route
          path="/historial"
          element={
            <RutaPrivada rolRequerido="cliente">
              <HistorialReservas />
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

        {/* Rutas protegidas para administrador */}
        <Route
          path="/admin"
          element={
            <RutaPrivada rolRequerido="admin">
              <Admin />
            </RutaPrivada>
          }
        />
        <Route
          path="/admin/panel"
          element={
            <RutaPrivada rolRequerido="admin">
              <PanelControl />
            </RutaPrivada>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <RutaPrivada rolRequerido="admin">
              <CalendarioAdmin />
            </RutaPrivada>
          }
        />

        <Route path="*" element={<Pagina404 />} />

      </Routes>
    </>
  );
}

export default App;
