import { Suspense } from "react"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { SearchBar } from "@/components/dashboard/SearchBar"
import { Pagination } from "@/components/dashboard/Pagination"
import { AsignarSelect, type LogisticoOption } from "@/components/admin/AsignarSelect"
import SimularPedidoModal from "@/components/dashboard/SimularPedidoModal"
import SimularPagoModal from "@/components/dashboard/SimularPagoModal"
import { Toaster } from "@/components/dashboard/Toaster"
import styles from "./admin.module.css"

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  en_preparacion: { label: "En preparación", cls: styles.statusPrep },
  en_camino:      { label: "En camino",       cls: styles.statusTransit },
  entregado:      { label: "Entregado",       cls: styles.statusDelivered },
  cancelado:      { label: "Cancelado",       cls: styles.statusCancelled },
}

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

async function getAdminEnvios(search: string, page: number) {
  const limit = 10
  const skip = (page - 1) * limit

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
          { direccion_destino: { contains: search, mode: "insensitive" } },
          { codigo_seguimiento: { contains: search, mode: "insensitive" } },
          { envio_id: { equals: search } },
        ]
      }
    }
  }

  const [envios, total, sinOperador] = await Promise.all([
    prisma.envio.findMany({
      where,
      orderBy: [{ fecha_creacion: "desc" }, { envio_id: "asc" }],
      skip,
      take: limit,
      include: { logistico: { select: { nombre: true } } },
    }),
    prisma.envio.count({ where }),
    prisma.envio.count({ where: { logistico_id: null } }),
  ])

  return { envios, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }, sinOperador }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  // Verificación server-side del rol (defensa en profundidad)
  const { userId, sessionClaims } = await auth()
  const roles = ((sessionClaims as { roles?: string[] })?.roles) ?? []
  if (!userId || !roles.includes("super_admin")) redirect("/")

  const params = await searchParams
  const search = params.search ?? ""
  const page = Math.max(1, parseInt(params.page ?? "1"))

  const [{ envios, pagination, sinOperador }, logisticosClerk] = await Promise.all([
    getAdminEnvios(search, page),
    // Obtiene operadores logísticos directo de Clerk sin consultar la DB
    clerkClient().then(async (client) => {
      const res = await client.users.getUserList({ limit: 100 })
      return res.data
        .filter((u) =>
          (u.publicMetadata?.roles as string[] | undefined)?.includes("logistics")
        )
        .map<LogisticoOption>((u) => ({
          clerkUserId: u.id,
          nombre:
            [u.firstName, u.lastName].filter(Boolean).join(" ") ||
            u.emailAddresses[0]?.emailAddress ||
            "Sin nombre",
        }))
    }),
  ])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg2)' }}>
      <nav className={styles.topBar}>
        <Link href="/" className={styles.topBarLogoLink} title="Página principal">
          <span className={styles.topBarLetter}>L</span>
          <span className={styles.topBarLetter}>a</span>
          <span className={styles.topBarLetter}>m</span>
          <span className={styles.topBarLetter}>a</span>
        </Link>
        <div className={styles.topBarRight}>
          <SimularPedidoModal />
          <SimularPagoModal />
          <div className={styles.topBarSeparator} />
          <div className={styles.adminBadge}>
            <div className={styles.adminBadgeIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
                <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
              </svg>
            </div>
            <span className={styles.adminBadgeLabel}>Administrador</span>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>
              Todos los envíos del sistema — asigna operadores a los pendientes
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statPill}>
              <span className={styles.statDot} />
              <span>{pagination.total} envíos totales</span>
            </div>
            {sinOperador > 0 && (
              <div className={styles.statPill}>
                <span className={styles.statDotWarning} />
                <span>{sinOperador} sin operador</span>
              </div>
            )}
          </div>
        </div>

        <Suspense>
          <SearchBar />
        </Suspense>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Envío ID</th>
                <th>Dirección destino</th>
                <th>Operador</th>
                <th>Estado</th>
                <th>Fecha creación</th>
                <th>Entrega estimada</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {envios.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <p className={styles.emptyTitle}>
                        {search ? "Sin resultados" : "No hay envíos aún"}
                      </p>
                      <p className={styles.emptySubtitle}>
                        {search
                          ? "Probá con otro término de búsqueda"
                          : "Los envíos aparecerán aquí cuando la Seller App los cree"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                envios.map((envio) => {
                  const status = STATUS_CONFIG[envio.estado_actual] ?? {
                    label: envio.estado_actual,
                    cls: styles.statusPrep,
                  }
                  return (
                    <tr key={envio.envio_id} className={styles.row}>
                      <td>
                        <Link
                          href={`/admin/envios/${envio.envio_id}`}
                          className={styles.envioId}
                          title="Ver historial"
                        >
                          #{envio.envio_id}
                        </Link>
                      </td>
                      <td>
                        <div className={styles.addressCell}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{envio.direccion_destino}</span>
                        </div>
                      </td>
                      <td>
                        {envio.logistico ? (
                          <div className={styles.operatorCell}>
                            <div className={styles.operatorAvatar}>
                              {envio.logistico.nombre[0].toUpperCase()}
                            </div>
                            <span>{envio.logistico.nombre}</span>
                          </div>
                        ) : (
                          <AsignarSelect
                            envio_id={envio.envio_id}
                            logisticos={logisticosClerk}
                          />
                        )}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${status.cls}`}>
                          <span className={styles.statusDot} />
                          {status.label}
                        </span>
                      </td>
                      <td>{formatDate(envio.fecha_creacion)}</td>
                      <td>{formatDate(envio.fecha_estimada_entrega)}</td>
                      <td>
                        <span className={`${styles.payBadge} ${envio.estado_liquidacion_logistico === "pagada" ? styles.payDone : styles.payPending}`}>
                          <span className={styles.statusDot} />
                          {envio.estado_liquidacion_logistico === "pagada" ? "Realizado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <Suspense>
          <Pagination
            totalPages={pagination.totalPages}
            total={pagination.total}
            currentPage={pagination.page}
          />
        </Suspense>
      </main>
      <Toaster />
    </div>
  )
}
