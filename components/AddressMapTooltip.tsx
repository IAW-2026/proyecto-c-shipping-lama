"use client"

import { useState, useRef } from "react"

interface Props {
  address: string
}

export function AddressMapTooltip({ address }: Props) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  function show() {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.top - 200 - 8, left: rect.left })
    }
    setVisible(true)
  }

  function hide() {
    hideTimeout.current = setTimeout(() => setVisible(false), 150)
  }

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="flex items-center gap-1.5 text-sm"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{address}</span>
      </div>
      {visible && (
        <div
          style={{ position: "fixed", top: pos.top, left: pos.left }}
          className="z-50 shadow-lg rounded-lg border border-gray-200 overflow-hidden"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <iframe
            src={mapUrl}
            width={280}
            height={200}
            style={{ border: 0, display: "block" }}
            loading="lazy"
            title={`Mapa: ${address}`}
          />
        </div>
      )}
    </>
  )
}
