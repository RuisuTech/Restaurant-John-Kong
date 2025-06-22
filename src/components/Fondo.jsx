// src/components/Fondo.jsx
function Fondo({ imageUrl, children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 "
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {children}
    </div>
  );
}

export default Fondo;
