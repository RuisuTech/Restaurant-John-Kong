function Footer() {
  return (
    <footer
      className="
        bg-black/30 backdrop-blur-sm shadow text-white py-3 px-4
        flex justify-between items-center
        w-full
      "
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      <span className="text-sm opacity-80">
        © {new Date().getFullYear()} John Kong. Todos los derechos reservados.
      </span>
      <span className="text-sm">Versión 1.0.0</span>
    </footer>
  );
}

export default Footer;
