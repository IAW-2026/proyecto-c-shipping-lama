"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboardParams } from "@/hooks/useDashboardParams";

export function SearchBar() {
  const { search, setSearch } = useDashboardParams();
  const [localValue, setLocalValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronizar si cambia externamente (ej: navegar atrás)
  useEffect(() => {
    setLocalValue(search);
  }, [search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
    }, 400);
  };

  const handleClear = () => {
    setLocalValue("");
    setSearch("");
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <svg
          className="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por ID, fecha (YYYY-MM-DD) o dirección..."
          value={localValue}
          onChange={handleChange}
          className="search-input"
        />
        {localValue && (
          <button onClick={handleClear} className="clear-btn" aria-label="Limpiar búsqueda">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="search-hint">
        Buscá por número de envío, fecha de creación o dirección destino
      </p>
    </div>
  );
}