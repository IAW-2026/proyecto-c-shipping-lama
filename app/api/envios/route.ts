//Crear un envío para una orden. Endpoint: POST /api/envios

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orden_id, direccion_destino, vendedor_id } = body

    if (!orden_id || !direccion_destino || !vendedor_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const envio = await prisma.envio.create({
      data: {
        orden_id,
        vendedor_id,
        direccion_destino,
        estado_actual: 'pending',

      }
    })

    return NextResponse.json({
      envio_id: envio.envio_id,
      codigo_seguimiento: envio.codigo_seguimiento,
      estado: envio.estado_actual,
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}