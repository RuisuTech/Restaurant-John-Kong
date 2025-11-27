// --- Base local para pedidos ---
const KEY = "pedidosMesa";

export function getPedidos() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function savePedidos(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getPedidoMesa(mesa) {
  const pedidos = getPedidos();
  return pedidos[mesa] || { items: [], estado: "pendiente" };
}

export function agregarPlato(mesa, plato) {
  const pedidos = getPedidos();
  
  if (!pedidos[mesa]) pedidos[mesa] = { items: [], estado: "pendiente" };

  pedidos[mesa].items.push(plato);
  savePedidos(pedidos);
}

export function eliminarPlato(mesa, index) {
  const pedidos = getPedidos();
  if (!pedidos[mesa]) return;

  pedidos[mesa].items.splice(index, 1);
  savePedidos(pedidos);
}

export function confirmarPedido(mesa) {
  const pedidos = getPedidos();
  if (!pedidos[mesa]) return false;

  pedidos[mesa].estado = "confirmado";
  pedidos[mesa].fecha = new Date().toISOString();

  savePedidos(pedidos);
  return true;
}

export function limpiarPedido(mesa) {
  const pedidos = getPedidos();
  delete pedidos[mesa];
  savePedidos(pedidos);
}
