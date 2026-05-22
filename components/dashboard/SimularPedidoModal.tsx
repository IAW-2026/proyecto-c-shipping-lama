// Formulario para simular la llamada de Seller App a la API de envíos POST api/envios, carga en la base de datos y muestra en el dashboard.

"use client";

import { useState } from "react";

type Estado = "idle" | "loading" | "success" | "error";

interface ResultadoRequest {
  status: number;
  data: unknown;
}

export default function SimularPedidoModal() {
  const [abierto, setAbierto] = useState(false);
  const [ordenId, setOrdenId] = useState("");
  const [direccionDestino, setDireccionDestino] = useState("");
  const [vendedorId, setVendedorId] = useState("");
  const [autoAsignar, setAutoAsignar] = useState(true);
  const [estado, setEstado] = useState<Estado>("idle");
  const [resultado, setResultado] = useState<ResultadoRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  function abrir() {
    setAbierto(true);
    setEstado("idle");
    setResultado(null);
    setError(null);
    setOrdenId("");
    setDireccionDestino("");
    setVendedorId("");
    setAutoAsignar(true);
  }

  function cerrar() {
    setAbierto(false);
  }

  async function enviar() {
    if (!ordenId.trim() || !direccionDestino.trim() || !vendedorId.trim()) {
      setError("Completá todos los campos requeridos.");
      return;
    }

    setEstado("loading");
    setError(null);
    setResultado(null);

    const body = {
      orden_id: ordenId.trim(),
      direccion_destino: direccionDestino.trim(),
      vendedor_id: vendedorId.trim(),
      // Flag para que el POST route auto-asigne el envío al operador logueado
      auto_asignar: autoAsignar,
    };

    try {
      const res = await fetch("/api/envios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResultado({ status: res.status, data });
      setEstado(res.ok ? "success" : "error");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red desconocido");
      setEstado("error");
    }
  }

  return (
    <>
      <button
        onClick={abrir}
        className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span>▶</span>
        Simular creacion de un envio
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.target === e.currentTarget && cerrar()}
        >
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6 mx-4 shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="inline-block text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 font-medium mb-2">
                  🧪 Mock — Etapa 2
                </span>
                <h2 className="text-base font-medium text-gray-900">
                  Simular llamada de Seller App a mi api
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  POST /api/envios
                </p>
              </div>
              <button
                onClick={cerrar}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4 border-t pt-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  orden_id <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ordenId}
                  onChange={(e) => setOrdenId(e.target.value)}
                  placeholder="ej: orden-001"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  direccion_destino <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccionDestino}
                  onChange={(e) => setDireccionDestino(e.target.value)}
                  placeholder="ej: Av. Alem 1234, Bahía Blanca"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  vendedor_id <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vendedorId}
                  onChange={(e) => setVendedorId(e.target.value)}
                  placeholder="ej: vendedor-001"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Resultado */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                ⚠ {error}
              </div>
            )}

            {resultado && (
              <div
                className={`mt-4 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap break-all ${
                  estado === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {estado === "success" ? "✓" : "✗"} {resultado.status}
                {"\n\n"}
                {JSON.stringify(resultado.data, null, 2)}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3 mt-5 pt-5 border-t">
              {estado === "success" ? (
                <button
                  onClick={cerrar}
                  className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              ) : (
                <>
                  <button
                    onClick={cerrar}
                    className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviar}
                    disabled={estado === "loading"}
                    className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {estado === "loading" ? (
                      <>
                        <span className="animate-spin">⟳</span> Enviando...
                      </>
                    ) : (
                      "Enviar request"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}