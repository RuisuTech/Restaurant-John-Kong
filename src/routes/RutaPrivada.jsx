// Importa el componente Navigate para redirigir programáticamente en React Router
import { Navigate } from "react-router-dom";

// Componente de protección de rutas privadas
function RutaPrivada({ children, rolRequerido }) {
  // Obtiene al usuario autenticado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay usuario autenticado, redirige al login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Si se requiere un rol específico y el usuario no lo cumple, redirige también
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/login" />;
  }

  // Si pasa todas las validaciones, renderiza el contenido hijo (la ruta protegida)
  return children;
}

export default RutaPrivada;
