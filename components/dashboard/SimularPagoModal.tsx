"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Estado = "idle" | "loading" | "success" | "error";

interface ResultadoRequest {
  status: number;
  data: unknown;
}

export default function SimularPagoModal() {
  const router = useRouter();
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
    try {
      // Verificar que el envío existe y está entregado
      const checkRes = await fetch(`${process.env.NEXT_PUBLIC_SHIPPING_APP_URL}/api/envios/orden/${ordenId.trim()}`);
      if (!checkRes.ok) {
        const checkData = await checkRes.json();
        setError(checkData.error ?? "No se encontró el envío.");
        setEstado("idle");
        return;
      }
      const checkData = await checkRes.json();
      if (checkData.estado !== "entregado") {
        setError(`El envío debe estar en estado 'entregado' para registrar el pago. Estado actual: '${checkData.estado}'.`);
        setEstado("idle");
        return;
      }

      // Proceder con el pago
      const res = await fetch(`${process.env.NEXT_PUBLIC_SHIPPING_APP_URL}/api/envios/orden/${ordenId.trim()}/liquidacion-logistico`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_liquidacion_logistico: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setResultado({ status: res.status, data });
      setEstado(res.ok ? "success" : "error");
      if (res.ok) router.refresh();
    } catch {
      setError("Error al simular el pago. Intentá nuevamente.");
      setEstado("error");
    }
  }

  return (
    <>
      <button
        onClick={abrir}
        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-white/30 rounded-lg text-white/80 bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
        Simular pago
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.target === e.currentTarget && cerrar()}
        >
          <div className="bg-white rounded-xl border border-[#8fa18d]/20 w-full max-w-md p-6 mx-4 shadow-lg">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="inline-block text-xs px-2 py-1 rounded-md bg-[#8fa18d]/10 text-[#6b7f6a] font-medium mb-2">
                  🧪 Mock — Etapa 2
                </span>
                <h2 className="text-base font-medium text-[#2d2d2d]">
                  Simular pago de un envío
                </h2>
                <p className="text-xs text-[#7a7a7a] mt-0.5 font-mono">
                  PATCH /api/envios/orden/[orden_id]/liquidacion-logistico
                </p>
              </div>
              <button
                onClick={cerrar}
                className="text-[#a8a8a8] hover:text-[#2d2d2d] p-1 transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 border-t border-[#8fa18d]/15 pt-5">
              <div>
                <label className="block text-sm text-[#7a7a7a] mb-1.5">
                  orden_id <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ordenId}
                  onChange={(e) => setOrdenId(e.target.value)}
                  placeholder="ej: orden-001"
                  className="w-full border border-[#8fa18d]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8fa18d]/40"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                ⚠ {error}
              </div>
            )}

            {resultado && (
              <div
                className={`mt-4 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap break-all ${
                  estado === "success"
                    ? "bg-[#8fa18d]/10 text-[#6b7f6a]"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {estado === "success" ? "✓" : "✗"} {resultado.status}
                {"\n\n"}
                {JSON.stringify(resultado.data, null, 2)}
              </div>
            )}

            <div className="flex gap-3 mt-5 pt-5 border-t border-[#8fa18d]/15">
              {estado === "success" ? (
                <button
                  onClick={cerrar}
                  className="flex-1 py-2 text-sm bg-[#8fa18d] text-white rounded-lg hover:bg-[#6b7f6a] transition-colors"
                >
                  Cerrar
                </button>
              ) : (
                <>
                  <button
                    onClick={cerrar}
                    className="flex-1 py-2 text-sm border border-[#8fa18d]/25 rounded-lg text-[#7a7a7a] hover:bg-[#f6f1e7] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviar}
                    disabled={estado === "loading"}
                    className="flex-1 py-2 text-sm bg-[#8fa18d] text-white rounded-lg hover:bg-[#6b7f6a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {estado === "loading" ? (
                      <>
                        <span className="animate-spin inline-block">⟳</span> Simulando...
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
