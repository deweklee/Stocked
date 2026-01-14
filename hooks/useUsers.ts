"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/lib/users";

export function useUsers() {
  return useQuery<string>({
    queryKey: ["users"],
    queryFn: () => getUserId(),
  });
}
