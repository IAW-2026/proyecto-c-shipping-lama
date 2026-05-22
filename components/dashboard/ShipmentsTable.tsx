"use client";

import { useDashboardParams } from "@/hooks/useDashboardParams";
import { ReclamarButton } from "@/components/dashboard/ReclamarButton";
import { EstadoDropdown } from "./EstadoDropdown"
import Link from "next/link";

export interface Envio {
  envio_id: string;
  orden_id: string;
  vendedor_id: string;
  direccion_destino: string;
  logistico_id: string | null;
  fecha_creacion: Date;
  fecha_estimada_entrega: Date | null;
  estado_actual: string;
  codigo_seguimiento: string;
  logistico: {
    nombre: string;
  } | null;
  estado_liquidacion_logistico: string | null;
}

interface ShipmentsTableProps {
  envios: Envio[];
  isLoading?: boolean;
  miLogisticoId: string | null;
}

const STATUS_CONFIG = {
  en_preparacion: { label: "En preparación", color: "status-prep" },
  en_camino: { label: "En camino", color: "status-transit" },
  entregado: { label: "Entregado", color: "status-delivered" },
  cancelado: { label: "Cancelado", color: "status-cancelled" },
};

function formatDate(dateStr: Date | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-cell" style={{ width: i === 1 ? "80%" : "60%" }} />
        </td>
      ))}
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
              <path d="M16.5 9.4 7.55 4.24M3.29 7 12 12l8.71-5M12 22V12" />
              <circle cx="18.5" cy="15.5" r="2.5" />
              <path d="M20.27 17.27 22 19" />
            </svg>
          </div>
          <p className="empty-title">
            {hasSearch ? "Sin resultados" : "No hay envíos aún"}
          </p>
          <p className="empty-subtitle">
            {hasSearch
              ? "Probá con otro término de búsqueda"
              : "Los envíos aparecerán aquí cuando la Seller App los cree"}
          </p>
        </div>
      </td>
    </tr>
  );
}

export function ShipmentsTable({ envios, isLoading = false , miLogisticoId }: ShipmentsTableProps) {
  const { search, isPending } = useDashboardParams();
  const loading = isLoading || isPending;

  return (
    <div className="table-wrapper">
      <table className="shipments-table">
        <thead>
          <tr>
            <th>Envio ID</th>
            <th>Dirección destino</th>
            <th>Operador</th>
            <th>Estado</th>
            <th>Fecha creación</th>
            <th>Entrega estimada</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          ) : envios.length === 0 ? (
            <EmptyState hasSearch={!!search} />
          ) : (
            envios.map((envio) => {
              const status = STATUS_CONFIG[envio.estado_actual as keyof typeof STATUS_CONFIG] ?? {
                label: envio.estado_actual,
                color: "status-prep",
              };
              return (
                <tr key={envio.envio_id} className="data-row">
                  <td>
                    <Link href={`/dashboard/envios/${envio.envio_id}`} className="envio-id envio-id--link" title="Historial de envío">
                      #{envio.envio_id}
                    </Link>
                  </td>
                  <td>
                    <div className="address-cell">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{envio.direccion_destino}</span>
                    </div>
                  </td>
                  <td>
                    {envio.logistico ? (
                        <div className="operator-cell">
                            <div className="operator-avatar">
                                {envio.logistico.nombre[0].toUpperCase()}
                            </div>
                            <span>{envio.logistico.nombre}</span>
                        </div>
                    ) : (
                        <ReclamarButton envio_id={envio.envio_id} />
                    )}
                  </td>
                  <td>
                    <EstadoDropdown
                        envio_id={envio.envio_id}
                        estado_actual={envio.estado_actual}
                        es_mi_envio={envio.logistico_id === miLogisticoId}
                    />
                  </td>
                  <td>{formatDate(envio.fecha_creacion)}</td>
                  <td>{formatDate(envio.fecha_estimada_entrega)}</td>
                  <td>
                    <span className={`status-badge ${envio.estado_liquidacion_logistico === 'pagada' ? 'status-delivered' : 'status-prep'}`}>
                      <span className="status-dot" />
                      {envio.estado_liquidacion_logistico === 'pagada' ? 'Realizado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}