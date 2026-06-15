// Crear un envio para una orden. Endpoint: POST /api/envios
// API que expone mi app y va a ser llamada por seller app.

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

    await prisma.historialEntrega.create({
      data: {
        envio_id: envio.envio_id,
        estado: 'en_preparacion',
        descripcion: 'Envío creado',
      }
    })

    return NextResponse.json({
      envio_id: envio.envio_id,
      codigo_seguimiento: envio.codigo_seguimiento,
      estado: envio.estado_actual,
      empresa_logistica: 'lama',
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')?.trim() ?? ''
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const parsedPage = pageParam ? parseInt(pageParam) : NaN
    const parsedLimit = limitParam ? parseInt(limitParam) : NaN
    const page = Number.isNaN(parsedPage) ? null : Math.max(1, parsedPage)
    const limit = Number.isNaN(parsedLimit) ? null : Math.max(1, parsedLimit)
    const skip = page && limit ? (page - 1) * limit : undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = {}

    if (search) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
        const fecha = new Date(search)
        const fechaSiguiente = new Date(search)
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 1)
        where = { fecha_creacion: { gte: fecha, lt: fechaSiguiente } }
      } else {
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
        orderBy: [{ fecha_creacion: 'desc' }, { envio_id: 'asc' }],
        skip,
        take: limit ?? undefined,
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
      total,
      pagination: page && limit
        ? {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        : null
    })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
