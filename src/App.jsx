// App.jsx
import { Routes, Route } from "react-router-dom";

// Páginas principales
import Inicio from "./pages/Inicio";

// Páginas de autenticación
import Login from "./pages/Auth/Login";
import Registro from "./pages/Auth/Registro";
import Recuperar from "./pages/Auth/Recuperar";
import VerificarCodigo from "./pages/Auth/VerificarCodigo";
import CambiarContrasena from "./pages/Auth/CambiarContrasena";

// Páginas del cliente
import ReservaCliente from "./pages/Cliente/ReservaCliente";
import ConfirmarReserva from "./pages/Cliente/ConfirmarReserva";
import HistorialReservas from "./pages/Cliente/HistorialReservas";
import Cliente from "./pages/Cliente/Cliente";

// Páginas de administración
import Admin from "./pages/Admin/Admin";
import PanelControl from "./pages/Admin/PanelControl";
import CalendarioAdmin from "./pages/Admin/CalendarioAdmin";

// Rutas y utilidades
import RutaPrivada from "./routes/RutaPrivada";
import ToggleTema from "./components/ui/ToggleTema";
import Footer from "./components/layout/Footer";

// Página de error
import Pagina404 from "./pages/Pagina404";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenido principal */}
      <main className="flex-grow">
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
      </main>

      <Footer />
      <ToggleTema />
    </div>
  );
}

export default App;
