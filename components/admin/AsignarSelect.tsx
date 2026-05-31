// Funcion llamada por admin page para asignar un operador logístico a un envío específico. Solo 
// los usuarios con rol "super_admin" pueden realizar esta acción. El componente muestra un select 
// con los operadores disponibles y maneja el proceso de asignación, mostrando errores si ocurren.

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface LogisticoOption {
  clerkUserId: string
  nombre: string
}

interface AsignarSelectProps {
  envio_id: string
  logisticos: LogisticoOption[]
}

export function AsignarSelect({ envio_id, logisticos }: AsignarSelectProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [asignado, setAsignado] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clerkUserId = e.target.value
    if (!clerkUserId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/envios/${envio_id}/asignar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerk_user_id: clerkUserId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Error al asignar')
        return
      }

      setAsignado(data.nombre_logistico)
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (asignado) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold flex items-center justify-center flex-shrink-0">
          {asignado[0].toUpperCase()}
        </div>
        <span className="text-sm text-[#1e1b4b]">{asignado}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        defaultValue=""
        onChange={handleChange}
        disabled={loading}
        className="text-xs border border-[#7c3aed]/30 rounded-lg px-2.5 py-1.5 bg-white text-[#1e1b4b] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 disabled:opacity-50 cursor-pointer min-w-[160px]"
        aria-label="Asignar operador logístico"
      >
        <option value="" disabled>
          {loading ? 'Asignando...' : 'Asignar operador...'}
        </option>
        {logisticos.map((l) => (
          <option key={l.clerkUserId} value={l.clerkUserId}>
            {l.nombre}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  )
}
