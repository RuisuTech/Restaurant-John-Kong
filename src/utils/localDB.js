// localDB.js

// --- CARRITO ---
export function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
}

export function addToCarrito(plato) {
  const carrito = getCarrito();

  const index = carrito.findIndex(p => p.id === plato.id);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...plato, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function updateCantidad(id, nuevaCantidad) {
  let carrito = getCarrito();
  carrito = carrito.map(p =>
    p.id === id ? { ...p, cantidad: nuevaCantidad } : p
  ).filter(p => p.cantidad > 0); // elimina si queda en 0

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function clearCarrito() {
  localStorage.removeItem("carrito");
}
