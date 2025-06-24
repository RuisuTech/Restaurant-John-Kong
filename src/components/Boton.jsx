import { useNavigate } from "react-router-dom";

function Boton({
  children,
  ruta = "",
  bgColor = "bg-green-600",
  textColor = "text-white",
  onClickOverride,
  className = "w-full",
}) {
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
      className={`px-6 py-2 rounded-xl font-medium transition 
        ${bgColor} ${textColor} hover:opacity-90 
        dark:hover:opacity-95 ${className}`}
    >
      {children}
    </button>
  );
}

export default Boton;
