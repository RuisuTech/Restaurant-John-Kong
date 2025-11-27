import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css"; // <- Importante

import { AuthProvider } from "./context/AuthContext";
import { MesaProvider } from "./context/MesaContext";
import { ProveedorTema } from "./context/ProveedorTema";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MesaProvider>
        <ProveedorTema>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProveedorTema>
      </MesaProvider>
    </AuthProvider>
  </React.StrictMode>
);
