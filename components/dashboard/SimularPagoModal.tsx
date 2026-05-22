// Quiero simular el pago de un envío para que se registre en el historial de entregas. Para eso, voy a crear un nuevo modal llamado SimularPagoModal que se abrirá al hacer click en un botón en la barra superior del dashboard. Este modal tendrá un formulario con un campo para ingresar el ID del envío y un botón para simular el pago. Al hacer click en el botón, se enviará una solicitud POST a la API app/api/envios/orden/[orden_id]/liquidacion-logistico que cree que se encargará de registrar el pago en la base de datos y actualizar el historial de entregas. Luego, el modal mostrará un mensaje de éxito o error según corresponda.

"use client";

import { useState } from "react";

type Estado = "idle" | "loading" | "success" | "error";
interface ResultadoRequest {
  status: number;
  data: unknown;
}
export default function SimularPagoModal() {
  const [abierto, setAbierto] = useState(false);
  const [ordenId, setOrdenId] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [resultado, setResultado] = useState<ResultadoRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
    function abrir() {
    setAbierto(true);
    setEstado("idle");
    setResultado(null);
    setError(null);
    setOrdenId("");
  }

    function cerrar() {
    setAbierto(false);
    setEstado("idle");
    setResultado(null);
    setError(null);
    setOrdenId("");
  }     
    async function enviar() {
    if (!ordenId.trim()) {
      setError("Completá el campo de ID de orden.");
      return;
    }
    setEstado("loading");
    setError(null);
    setResultado(null);
    try {      const res = await fetch(`/api/envios/orden/${ordenId.trim()}/liquidacion-logistico`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_liquidacion_logistico: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setResultado({ status: res.status, data });
      setEstado(res.ok ? "success" : "error");
    } catch (error) {
      setError("Error al simular el pago. Intentá nuevamente.");
      setEstado("error");
    }
    }
    return (
    <>
      <button
        onClick={abrir}
        className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span>💰</span>
        Simular pago de un envío
      </button>
        {abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Simular pago de un envío</h2>
            <input
              type="text"
              placeholder="ID de la orden"
                value={ordenId}
                onChange={(e) => setOrdenId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cerrar}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={enviar}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={estado === "loading"}
              >
                {estado === "loading" ? "Simulando..." : "Simular pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
}


    