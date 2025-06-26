// src/utils/usuarios.js

// Lista de usuarios predefinidos en la aplicación.
// Se utiliza como base para la autenticación junto con los usuarios registrados dinámicamente en localStorage.
export const usuarios = [
  {
    // Usuario administrador por defecto
    nombre: "Administrador General",
    correo: "admin@correo.com",
    password: "admin123",  // Contraseña predeterminada
    rol: "admin",          // Rol especial con acceso a panel de administración
  },
  {
    // Usuario cliente de ejemplo
    nombre: "Cliente Ejemplo",
    correo: "cliente@correo.com",
    password: "cliente123", // Contraseña predeterminada
    rol: "cliente",         // Rol de cliente común
  }
];
