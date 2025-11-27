import { agregarPlato } from "../../utils/localDB";

const MENU = {
  almuerzo: [
    { nombre: "Pollo a la plancha", precio: 20 },
    { nombre: "Lomo saltado", precio: 22 }
  ],
  cena: [
    { nombre: "Pizza personal", precio: 18 },
    { nombre: "Hamburguesa gourmet", precio: 19 }
  ]
};

function ListaPlatos({ tipo, mesa }) {
  if (!tipo) return null;

  const platos = MENU[tipo];

  const agregar = (plato) => {
    agregarPlato(mesa, plato);
    alert(`✔ ${plato.nombre} agregado al pedido`);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Platos disponibles</h3>

      <div className="flex flex-col gap-3">
        {platos.map((p, i) => (
          <button
            key={i}
            onClick={() => agregar(p)}
            className="w-full bg-white text-black px-4 py-3 rounded-lg shadow border"
          >
            {p.nombre} — S/ {p.precio}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ListaPlatos;
