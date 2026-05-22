//Crear un envío para una orden. Endpoint: POST /api/envios

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calcularFechaEstimada } from '@/lib/calcularFechaEntrega'

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
        estado_actual: 'en_preparacion',
        estado_liquidacion_logistico: 'pendiente',
        fecha_estimada_entrega: calcularFechaEstimada(direccion_destino, new Date()),
      }
    })

    // Registrar el estado inicial en el historial de entregas
    await prisma.historialEntrega.create({
      data: {
        envio_id: envio.envio_id,
        estado: 'en_preparacion',
        descripcion: 'Envío creado',
        // logistico_id queda null porque aún no hay operador asignado
      }
    })

    return NextResponse.json({
      envio_id: envio.envio_id,
      codigo_seguimiento: envio.codigo_seguimiento,
      estado: envio.estado_actual,
      empresa_logistica: 'lama',
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/*
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search')?.trim() ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 10
  const skip = (page - 1) * limit

  // Construcción dinámica del filtro
  let where: object = {}

  if (search) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
      // Buscar por fecha de creación
      const fecha = new Date(search)
      const fechaSiguiente = new Date(search)
      fechaSiguiente.setDate(fechaSiguiente.getDate() + 1)
      where = { fecha_creacion: { gte: fecha, lt: fechaSiguiente } }
    } else {
      // Buscar por dirección, código de seguimiento o envio_id exacto
      where = {
        OR: [
          { direccion_destino: { contains: search, mode: 'insensitive' } },
          { codigo_seguimiento: { contains: search, mode: 'insensitive' } },
          { envio_id: { equals: search } },
        ]
      }
    }
  }

  const [envios, total] = await Promise.all([
    prisma.envio.findMany({
      where,
      orderBy: { fecha_creacion: 'desc' },
      skip,
      take: limit,
      include: {
        logistico: {
          select: { nombre: true }
        }
      }
    }),
    prisma.envio.count({ where })
  ])

  return NextResponse.json({
    envios,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}
*/