import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "db.json");

  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);
    const reservas = data.reservas || [];

    if (req.method === "PATCH") {
      const { id, estado } = req.body;
      if (!id || !estado)
        return res.status(400).json({ error: "Faltan datos" });

      const index = data.reservas.findIndex((r) => r.id === id);
      if (index === -1)
        return res.status(404).json({ error: "Reserva no encontrada" });

      data.reservas[index].estado = estado;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json(data.reservas[index]);
    }

    if (req.method === "GET") {
      return res.status(200).json(reservas);
    }

    if (req.method === "POST") {
      const nuevaReserva = req.body;

      // Aceptar usuario o cliente
      nuevaReserva.usuario = nuevaReserva.usuario || nuevaReserva.cliente;

      if (
        !nuevaReserva.fecha ||
        !nuevaReserva.hora ||
        !nuevaReserva.mesa ||
        !nuevaReserva.usuario
      ) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
      }

      // Verificar si ya hay una reserva confirmada para esa mesa y hora
      const yaExiste = reservas.some(
        (r) =>
          r.fecha === nuevaReserva.fecha &&
          r.hora === nuevaReserva.hora &&
          r.mesa === nuevaReserva.mesa &&
          r.estado === "confirmada"
      );

      if (yaExiste) {
        return res
          .status(409)
          .json({ mensaje: "Ya hay una reserva confirmada para esa mesa." });
      }

      nuevaReserva.id = Date.now();
      nuevaReserva.fechaConfirmacion =
        nuevaReserva.fechaConfirmacion || new Date().toISOString();

      data.reservas = [...reservas, nuevaReserva];

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      return res.status(201).json(nuevaReserva);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ mensaje: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error("Error en la API de reservas (POST):", error.message);
    console.error("Stack:", error.stack);
    return res
      .status(500)
      .json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
}
