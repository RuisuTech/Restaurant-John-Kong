// ✅ ModalAlerta.jsx
import { useEffect } from "react";

function ModalAlerta({ visible, mensaje, tipo = "info", onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const colores = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div
        className={`relative px-6 py-4 rounded shadow-lg text-white text-center w-11/12 max-w-sm ${
          colores[tipo] || "bg-blue-500"
        }`}
      >
        <p>{mensaje}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default ModalAlerta;


