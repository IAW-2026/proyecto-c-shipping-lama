'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#f6f1e7] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 text-[#8fa18d] text-8xl font-bold tracking-tight select-none">
        500
      </div>

      <h1 className="text-2xl font-semibold text-[#37413d] mb-2">
        Algo salió mal
      </h1>
      <p className="text-[#6b7f6a] mb-8 max-w-xs">
        Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#8fa18d] text-white rounded-lg text-sm font-medium hover:bg-[#6b7f6a] transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-[#8fa18d] text-[#6b7f6a] rounded-lg text-sm font-medium hover:bg-[#8fa18d]/10 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
