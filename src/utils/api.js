import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// 🔗 URL del backend desplegado en Render
const BASE_URL = "https://restaurant-backend-vz82.onrender.com";
const API_URL = `${BASE_URL}/reservas`;
const USUARIOS_URL = `${BASE_URL}/usuarios`;

export const obtenerUsuarios = async () => {
  const res = await fetch(USUARIOS_URL);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};


// ✅ Obtener todas las reservas
export async function obtenerReservas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener reservas");
  return await res.json();
}

// ✅ Crear una nueva reserva
export async function crearReserva(reserva) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reserva),
  });

  if (!res.ok) {
    const errorMensaje = await res.text();
    console.error("Error al crear reserva:", errorMensaje);
    throw new Error(`Error al crear reserva: ${errorMensaje}`);
  }

  return await res.json();
}

// ✅ Actualizar una reserva por ID
export async function actualizarReserva(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar reserva");
  return await res.json();
}

// ✅ Eliminar una reserva por ID
export async function eliminarReserva(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar reserva");
  return true;
}

// ✅ Cambiar el estado de una reserva
export async function actualizarEstadoReserva(id, nuevoEstado) {
  const payload = { estado: nuevoEstado };

  // Si el estado es "confirmada", añadimos la fecha actual
  if (nuevoEstado.toLowerCase() === "confirmada") {
    payload.fechaConfirmacion = new Date().toISOString();
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const mensaje = await res.text();
    throw new Error(`Error al actualizar la reserva: ${mensaje}`);
  }

  return await res.json();
}


// ✅ Crear nuevo usuario (login clásico)
export const crearUsuario = async (usuario) => {
  const respuesta = await fetch(USUARIOS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  if (!respuesta.ok) throw new Error("Error al crear usuario");
  return await respuesta.json();
};

// ✅ Login con Google (registro automático si no existe)
export const loginConGoogle = async () => {
  const resultado = await signInWithPopup(auth, googleProvider);
  const usuario = resultado.user;

  if (!usuario || !usuario.email) {
    throw new Error("No se pudo obtener la información del usuario de Google.");
  }

  const userData = {
    nombre: usuario.displayName,
    correo: usuario.email,
    password: "",
    rol: "cliente",
  };

  // Buscar usuarios existentes
  const res = await fetch(USUARIOS_URL);
  if (!res.ok) {
    throw new Error("Error al consultar los usuarios");
  }

  const usuariosDB = await res.json();

  // Buscar si ya existe
  let usuarioEnBD = usuariosDB.find(
    (u) => u.correo.toLowerCase() === userData.correo.toLowerCase()
  );

  // Si no existe, lo registramos
  if (!usuarioEnBD) {
    const crearRes = await fetch(USUARIOS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!crearRes.ok) {
      const errorText = await crearRes.text();
      console.error("Error al crear usuario:", errorText);
      throw new Error("No se pudo registrar el usuario");
    }

    usuarioEnBD = await crearRes.json();
  }

  return usuarioEnBD;
};
