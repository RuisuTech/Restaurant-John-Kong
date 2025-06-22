// src/components/Boton.jsx
import { useNavigate } from "react-router-dom";

function Boton({ texto, ruta = "", bgColor = "bg-green-600", textColor = "text-white", onClickOverride }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClickOverride) {
      onClickOverride();
    } else {
      navigate(ruta);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full px-6 py-2 rounded font-medium transition 
        ${bgColor} ${textColor} hover:opacity-90 
        dark:hover:opacity-95`}
    >
      {texto}
    </button>
  );
}

export default Boton;
