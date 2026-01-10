"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomIngredient, fetchAllIngredients, fetchCustomIngredients } from "@/lib/ingredients";
import { Tables } from "@/types";

export function useIngredients() {
  return useQuery<Tables<'ingredients'>[]>({
    queryKey: ["ingredients"],
    queryFn: fetchAllIngredients,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

export function useCustomIngredients() {

  return useQuery<Tables<'custom_ingredients'>[]>({
    queryKey: ["custom-ingredients"],
    queryFn: fetchCustomIngredients,
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function useCreateCustomIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-ingredients"] });
    },
  });
}