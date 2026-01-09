"use client";

import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/types";
import { fetchLists } from "@/lib/lists";

/**
 * useLists
 *
 * React hook responsible for:
 * - fetching grocery lists
 * - caching results
 * - exposing loading & error states
 */
export function useLists() {
  return useQuery<Tables<'lists'>[]>({
    queryKey: ["lists"],
    queryFn: fetchLists,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
