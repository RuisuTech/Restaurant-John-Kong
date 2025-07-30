// /api/usuarios/[id].js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "db.json");
  const id = parseInt(req.query.id);

  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);
    const usuarios = data.usuarios || [];

    const index = usuarios.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (req.method === "PATCH") {
      const cambios = req.body;

      // Puedes validar los campos si lo deseas, aquí solo actualizamos
      data.usuarios[index] = {
        ...usuarios[index],
        ...cambios,
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json(data.usuarios[index]);
    }

    res.setHeader("Allow", ["PATCH"]);
    return res
      .status(405)
      .json({ mensaje: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error("Error en /api/usuarios/[id]:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
