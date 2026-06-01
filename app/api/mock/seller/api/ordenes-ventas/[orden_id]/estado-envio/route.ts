// app/api/mock/seller/ordenes-ventas/[orden_id]/estado-envio/route.ts
// Simula la api que expone seller app y yo llamo 
// Utilizo la respuesta de Seller App al recibir un cambio de estado de envío en 
// Contrato: PATCH /api/ordenes-ventas/{orden_id}/estado-envio

import { NextRequest, NextResponse } from 'next/server'

const ESTADOS_VALIDOS = ['pendiente', 'en_preparacion', 'despachado', 'entregado', 'cancelado']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orden_id: string }> }
) {
  const { orden_id } = await params
  const body = await request.json()

  console.log('[Mock Seller App] PATCH estado-envio recibido:', { orden_id, ...body })

  // Validar campos requeridos
  const { estado_envio, envio_id, codigo_seguimiento } = body

  if (!estado_envio) {
    return NextResponse.json(
      { error: 'Falta el campo requerido: estado_envio' },
      { status: 400 }
    )
  }

  if (!ESTADOS_VALIDOS.includes(estado_envio)) {
    return NextResponse.json(
      { error: `estado_envio inválido: '${estado_envio}'. Valores aceptados: ${ESTADOS_VALIDOS.join(', ')}` },
      { status: 422 }
    )
  }

  // Respuesta según el contrato definido en 03-apis.md
  return NextResponse.json({
    orden_id,
    estado_general: estado_envio === 'entregado' ? 'completada' : 'en_preparacion',
    estado_envio,
    fecha_actualizacion: new Date().toISOString(),
    // Datos opcionales recibidos (para facilitar el debug)
    _mock: true,
    _recibido: { envio_id, codigo_seguimiento },
  })
}