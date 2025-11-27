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
import EscanearMesa from "./pages/Cliente/EscanearMesa";
import Menu from "./pages/Cliente/Menu";
import { Carrito } from "./pages/Cliente/Carrito.jsx";

import PagoSimulado from "./pages/Cliente/PagoSimulado";
import EstadoPedido from "./pages/Cliente/EstadoPedido";

// Páginas de administración
import Admin from "./pages/Admin/Admin";
import PanelControl from "./pages/Admin/PanelControl";
import CalendarioAdmin from "./pages/Admin/CalendarioAdmin";
import Cocina from "./pages/Admin/Cocina";

// Rutas y utilidades
import RutaPrivada from "./routes/RutaPrivada";
import ToggleTema from "./components/ui/ToggleTema";
import Footer from "./components/layout/Footer";

// Página de error
import Pagina404 from "./pages/Pagina404";

// ⬅️ IMPORTA EL HOOK
import { useMesa } from "./hooks/useMesa";

import Gracias from "./pages/Cliente/Gracias";

function App() {
  // ⬅️ USA EL HOOK AQUÍ (no borra nada, no rompe nada)
  const mesa = useMesa();

  return (
    <div className="flex flex-col min-h-screen">
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

          {/* Nuevas rutas del cliente: Mesa, Menú, Carrito, Pago, Pedido */}
          <Route
            path="/mesa"
            element={
              <RutaPrivada rolRequerido="cliente">
                <EscanearMesa />
              </RutaPrivada>
            }
          />

          <Route
            path="/menu"
            element={
              <RutaPrivada rolRequerido="cliente">
                <Menu />
              </RutaPrivada>
            }
          />

          <Route
            path="/carrito"
            element={
              <RutaPrivada rolRequerido="cliente">
                <Carrito />
              </RutaPrivada>
            }
          />

          <Route
            path="/pago"
            element={
              <RutaPrivada rolRequerido="cliente">
                <PagoSimulado />
              </RutaPrivada>
            }
          />

          <Route
            path="/pedido"
            element={
              <RutaPrivada rolRequerido="cliente">
                <EstadoPedido />
              </RutaPrivada>
            }
          />

          <Route
            path="/gracias"
            element={
              <RutaPrivada rolRequerido="cliente">
                <Gracias />
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

          <Route
            path="/admin/cocina"
            element={
              <RutaPrivada rolRequerido="admin">
                <Cocina />
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
