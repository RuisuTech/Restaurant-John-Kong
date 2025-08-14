import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Contextos
import { ProveedorTema } from "./context/ProveedorTema";
import { AuthProvider } from "./context/AuthContext";

// Estilos globales
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProveedorTema>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ProveedorTema>
  </BrowserRouter>
);
