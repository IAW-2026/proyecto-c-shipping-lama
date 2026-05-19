"use client";
 
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
 
export function useDashboardParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
 
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
 
  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
 
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
 
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );
 
  const setSearch = useCallback(
    (value: string) => {
      // Al buscar, volver a la página 1
      updateParams({ search: value, page: null });
    },
    [updateParams]
  );
 
  const setPage = useCallback(
    (value: number) => {
      updateParams({ page: value });
    },
    [updateParams]
  );
 
  return { search, page, setSearch, setPage, isPending };
}