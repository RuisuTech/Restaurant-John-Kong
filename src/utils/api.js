// utils/api.js
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
const API_URL = "/api/reservas";

export async function obtenerReservas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener reservas");
  return await res.json();
}

export async function crearReserva(reserva) {
  const res = await fetch("/api/reservas", {
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

export async function eliminarReserva(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar reserva");
  return true;
}

export async function actualizarEstadoReserva(id, nuevoEstado) {
  const res = await fetch(`/api/reservas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar la reserva");
  }

  return await res.json();
}

export const crearUsuario = async (usuario) => {
  const respuesta = await fetch("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  if (!respuesta.ok) throw new Error("Error al crear usuario");
  return await respuesta.json();
};

export const loginConGoogle = async () => {
  const resultado = await signInWithPopup(auth, googleProvider);
  const usuario = resultado.user;

  if (!usuario || !usuario.email) {
    throw new Error("No se pudo obtener la información del usuario de Google.");
  }

  const userData = {
    nombre: usuario.displayName,
    correo: usuario.email,
    password: "", // vacía para Google
    rol: "cliente",
  };

  // 1. Consultar usuarios existentes
  const res = await fetch("/api/usuarios");
  if (!res.ok) {
    throw new Error("Error al consultar los usuarios");
  }

  const usuariosDB = await res.json();

  // 2. Buscar si ya existe
  let usuarioEnBD = usuariosDB.find(
    (u) => u.correo.toLowerCase() === userData.correo.toLowerCase()
  );

  // 3. Si no existe, lo creamos
  if (!usuarioEnBD) {
    const crearRes = await fetch("/api/usuarios", {
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
