//Consultar el envío asociado a una orden. Endpoint: GET /api/envios/orden/{orden_id}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { orden_id: string } }
) {
  try {
    const { orden_id } = params

    const envio = await prisma.envio.findFirst({
      where: { orden_id },
      include: { historial: true }
    })

    if (!envio) {
      return NextResponse.json(
        { error: 'Envío no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      envio_id: envio.envio_id,
      orden_id: envio.orden_id,
      codigo_seguimiento: envio.codigo_seguimiento,
      empresa_logistica: 'lama',
      estado: envio.estado_actual,
      historial_estados: envio.historial.map(h => ({
        estado: h.estado,
        fecha: h.fecha,
        descripcion: h.descripcion
      }))
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}