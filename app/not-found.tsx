import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f6f1e7] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 text-[#8fa18d] text-8xl font-bold tracking-tight select-none">
        404
      </div>

      <h1 className="text-2xl font-semibold text-[#37413d] mb-2">
        Página no encontrada
      </h1>
      <p className="text-[#6b7f6a] mb-8 max-w-xs">
        El recurso que buscás no existe o fue movido.
      </p>

      <Link
        href="/"
        className="px-5 py-2.5 bg-[#8fa18d] text-white rounded-lg text-sm font-medium hover:bg-[#6b7f6a] transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
