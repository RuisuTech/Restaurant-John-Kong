import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Fondo from "../../components/layout/Fondo";
import BarraUsuario from "../../components/layout/BarraUsuario";
import Boton from "../../components/ui/Boton";
import fondoCliente from "../../assets/fondo.webp";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../hooks/useCarrito";

export default function Menu() {
  const navigate = useNavigate();
  const { usuario } = useAuth() || {};
  const { carrito, agregar, reducir, eliminar, vaciar } = useCarrito();

  const [modalPago, setModalPago] = useState(false);
  const [metodo, setMetodo] = useState(null);
  const [pedidoListo, setPedidoListo] = useState(false);

  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario, navigate]);

  const horaActual = new Date().getHours();

  const menusTarde = [
    {
      nombre: "Tarde Dorada",
      descripcion: "Almuerzo ligero y delicioso para una tarde perfecta",
      platos: [
        { nombre: "Ensalada César", precio: 12 },
        { nombre: "Pollo a la brasa con papas", precio: 18 },
        { nombre: "Arroz chaufa clásico", precio: 14 },
        { nombre: "Inca Kola 500ml", precio: 5 },
        { nombre: "Helado de vainilla", precio: 6 },
      ],
    },
    {
      nombre: "Tarde Verde",
      descripcion: "Menú saludable y fresco para disfrutar sin culpa",
      platos: [
        { nombre: "Ceviche de pescado", precio: 15 },
        { nombre: "Quinua con verduras al wok", precio: 13 },
        { nombre: "Pechuga de pollo a la plancha", precio: 16 },
        { nombre: "Jugo natural de maracuyá", precio: 5 },
        { nombre: "Fruta de temporada", precio: 6 },
      ],
    },
  ];

  const menusNoche = [
    {
      nombre: "Noche Azul",
      descripcion: "Cena completa con sabores intensos para terminar el día",
      platos: [
        { nombre: "Wantán frito", precio: 8 },
        { nombre: "Arroz chaufa especial", precio: 16 },
        { nombre: "Lomo saltado", precio: 20 },
        { nombre: "Cerveza artesanal", precio: 8 },
        { nombre: "Brownie con helado", precio: 7 },
      ],
    },
    {
      nombre: "Noche Roja",
      descripcion: "Cena picante y llena de sabor peruano",
      platos: [
        { nombre: "Anticuchos de corazón", precio: 12 },
        { nombre: "Tallarin rojo con pollo", precio: 18 },
        { nombre: "Ají de gallina", precio: 19 },
        { nombre: "Chicha morada", precio: 5 },
        { nombre: "Mousse de chocolate", precio: 7 },
      ],
    },
  ];

  const menus = horaActual < 18 ? menusTarde : menusNoche;
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const getSaludo = () => {
    if (horaActual < 12) return "¡Buenos días";
    if (horaActual < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  const confirmarPago = () => {
    if (!metodo) {
      alert("Selecciona un método de pago");
      return;
    }

    const pedido = {
      id: Date.now(),
      items: carrito.map((item) => ({
        ...item,
        id: `${item.nombre}-${Date.now()}`,
      })),
      total,
      metodo,
      estado: "En cocina",
      fecha: new Date().toLocaleString(),
    };

    const pedidosPrevios = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidosPrevios.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosPrevios));

    vaciar();
    setPedidoListo(true);
  };

  return (
    <Fondo imageUrl={fondoCliente}>
      <BarraUsuario />

      <section className="flex flex-col px-4 py-16 min-h-screen gap-6">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
          {/* Saludo */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 text-white">
              {getSaludo()} {usuario?.nombre || "cliente"}! 👋
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 font-semibold text-white">
              Bienvenido a <span className="text-yellow-400">John Kong</span>
            </h2>
          </div>

          {/* Menús */}
          {menus.map((menu, idx) => (
            <div
              key={idx}
              className="bg-black/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                {menu.nombre}
              </h3>
              <p className="mb-4 text-gray-300">{menu.descripcion}</p>

              <div className="flex flex-col gap-3">
                {menu.platos.map((plato, i) => {
                  const platoConId = {
                    ...plato,
                    id: `${menu.nombre}-${plato.nombre}`,
                  };
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row justify-between items-center bg-white/10 p-3 sm:p-4 rounded-lg transition hover:bg-white/20"
                    >
                      <div className="text-center sm:text-left mb-2 sm:mb-0 text-white">
                        <p className="font-semibold">{plato.nombre}</p>
                        <p>S/ {plato.precio}</p>
                      </div>
                      <button
                        onClick={() => agregar(platoConId)}
                        className="px-5 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-lg"
                      >
                        Añadir
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Botón Volver al menú anterior */}
          <div className="flex justify-center mt-4">
            <Boton
              texto="⬅️ Volver"
              onClickOverride={() => navigate("/cliente")}
              bgColor="bg-gray-600 hover:bg-gray-700"
              textColor="text-white"
              className="px-6 py-3 rounded-lg"
            />
          </div>

          {/* Mini carrito */}
          <div className="bg-black/50 p-4 rounded-xl shadow-lg mt-6 flex flex-col gap-3">
            <h3 className="text-xl font-bold text-white">
              Carrito ({carrito.length})
            </h3>
            {carrito.length === 0 ? (
              <p className="text-gray-300">No tienes productos</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-white bg-white/10 p-3 rounded"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="font-semibold">{item.nombre}</p>
                      <p className="text-gray-300">
                        S/ {item.precio * item.cantidad}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => reducir(item)}
                        className="px-3 py-1 rounded bg-gray-600 text-white touch-manipulation"
                      >
                        -
                      </button>
                      <span className="px-2">{item.cantidad}</span>
                      <button
                        onClick={() => agregar(item)}
                        className="px-3 py-1 rounded bg-gray-600 text-white touch-manipulation"
                      >
                        +
                      </button>
                      <button
                        onClick={() => eliminar(item)}
                        className="px-2 py-1 rounded bg-red-600 text-white touch-manipulation"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between font-bold text-white mt-2">
              <span>Total</span>
              <span>S/ {total}</span>
            </div>

            {carrito.length > 0 && (
              <Boton
                texto="Ir a pagar"
                onClickOverride={() => setModalPago(true)}
                bgColor="bg-blue-600 hover:bg-blue-700"
                textColor="text-white"
                className="mt-2 px-6 py-3 rounded-lg text-lg"
              />
            )}
          </div>
        </div>
      </section>

      {/* Modal de pago */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-black/90 p-6 rounded-xl w-full max-w-lg text-white flex flex-col gap-4 relative">
            {/* Botón cerrar solo si el pedido no está listo */}
            {!pedidoListo && (
              <button
                className="absolute top-3 right-3 text-white text-2xl font-bold"
                onClick={() => setModalPago(false)}
              >
                ×
              </button>
            )}

            {pedidoListo ? (
              <div className="flex flex-col gap-4 items-center">
                <h2 className="text-2xl font-bold text-center text-green-400">
                  ¡Pedido registrado!
                </h2>
                <Boton
                  texto="🏠 Volver al inicio"
                  onClickOverride={() => {
                    setModalPago(false);
                    navigate("/cliente");
                  }}
                  bgColor="bg-gray-600 hover:bg-gray-700"
                  textColor="text-white"
                  className="px-6 py-3 rounded-lg"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center">
                  Confirmar Pago
                </h2>

                {/* Lista de productos con scroll */}
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {carrito.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white/10 p-3 rounded"
                    >
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-gray-300">
                          Cantidad: {item.cantidad}
                        </p>
                      </div>
                      <p className="font-bold">
                        S/ {item.precio * item.cantidad}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center bg-white/10 p-3 rounded mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">S/ {total}</span>
                </div>

                {/* Métodos de pago */}
                <h3 className="font-semibold mt-3">Método de pago</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className={`flex-1 p-3 rounded border text-white text-lg ${
                      metodo === "yape" ? "bg-purple-500" : "border-gray-400"
                    }`}
                    onClick={() => setMetodo("yape")}
                  >
                    Yape
                  </button>
                  <button
                    className={`flex-1 p-3 rounded border text-white text-lg ${
                      metodo === "efectivo" ? "bg-green-500" : "border-gray-400"
                    }`}
                    onClick={() => setMetodo("efectivo")}
                  >
                    Efectivo
                  </button>
                </div>

                <button
                  onClick={confirmarPago}
                  className="w-full bg-blue-700 text-white p-3 rounded mt-4 font-semibold hover:bg-blue-800 transition text-lg"
                >
                  Confirmar pago
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Fondo>
  );
}
