"use client";

import { addListItem, deleteListItem, fetchListItems, toggleListItem } from "@/lib/list-items";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListItems(listId: string) {
  return useQuery({
    queryKey: ["list-items", listId],
    queryFn: () => fetchListItems(listId),
    enabled: !!listId,
  });
}

export function useDeleteListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-items", listId],
      });
    },
  });
}

export function useAddListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-items", listId],
      });
    },
  });
}

export function useToggleListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleListItem, // now accepts one object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-items", listId] });
    },
  });
}
