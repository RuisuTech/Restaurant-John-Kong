// api/reservas/[id].js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "db.json");

  try {
    const id = parseInt(req.query.id); // ← obtenemos el ID de la URL
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);
    const reservas = data.reservas || [];

    const index = reservas.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (req.method === "PATCH") {
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({ error: "Falta el estado" });
      }

      data.reservas[index].estado = estado;

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json(data.reservas[index]);
    }

    if (req.method === "DELETE") {
      data.reservas.splice(index, 1);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json({ mensaje: "Reserva eliminada" });
    }

    res.setHeader("Allow", ["PATCH", "DELETE"]);
    return res
      .status(405)
      .json({ mensaje: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error("Error en API /api/reservas/[id]:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
