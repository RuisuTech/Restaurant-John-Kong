// /api/usuarios.js
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db.json");

export default async function handler(req, res) {
  try {
    const json = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(json);

    console.log("→ [GET] /api/usuarios llamado");

    if (req.method === "GET") {
      console.log("Usuarios actuales:", data.usuarios);
      return res.status(200).json(data.usuarios || []);
    }

    if (req.method === "POST") {
      const nuevoUsuario = req.body;
      console.log("→ [POST] nuevo usuario:", nuevoUsuario);

      if (!nuevoUsuario.nombre || !nuevoUsuario.correo || !nuevoUsuario.rol) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
      }

      const existe = data.usuarios.some(
        (u) => u.correo.toLowerCase() === nuevoUsuario.correo.toLowerCase()
      );

      if (existe) {
        return res.status(409).json({ mensaje: "El correo ya está registrado" });
      }

      nuevoUsuario.id = Date.now();
      data.usuarios.push(nuevoUsuario);

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return res.status(201).json(nuevoUsuario);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ mensaje: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error("🔥 Error en /api/usuarios:", error.message);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
