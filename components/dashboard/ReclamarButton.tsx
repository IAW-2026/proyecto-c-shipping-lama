// components/dashboard/ReclamarButton.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface ReclamarButtonProps {
  envio_id: string
}

export function ReclamarButton({ envio_id }: ReclamarButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleReclamar = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/envios/${envio_id}/reclamar`, {
        method: 'PATCH',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      // Refresca el Server Component para mostrar el operador asignado
      router.refresh()

    } catch {
      setError('Error al reclamar el envío')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="reclamar-wrapper">
      <button
        onClick={handleReclamar}
        disabled={isLoading}
        className={`reclamar-btn ${isLoading ? 'reclamar-btn--loading' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="reclamar-spinner" />
            Reclamando...
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 7H9.5a4.5 4.5 0 0 0 0 9H13" />
              <path d="m17 4 3 3-3 3" />
            </svg>
            Reclamar
          </>
        )}
      </button>
      {error && <span className="reclamar-error">{error}</span>}
    </div>
  )
}