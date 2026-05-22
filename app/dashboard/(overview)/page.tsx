import { Suspense } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ShipmentsTable } from "@/components/dashboard/ShipmentsTable";
import { Pagination } from "@/components/dashboard/Pagination";
import SimularPedidoModal from "@/components/dashboard/SimularPedidoModal";
import SimularPagoModal from "@/components/dashboard/SimularPagoModal";
import styles from "./dashboard.module.css";
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
 
interface PageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}
 
async function getEnvios(search: string, page: number) {
  const limit = 10
  const skip = (page - 1) * limit

  let where: object = {}

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
      orderBy: [
        { fecha_creacion: 'desc' },
        { envio_id: 'asc' }  // ← desempate por ID
      ],
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

  const { envios, pagination } = await getEnvios(search, page);

  const { userId } = await auth()

  const operador = userId
    ? await prisma.usuarioLogistico.findUnique({
        where: { clerk_user_id: userId },
        select: { logistico_id: true }
      })
    : null
 
  return (
    <>
    <div className={styles.topBar}>
      <Link href="/" className={styles.topBarLogo} title="Página principal">
        lama 
      </Link>
      <div className={styles.topBarAction}>
        <SimularPedidoModal />
      </div>
      <div className={styles.topBarAction2}>
        <SimularPagoModal />
      </div>
    </div>
    <main className={styles.main}>
      {/* Header del dashboard */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Envíos</h1>
          <p className={styles.subtitle}>
            Gestioná y seguí todos los envíos en tiempo real
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span className={styles.statDot} />
            <span>{pagination.total} envíos totales</span>
          </div>
        </div>
      </div>
 
      {/* Barra de búsqueda — necesita Suspense por useSearchParams */}
      <Suspense>
        <SearchBar />
      </Suspense>
 
      {/* Tabla */}
      <Suspense fallback={<ShipmentsTable envios={[]} isLoading miLogisticoId={null} />}>
        <ShipmentsTable envios={envios} miLogisticoId={operador?.logistico_id ?? null} />
      </Suspense>
 
      {/* Paginación */}
      <Suspense>
        <Pagination
          totalPages={pagination.totalPages}
          total={pagination.total}
          currentPage={pagination.page}
        />
      </Suspense>
    </main>
    </>
  );
}
