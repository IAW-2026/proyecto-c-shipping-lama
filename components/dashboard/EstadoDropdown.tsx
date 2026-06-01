// components/dashboard/EstadoDropdown.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { showToast } from "@/lib/toast"

interface EstadoDropdownProps {
  envio_id: string
  estado_actual: string
  es_mi_envio: boolean
}

const TRANSICIONES: Record<string, { label: string; color: string }[]> = {
  'en_preparacion': [
    { label: 'En camino',  color: 'transit'   },
    { label: 'Cancelado',  color: 'cancelled' },
  ],
  'en_camino': [
    { label: 'Entregado',  color: 'delivered' },
    { label: 'Cancelado',  color: 'cancelled' },
  ],
  'entregado': [],
  'cancelado': [],
}

const LABEL_TO_VALUE: Record<string, string> = {
  'En camino':  'en_camino',
  'Entregado':  'entregado',
  'Cancelado':  'cancelado',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  en_preparacion: { label: 'En preparación', color: 'status-prep'      },
  en_camino:      { label: 'En camino',       color: 'status-transit'   },
  entregado:      { label: 'Entregado',       color: 'status-delivered' },
  cancelado:      { label: 'Cancelado',       color: 'status-cancelled' },
}

export function EstadoDropdown({ envio_id, estado_actual, es_mi_envio }: EstadoDropdownProps) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const router                = useRouter()
  const ref                   = useRef<HTMLDivElement>(null)
  const btnRef                = useRef<HTMLButtonElement>(null)

  const status      = STATUS_CONFIG[estado_actual] ?? { label: estado_actual, color: 'status-prep' }
  const transiciones = TRANSICIONES[estado_actual] ?? []
  const esFinal     = transiciones.length === 0

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setError(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCambiarEstado = async (label: string) => {
    const nuevo_estado = LABEL_TO_VALUE[label]
    if (!nuevo_estado) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/envios/${envio_id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setOpen(false)

      // Mostrar toast de Seller App
      if (data.notificaciones?.seller) {
        const s = data.notificaciones.seller
        showToast({ app: 'seller', method: s.method, url: s.url, status: s.status, ok: s.ok, body: s.body, error: s.error })
      }

      // Mostrar toast de Payments App con leve delay para que se vean apilados
      if (data.notificaciones?.payments) {
        const p = data.notificaciones.payments
        setTimeout(() => {
          showToast({ app: 'payments', method: p.method, url: p.url, status: p.status, ok: p.ok, body: p.body, error: p.error })
        }, 350)
      }

      router.refresh()

    } catch {
      setError('Error al cambiar el estado')
    } finally {
      setLoading(false)
    }
  }

  // Estado final — solo mostrar el badge sin interacción
  if (esFinal) {
    return (
      <span className={`status-badge ${status.color}`}>
        <span className="status-dot" />
        {status.label}
      </span>
    )
  }

  // No es el operador asignado — solo mostrar el badge
  if (!es_mi_envio) {
    return (
      <span className={`status-badge ${status.color}`}>
        <span className="status-dot" />
        {status.label}
      </span>
    )
  }

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 6, left: rect.left })
    }
    setOpen(o => !o)
    setError(null)
  }

  // Es el operador asignado y el estado no es final — mostrar dropdown
  return (
    <div className="estado-wrapper" ref={ref}>
      <button
        ref={btnRef}
        className={`status-badge ${status.color} estado-trigger`}
        onClick={handleToggle}
        disabled={loading}
        aria-label="Cambiar estado del envío"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="status-dot" />
        {status.label}
        <svg
          width="10" height="10"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={`estado-chevron ${open ? 'open' : ''}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && menuPos && (
        <div
          className="estado-menu"
          role="menu"
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
        >
          <p className="estado-menu-title">Cambiar a</p>
          {transiciones.map((t) => (
            <button
              key={t.label}
              className={`estado-option estado-option--${t.color}`}
              onClick={() => handleCambiarEstado(t.label)}
              disabled={loading}
              role="menuitem"
            >
              <span className={`estado-option-dot estado-option-dot--${t.color}`} aria-hidden="true" />
              {t.label}
            </button>
          ))}
          {error && <p className="estado-error" role="alert">{error}</p>}
        </div>
      )}
    </div>
  )
}