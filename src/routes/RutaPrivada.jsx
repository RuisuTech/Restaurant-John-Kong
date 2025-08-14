import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PantallaCargando from "../components/ui/PantallaCargando";


function RutaPrivada({ children, rolRequerido }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  // ⏳ Mostrar pantalla de carga mientras se obtiene el estado de autenticación
  if (cargando) return <PantallaCargando />;

  // 🔐 Si no está autenticado, redirigir al login con la ubicación original (opcional)
  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🚫 Si el rol no coincide, redirigir al login o a una ruta de acceso denegado
  if (
    rolRequerido &&
    ((Array.isArray(rolRequerido) && !rolRequerido.includes(usuario.rol)) ||
      (!Array.isArray(rolRequerido) && usuario.rol !== rolRequerido))
  ) {
    return <Navigate to="/login" replace />;
    // Alternativa: <Navigate to="/no-autorizado" />
  }

  // ✅ Usuario autenticado y con el rol adecuado
  return children;
}

export default RutaPrivada;
