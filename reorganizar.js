// reorganizar.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Necesario para obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Mapeo de archivos y nuevas rutas
const moves = [
  // UI
  ["src/components/Boton.jsx", "src/components/ui/Boton.jsx"],
  ["src/components/CajaContenido.jsx", "src/components/ui/CajaContenido.jsx"],
  ["src/components/LinkSpan.jsx", "src/components/ui/LinkSpan.jsx"],
  ["src/components/ModalBase.jsx", "src/components/ui/ModalBase.jsx"],
  ["src/components/ModalAlerta.jsx", "src/components/ui/ModalAlerta.jsx"],
  ["src/components/ModalConfirmacion.jsx", "src/components/ui/ModalConfirmacion.jsx"],
  ["src/components/ModalError.jsx", "src/components/ui/ModalError.jsx"],
  ["src/components/ModalExito.jsx", "src/components/ui/ModalExito.jsx"],
  ["src/components/ToggleTema.jsx", "src/components/ui/ToggleTema.jsx"],
  ["src/components/PantallaCargando.jsx", "src/components/ui/PantallaCargando.jsx"],

  // Layout
  ["src/components/BarraUsuario.jsx", "src/components/layout/BarraUsuario.jsx"],
  ["src/components/Fondo.jsx", "src/components/layout/Fondo.jsx"],
  ["src/components/Footer.jsx", "src/components/layout/Footer.jsx"],
  ["src/components/CalendarioReserva.jsx", "src/components/layout/CalendarioReserva.jsx"],

  // Reservas
  ["src/components/Horarios.jsx", "src/components/reservas/Horarios.jsx"],

  // Auth Pages
  ["src/pages/Login.jsx", "src/pages/Auth/Login.jsx"],
  ["src/pages/Registro.jsx", "src/pages/Auth/Registro.jsx"],
  ["src/pages/Recuperar.jsx", "src/pages/Auth/Recuperar.jsx"],
  ["src/pages/CambiarContrasena.jsx", "src/pages/Auth/CambiarContrasena.jsx"],
  ["src/pages/VerificarCodigo.jsx", "src/pages/Auth/VerificarCodigo.jsx"],
];

// 📌 Carpetas necesarias
const dirs = [
  "src/components/ui",
  "src/components/layout",
  "src/components/reservas",
  "src/pages/Auth",
];

// 📌 Crear carpetas si no existen
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Carpeta creada: ${dir}`);
  }
});

// 📌 Mover archivos
moves.forEach(([from, to]) => {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`📦 Movido: ${from} → ${to}`);
  }
});

// 📌 Función para actualizar imports
function updateImports(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      updateImports(fullPath);
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");

      moves.forEach(([oldPath, newPath]) => {
        const oldImport = oldPath.replace("src/", "./").replace(/\.jsx$/, "");
        const newImport = path
          .relative(path.dirname(fullPath), newPath)
          .replace(/\\/g, "/")
          .replace(/\.jsx$/, "");

        const regex = new RegExp(`(['"])${oldImport}\\1`, "g");
        content = content.replace(regex, `'${newImport}'`);
      });

      fs.writeFileSync(fullPath, content, "utf8");
    }
  });
}

// 📌 Actualizar imports en todo src
updateImports(path.join(__dirname, "src"));

console.log("✅ Reorganización y actualización de imports completada.");
