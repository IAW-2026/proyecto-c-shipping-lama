// app/api/envios/[envio_id]/reclamar/route.ts
// Api interna para que un operador logístico pueda reclamar un envío sin operador asignado. Endpoint: PATCH /api/envios/[envio_id]/reclamar

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ envio_id: string }> }
) {
  // Verificar que el usuario esté autenticado
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  const { envio_id } = await params

  try {
    // Verificar que el envío existe y no tiene operador asignado
    const envio = await prisma.envio.findUnique({
      where: { envio_id }
    })

    if (!envio) {
      return NextResponse.json(
        { error: 'Envío no encontrado' },
        { status: 404 }
      )
    }

    if (envio.logistico_id) {
      return NextResponse.json(
        { error: 'Este envío ya tiene un operador asignado' },
        { status: 409 }
      )
    }

    // Verificar que el usuario logueado existe en usuario_logistico
    const operador = await prisma.usuarioLogistico.findUnique({
      where: { clerk_user_id: userId }
    })

    if (!operador) {
      return NextResponse.json(
        { error: 'El usuario no es un operador logístico registrado' },
        { status: 403 }
      )
    }

    // Asignar el operador al envío
    const envioActualizado = await prisma.envio.update({
      where: { envio_id },
      data: { logistico_id: operador.logistico_id },
      include: {
        logistico: { select: { nombre: true } }
      }
    })

    // Registrar el reclamo en el historial de entregas
    await prisma.historialEntrega.create({
      data: {
        envio_id: envio_id,
        estado: envio.estado_actual,
        logistico_id: operador.logistico_id,
        descripcion: `Envío reclamado por ${operador.nombre}`,
      }
    })

    return NextResponse.json({
      envio_id: envioActualizado.envio_id,
      logistico_id: envioActualizado.logistico_id,
      nombre_logistico: envioActualizado.logistico?.nombre
    })

  } catch (error) {
  console.error('Error al reclamar envío:', JSON.stringify(error, null, 2))
  console.error(error)
  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  )
}
}