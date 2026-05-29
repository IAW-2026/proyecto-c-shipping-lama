import { Suspense } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ShipmentsTable } from "@/components/dashboard/ShipmentsTable";
import { Pagination } from "@/components/dashboard/Pagination";
import { Toaster } from "@/components/dashboard/Toaster";
import styles from "./dashboard.module.css";
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

async function getEnvios(search: string, page: number, logisticoId: string) {
  const limit = 10
  const skip = (page - 1) * limit

  const baseWhere = { logistico_id: logisticoId }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = baseWhere

  if (search) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
      const fecha = new Date(search)
      const fechaSiguiente = new Date(search)
      fechaSiguiente.setDate(fechaSiguiente.getDate() + 1)
      where = { AND: [baseWhere, { fecha_creacion: { gte: fecha, lt: fechaSiguiente } }] }
    } else {
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { direccion_destino: { contains: search, mode: 'insensitive' } },
              { codigo_seguimiento: { contains: search, mode: 'insensitive' } },
              { envio_id: { equals: search } },
            ]
          }
        ]
      }
    }
  }

  const [envios, total] = await Promise.all([
    prisma.envio.findMany({
      where,
      orderBy: [{ fecha_creacion: 'desc' }, { envio_id: 'asc' }],
      skip,
      take: limit,
      include: { logistico: { select: { nombre: true } } }
    }),
    prisma.envio.count({ where })
  ])

  return {
    envios,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  }
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));

  const { userId } = await auth()

  const operador = userId
    ? await prisma.usuarioLogistico.findUnique({
        where: { clerk_user_id: userId },
        select: { logistico_id: true, nombre: true }
      })
    : null

  const { envios, pagination } = operador
    ? await getEnvios(search, page, operador.logistico_id)
    : { envios: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }

  return (
    <>
      <nav className={styles.topBar}>
        <Link href="/" className={styles.topBarLogoLink} title="Página principal">
          <span className={styles.topBarLetter}>l</span>
          <span className={styles.topBarLetter}>a</span>
          <span className={styles.topBarLetter}>m</span>
          <span className={styles.topBarLetter}>a</span>
        </Link>
        <div className={styles.topBarActions}>
          {operador && (
            <>
              <div className={styles.topBarSeparator} />
              <div className={styles.userBadge}>
                <div className={styles.userAvatar}>
                  {operador.nombre[0].toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{operador.nombre}</span>
                  <span className={styles.userRole}>Operador Logístico</span>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Mis envíos</h1>
            <p className={styles.subtitle}>
              Gestioná y actualizá el estado de tus envíos asignados
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statPill}>
              <span className={styles.statDot} />
              <span>{pagination.total} envíos asignados</span>
            </div>
          </div>
        </div>

        <Suspense>
          <SearchBar />
        </Suspense>

        <Suspense fallback={<ShipmentsTable envios={[]} isLoading miLogisticoId={null} />}>
          <ShipmentsTable envios={envios} miLogisticoId={operador?.logistico_id ?? null} />
        </Suspense>

        <Suspense>
          <Pagination
            totalPages={pagination.totalPages}
            total={pagination.total}
            currentPage={pagination.page}
          />
        </Suspense>
      </main>
      <Toaster />
    </>
  );
}
