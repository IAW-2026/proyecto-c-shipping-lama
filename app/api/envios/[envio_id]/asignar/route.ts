// PATCH /api/envios/[envio_id]/asignar
// Solo super_admin: asigna un operador logístico a un envío sin operador.
// Api interna para que el admin pueda asignar un envío a un operador logístico específico, recibiendo 
// el clerk_user_id del operador a asignar. El endpoint verifica que el envío exista y no tenga ya un 
// operador asignado, luego busca al operador por su clerk_user_id y actualiza el envío con el 
// logistico_id correspondiente. También registra esta acción en el historial de entregas.

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ envio_id: string }> }
) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const roles = ((sessionClaims as { roles?: string[] })?.roles) ?? []
  if (!roles.includes('super_admin')) {
    return NextResponse.json({ error: 'Acceso restringido a administradores' }, { status: 403 })
  }

  const { envio_id } = await params
  const body = await request.json()
  const { clerk_user_id } = body

  if (!clerk_user_id) {
    return NextResponse.json({ error: 'Falta clerk_user_id' }, { status: 400 })
  }

  try {
    const envio = await prisma.envio.findUnique({ where: { envio_id } })

    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 })
    }

    if (envio.logistico_id) {
      return NextResponse.json({ error: 'El envío ya tiene un operador asignado' }, { status: 409 })
    }

    // Buscar el operador por su clerk_user_id
    const operador = await prisma.usuarioLogistico.findUnique({
      where: { clerk_user_id }
    })

    if (!operador) {
      return NextResponse.json(
        { error: 'No se encontró un operador logístico con ese ID de usuario' },
        { status: 404 }
      )
    }

    const envioActualizado = await prisma.envio.update({
      where: { envio_id },
      data: { logistico_id: operador.logistico_id }
    })

    await prisma.historialEntrega.create({
      data: {
        envio_id,
        estado: envio.estado_actual,
        logistico_id: operador.logistico_id,
        descripcion: `Operador asignado por administrador`,
      }
    })

    return NextResponse.json({
      envio_id,
      logistico_id: envioActualizado.logistico_id,
      nombre_logistico: operador.nombre,
    })

  } catch (error) {
    console.error('Error al asignar operador:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
