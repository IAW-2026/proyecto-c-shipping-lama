// app/api/mock/payments/pagos/orden/liberar/route.ts
// Simula la respuesta de Payments App al recibir notificación de entrega
// Contrato: POST /api/pagos/orden/liberar

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  console.log('[Mock Payments App] POST liberar pago recibido:', body)

  // Validar campos requeridos
  const { orden_id, envio_id } = body

  const faltantes = []
  if (!orden_id) faltantes.push('orden_id')
  if (!envio_id) faltantes.push('envio_id')

  if (faltantes.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos requeridos: ${faltantes.join(', ')}` },
      { status: 400 }
    )
  }

  // Respuesta según el contrato definido en 03-apis.md
  return NextResponse.json({
    orden_id,
    _mock: true,
  })
}