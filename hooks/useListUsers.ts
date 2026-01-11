"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AcceptedUser, fetchAcceptedUsers, fetchMyRoleForList, ListRole, updateListUserRole } from "@/lib/list-users";

export function useListRole(listId: string) {
  return useQuery<ListRole | null>({
    queryKey: ["list-role", listId],
    enabled: !!listId,
    queryFn: () => fetchMyRoleForList(listId),
  });
}

export function useUpdateListUserRole(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "viewer" | "editor"}) =>
      updateListUserRole({ listId, userId, role }),
    onSuccess: () => {
      // Invalidate list_users query so roles are updated in UI
      queryClient.invalidateQueries({ queryKey: ["list-users", listId] });
      queryClient.invalidateQueries({ queryKey: ["list", listId] }); // optional if list object depends on roles
    },
  });
}

export function useListUsers(listId: string) {
  return useQuery<AcceptedUser[]>({
    queryKey: ["list-users", listId],
    queryFn: () => fetchAcceptedUsers(listId),
    staleTime: 1000 * 60,
  });
}
