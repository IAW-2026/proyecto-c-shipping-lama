// app/api/envios/orden/[orden_id]/liquidacion-logistico/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getApiKey(request: NextRequest) {
  const bearer = request.headers.get('authorization')?.replace('Bearer ', '')
  return bearer ?? request.headers.get('x-api-key') ?? undefined
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orden_id: string }> }
) {
  const key = getApiKey(request)
  if (key !== process.env.PAYMENTS_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { orden_id } = await params
  const body = await request.json()
  const fecha = body['fecha_actualización'] ?? body['fecha_actualizacion']

  if (!fecha) {
    return NextResponse.json(
      { error: 'Falta la fecha de liquidación' },
      { status: 400 }
    )
  }

  try {
    const envio = await prisma.envio.findFirst({
      where: { orden_id }
    })

    if (!envio) {
      return NextResponse.json(
        { error: 'Envío no encontrado para esa orden' },
        { status: 404 }
      )
    }

    await prisma.envio.update({
      where: { envio_id: envio.envio_id },
      data: {
        estado_liquidacion_logistico: 'pagada',
        fecha_liquidacion_logistico: new Date(fecha),
        fecha_actualizacion: new Date(),
      }
    })

    // Registrar el pago en el historial de entregas
    await prisma.historialEntrega.create({
      data: {
        envio_id: envio.envio_id,
        estado: 'entregado',
        descripcion: 'Pago registrado',
      }
    })

    return NextResponse.json(
      { mensaje: 'Liquidación registrada correctamente' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error al registrar liquidación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}