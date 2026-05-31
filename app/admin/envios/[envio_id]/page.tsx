import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from './historial.module.css'

interface PageProps {
  params: Promise<{ envio_id: string }>
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  en_preparacion: { label: 'En preparación', badgeClass: styles.statusPrep },
  en_camino:      { label: 'En camino',       badgeClass: styles.statusTransit },
  entregado:      { label: 'Entregado',       badgeClass: styles.statusDelivered },
  cancelado:      { label: 'Cancelado',       badgeClass: styles.statusCancelled },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminHistorialPage({ params }: PageProps) {
  const { envio_id } = await params

  const envio = await prisma.envio.findUnique({
    where: { envio_id },
    include: {
      logistico: { select: { nombre: true } },
      historial: {
        orderBy: { fecha: 'desc' },
        include: { logistico: { select: { nombre: true } } }
      }
    }
  })

  if (!envio) notFound()

  const status = STATUS_CONFIG[envio.estado_actual] ?? {
    label: envio.estado_actual,
    badgeClass: styles.statusPrep,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg2)' }}>
      {/*
      <div className={styles.topBar}>
        <Link href="/admin" className={styles.topBarLogo}>lama</Link>
      </div>
      */}

      <main className={styles.main}>
        <Link href="/admin" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Volver al panel de administración
        </Link>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Historial de envío</h1>
            <div className={styles.envioMeta}>
              <span className={styles.envioId}>#{envio.envio_id}</span>
              <span className={`${styles.statusBadge} ${status.badgeClass}`}>
                <span className={styles.statusDot} />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Dirección destino</p>
            <p className={styles.infoValue}>{envio.direccion_destino}</p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Operador asignado</p>
            <p className={styles.infoValue}>{envio.logistico?.nombre ?? '—'}</p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Fecha de creación</p>
            <p className={styles.infoValue}>{formatDate(envio.fecha_creacion)}</p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoLabel}>Entrega estimada</p>
            <p className={styles.infoValue}>
              {envio.fecha_estimada_entrega ? formatDate(envio.fecha_estimada_entrega) : '—'}
            </p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Operador</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {envio.historial.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className={styles.emptyState}>
                      <p className={styles.emptyTitle}>Sin historial aún</p>
                      <p className={styles.emptySubtitle}>Los eventos aparecerán aquí cuando el envío sea actualizado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                envio.historial.map((evento, index) => {
                  const eventoStatus = STATUS_CONFIG[evento.estado] ?? {
                    label: evento.estado,
                    badgeClass: styles.statusPrep,
                  }
                  return (
                    <tr key={evento.evento_id} className={index === 0 ? styles.latestRow : undefined}>
                      <td>{formatDate(evento.fecha)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${eventoStatus.badgeClass}`}>
                          <span className={styles.statusDot} />
                          {eventoStatus.label}
                        </span>
                      </td>
                      <td>
                        {evento.logistico ? (
                          <div className={styles.operatorCell}>
                            <div className={styles.operatorAvatar}>
                              {evento.logistico.nombre[0].toUpperCase()}
                            </div>
                            <span>{evento.logistico.nombre}</span>
                          </div>
                        ) : (
                          <span className={styles.emptyCell}>—</span>
                        )}
                      </td>
                      <td>{evento.descripcion ?? '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
