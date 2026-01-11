"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchListShares,
  createListShare,
  updateListShare,
  deleteListShare,
  type ListShare,
  fetchMyIncomingShares,
} from "@/lib/list-shares";

/** Fetch shares for a given list */
export function useListShares(listId: string) {
  return useQuery({
    queryKey: ["list-shares", listId],
    queryFn: () => fetchListShares(listId),
    staleTime: 1000 * 60, // 1 min
  });
}

export function useIncomingShares() {
  return useQuery({
    queryKey: ["incoming-shares"],
    queryFn: () => fetchMyIncomingShares(),
    staleTime: 1000 * 60, // 1 min
  });
}

/** Create a share for a list */
export function useCreateListShare(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (share: { email: string; role?: "viewer" | "editor"; invitedId?: string }) =>
      createListShare({ listId, ...share }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-shares", listId] });
    },
  });
}

/** Update a share for a list */
export function useUpdateListShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { shareId: string; updates: Partial<Pick<ListShare, "role" | "status" | "invited_id">> }) =>
      updateListShare(payload.shareId, payload.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-shares"] });
    },
  });
}

/** Delete a share for a list */
export function useDeleteListShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: string) => deleteListShare(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-shares"] });
    },
  });
}
