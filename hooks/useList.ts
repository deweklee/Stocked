"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/types";
import { createList, deleteList, fetchListById, updateList } from "@/lib/lists";

export function useList(listId: string) {
  return useQuery<Tables<"lists">>({
    queryKey: ["list", listId],
    queryFn: () => fetchListById(listId),
    enabled: !!listId,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, updates }: { listId: string; updates: { name?: string; is_public?: boolean} }) =>
      updateList(listId, updates),
    onSuccess: (_, { listId }) => {
      // Invalidate the list query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}