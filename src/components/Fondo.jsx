// src/components/Fondo.jsx
function Fondo({ imageUrl, children, className }) {

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 `}>
      <div
        className={`absolute inset-0 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default Fondo;
