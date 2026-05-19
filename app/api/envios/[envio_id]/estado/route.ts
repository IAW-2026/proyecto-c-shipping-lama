// app/api/envios/[envio_id]/estado/route.ts
// Api interna para que el operador logístico pueda cambiar el estado del envío. Endpoint: PATCH /api/envios/[envio_id]/estado

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// Transiciones válidas de estado
const TRANSICIONES: Record<string, string[]> = {
  'en_preparacion': ['en_camino', 'cancelado'],
  'en_camino':      ['entregado', 'cancelado'],
  'entregado':      [],
  'cancelado':      [],
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ envio_id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { envio_id } = await params
  const { nuevo_estado } = await request.json()

  if (!nuevo_estado) {
    return NextResponse.json({ error: 'Falta el nuevo estado' }, { status: 400 })
  }

  try {
    // Buscar el envío
    const envio = await prisma.envio.findUnique({
      where: { envio_id }
    })

    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario logueado es el operador asignado
    const operador = await prisma.usuarioLogistico.findUnique({
      where: { clerk_user_id: userId }
    })

    if (!operador || envio.logistico_id !== operador.logistico_id) {
      return NextResponse.json(
        { error: 'Solo el operador asignado puede cambiar el estado' },
        { status: 403 }
      )
    }

    // Verificar que la transición es válida
    const transicionesValidas = TRANSICIONES[envio.estado_actual] ?? []
    if (!transicionesValidas.includes(nuevo_estado)) {
      return NextResponse.json(
        { error: `No se puede cambiar de '${envio.estado_actual}' a '${nuevo_estado}'` },
        { status: 422 }
      )
    }

    // Actualizar el estado
    const envioActualizado = await prisma.envio.update({
      where: { envio_id },
      data: { estado_actual: nuevo_estado }
    })


    // Mapear tu estado al estado que espera Seller App
    const ESTADO_MAP: Record<string, string> = {
        'en_preparacion': 'en_preparacion',
        'en_camino':      'despachado',
        'entregado':      'entregado',
        'cancelado':      'cancelado',
    }

    // Notificar a Seller App a traves de su API que el estado del envío ha cambiado
    try {
        await fetch(`${process.env.SELLER_APP_URL}/api/ordenes-ventas/${envio.orden_id}/estado-envio`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estado_envio: ESTADO_MAP[nuevo_estado],
                envio_id: envio.envio_id,
                codigo_seguimiento: envio.codigo_seguimiento,
            })
        })
    } catch (error) {
    // No fallamos si Seller App no responde, solo logueamos
    console.error('Error al notificar a Seller App:', error)
    }

    // Notificar a Payments App si el envío fue entregado
    if (nuevo_estado === 'entregado') {
      try {
        await fetch(`${process.env.PAYMENTS_APP_URL}/api/pagos/orden/liberar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orden_id: envio.orden_id,
            envio_id: envio.envio_id,
          })
        })
      } catch (error) {
        console.error('Error al notificar a Payments App:', error)
      }
    }

    return NextResponse.json({
      envio_id: envioActualizado.envio_id,
      estado_actual: envioActualizado.estado_actual
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}