"use client";
 
import { useDashboardParams } from "@/hooks/useDashboardParams";
 
interface PaginationProps {
  totalPages: number;
  total: number;
  currentPage: number;
}
 
export function Pagination({ totalPages, total, currentPage }: PaginationProps) {
  const { setPage, isPending } = useDashboardParams();
 
  if (totalPages <= 1) return null;
 
  // Generar rango de páginas visible (máx 5 botones)
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
 
    const pages: (number | "...")[] = [];
    const showLeft = currentPage > 3;
    const showRight = currentPage < totalPages - 2;
 
    pages.push(1);
    if (showLeft) pages.push("...");
 
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
 
    if (showRight) pages.push("...");
    pages.push(totalPages);
 
    return pages;
  };
 
  const pageNumbers = getPageNumbers();
 
  return (
    <div className="pagination-wrapper">
      <span className="pagination-info">
        {total} envío{total !== 1 ? "s" : ""} · Página {currentPage} de {totalPages}
      </span>
 
      <div className="pagination-controls">
        <button
          className="page-btn nav-btn"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          aria-label="Página anterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
 
        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="page-dots">···</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === currentPage ? "active" : ""}`}
              onClick={() => setPage(p as number)}
              disabled={isPending}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
 
        <button
          className="page-btn nav-btn"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          aria-label="Página siguiente"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}