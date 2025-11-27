function MenuSelector({ tipo, setTipo }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-2">Selecciona el tipo de menú</h3>

      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded-lg border ${
            tipo === "almuerzo" ? "bg-green-600 text-white" : "bg-white text-black"
          }`}
          onClick={() => setTipo("almuerzo")}
        >
          Almuerzo
        </button>

        <button
          className={`px-4 py-2 rounded-lg border ${
            tipo === "cena" ? "bg-green-600 text-white" : "bg-white text-black"
          }`}
          onClick={() => setTipo("cena")}
        >
          Cena
        </button>
      </div>
    </div>
  );
}

export default MenuSelector;
