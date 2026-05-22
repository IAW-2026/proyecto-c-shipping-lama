import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from './historial.module.css'

interface PageProps {
  params: Promise<{ envio_id: string }>
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  en_preparacion: { label: 'En preparación', color: 'status-prep' },
  en_camino:      { label: 'En camino',       color: 'status-transit' },
  entregado:      { label: 'Entregado',       color: 'status-delivered' },
  cancelado:      { label: 'Cancelado',       color: 'status-cancelled' },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function HistorialPage({ params }: PageProps) {
  const { envio_id } = await params

  const envio = await prisma.envio.findUnique({
    where: { envio_id },
    include: {
      logistico: { select: { nombre: true } },
      historial: {
        orderBy: { fecha: 'desc' },
        include: {
          logistico: { select: { nombre: true } }
        }
      }
    }
  })

  if (!envio) notFound()

  const status = STATUS_CONFIG[envio.estado_actual] ?? { label: envio.estado_actual, color: 'status-prep' }

  return (
    <>
      {/* Top bar con logo */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.topBarLogo}>lama</Link>
      </div>

      <main className={styles.main}>
        {/* Volver */}
        <Link href="/dashboard" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Volver a envíos
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Historial de envío</h1>
            <div className={styles.envioMeta}>
              <span className={styles.envioId}>#{envio.envio_id}</span>
              <span className={`status-badge ${status.color}`}>
                <span className="status-dot" />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info del envío */}
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

        {/* Tabla historial */}
        <div className="table-wrapper max-w-5xl min-w-5xl mx-auto">
          <table className="shipments-table">
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
                    <div className="empty-state">
                      <p className="empty-title">Sin historial aún</p>
                      <p className="empty-subtitle">Los eventos aparecerán aquí cuando el envío sea actualizado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                envio.historial.map((evento, index) => {
                  const eventoStatus = STATUS_CONFIG[evento.estado] ?? { label: evento.estado, color: 'status-prep' }
                  return (
                    <tr key={evento.evento_id} className={`data-row ${index === 0 ? styles.latestRow : ''}`}>
                      <td>{formatDate(evento.fecha)}</td>
                      <td>
                        <span className={`status-badge ${eventoStatus.color}`}>
                          <span className="status-dot" />
                          {eventoStatus.label}
                        </span>
                      </td>
                      <td>
                        {evento.logistico ? (
                          <div className="operator-cell">
                            <div className="operator-avatar">
                              {evento.logistico.nombre[0].toUpperCase()}
                            </div>
                            <span>{evento.logistico.nombre}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-light)' }}>—</span>
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
    </>
  )
}