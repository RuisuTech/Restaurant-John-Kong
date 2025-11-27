import { getPedidoMesa, eliminarPlato, confirmarPedido } from "../../utils/localDB";

function CarritoMesa({ mesa, onUpdate }) {
  const pedido = getPedidoMesa(mesa);

  const eliminar = (index) => {
    eliminarPlato(mesa, index);
    onUpdate(); // refrescar
  };

  const confirmar = () => {
    if (pedido.items.length === 0) {
      alert("No hay platos en el pedido");
      return;
    }

    confirmarPedido(mesa);
    alert("Pedido confirmado ✔");
    onUpdate();
  };

  return (
    <div className="mt-6 bg-black/20 backdrop-blur p-4 rounded-lg border border-white/10">
      <h3 className="text-xl font-bold mb-3">Tu pedido</h3>

      {pedido.items.length === 0 ? (
        <p className="opacity-70">Aún no agregas platos.</p>
      ) : (
        <ul className="space-y-2">
          {pedido.items.map((item, i) => (
            <li
              key={i}
              className="bg-white text-black p-3 rounded-lg flex justify-between"
            >
              {item.nombre} — S/ {item.precio}
              <button className="text-red-600 font-bold" onClick={() => eliminar(i)}>
                X
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={confirmar}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Confirmar pedido ✔
      </button>
    </div>
  );
}

export default CarritoMesa;
