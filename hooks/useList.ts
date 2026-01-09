"use client";

import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/types";
import { fetchListById } from "@/lib/lists";

export function useList(listId: string) {
  return useQuery<Tables<"lists">>({
    queryKey: ["list", listId],
    queryFn: () => fetchListById(listId),
    enabled: !!listId,
  });
}
