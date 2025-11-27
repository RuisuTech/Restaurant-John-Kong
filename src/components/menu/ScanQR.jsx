import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMesa } from "../../context/MesaContext"; // ✅ usar contexto
import QrReader from "react-qr-reader-es6";
import QrCode from "qrcode-decoder";

export default function ScanQR() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setMesa } = useMesa();

  // Manejar QR desde cámara
  const handleScan = (data) => {
    if (data) {
      setMesa(data);
      localStorage.setItem("mesaSeleccionada", data);
      navigate("/menu");
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("No se pudo leer el QR desde la cámara.");
  };

  // Manejar QR desde imagen
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const qr = new QrCode();
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const result = await qr.decodeFromImage(e.target.result);
        if (result) handleScan(result.data);
        else setError("No se detectó un QR válido en la imagen.");
      } catch (err) {
        console.error(err);
        setError("Error leyendo el QR de la imagen.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* Cámara */}
      <div className="w-full max-w-md mx-auto bg-black/20 p-4 rounded-lg shadow-lg">
        <QrReader
          onResult={(result, error) => {
            if (!!result) handleScan(result?.text);
            if (!!error) console.warn(error);
          }}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%" }}
        />
      </div>

      {/* Subir imagen */}
      <div className="flex flex-col items-center gap-2">
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Subir imagen QR
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
