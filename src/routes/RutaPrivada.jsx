import { Navigate } from "react-router-dom";

function RutaPrivada({ children, rolRequerido }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutaPrivada;
