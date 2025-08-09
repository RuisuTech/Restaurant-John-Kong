// Footer.jsx
function Footer() {
  return (
    <footer
      className="
        bg-black/30 backdrop-blur-sm shadow text-white py-3 px-4
        flex justify-between items-center
        w-full
      "
    >
      <span className="text-sm opacity-80">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </span>
      <span className="text-sm">Versión 1.0.0</span>
    </footer>
  );
}

export default Footer;
