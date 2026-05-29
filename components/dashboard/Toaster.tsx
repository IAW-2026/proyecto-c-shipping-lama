"use client"

import { useEffect, useState, useCallback } from "react"
import type { ToastNotification } from "@/lib/toast"
import styles from "./Toaster.module.css"

const APP_CONFIG = {
  seller: {
    label: "Seller App notificada",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" x2="12" y1="12" y2="12" />
      </svg>
    ),
    accent: "#8fa18d",
  },
  payments: {
    label: "Payments App notificada",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
    accent: "#6b7f6a",
  },
}

function extractPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

interface ToastItemProps {
  toast: ToastNotification
  exiting: boolean
  onClose: () => void
}

function ToastItem({ toast, exiting, onClose }: ToastItemProps) {
  const config = APP_CONFIG[toast.app]
  const path = extractPath(toast.url)

  useEffect(() => {
    const t = setTimeout(onClose, 7000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className={`${exiting ? styles.toastExiting : styles.toast} w-96 bg-white rounded-xl overflow-hidden shadow-lg`}
      style={{ borderLeft: `3px solid ${config.accent}`, border: `1px solid rgba(143,161,141,0.2)`, borderLeftWidth: "3px", borderLeftColor: config.accent }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ color: config.accent }}>{config.icon}</span>
            <span className="text-sm font-semibold text-[#2d2d2d]">{config.label}</span>
          </div>
          <p className="text-[11px] font-mono text-[#a8a8a8] leading-tight truncate">
            <span className="font-bold" style={{ color: config.accent }}>{toast.method}</span>
            {" "}{path}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#a8a8a8] hover:text-[#2d2d2d] transition-colors mt-0.5 shrink-0"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[#8fa18d]/15" />

      {/* Status + body */}
      <div className="px-4 pt-2 pb-3">
        {toast.error ? (
          <p className="text-xs text-red-600 font-medium mb-2">⚠ {toast.error}</p>
        ) : (
          <p className={`text-xs font-semibold mb-2 ${toast.ok ? "text-[#6b7f6a]" : "text-red-600"}`}>
            {toast.ok ? "✓" : "✗"} {toast.status} {toast.ok ? "OK" : "Error"}
          </p>
        )}

        {toast.body != null && (
          <pre className="text-[11px] font-mono bg-[#f6f1e7] rounded-lg p-2.5 overflow-auto max-h-40 text-[#37413d] whitespace-pre-wrap break-all leading-relaxed">
            {JSON.stringify(toast.body, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

interface ToastState {
  toast: ToastNotification
  exiting: boolean
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev =>
      prev.map(t => t.toast.id === id ? { ...t, exiting: true } : t)
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toast.id !== id))
    }, 280)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const toast = (e as CustomEvent<ToastNotification>).detail
      setToasts(prev => [...prev, { toast, exiting: false }])
    }
    window.addEventListener("lama:toast", handler)
    return () => window.removeEventListener("lama:toast", handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(({ toast, exiting }) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            exiting={exiting}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
