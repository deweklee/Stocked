import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types";

export type ListItemWithIngredient = Tables<"list_items"> & {
  ingredient?: Tables<"ingredients"> | null;
  custom_ingredient?: Tables<"custom_ingredients"> | null;
};

export async function fetchListItems(
  listId: string
): Promise<ListItemWithIngredient[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("list_items")
    .select(
      `
      *,
      ingredient:ingredients (*),
      custom_ingredient:custom_ingredients (*)
    `
    )
    .eq("list_id", listId)
    .order("created_at");

  if (error) throw error;
  return data ?? [];
}

export async function deleteListItem(itemId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("list_items").delete().eq("id", itemId);

  if (error) throw error;
}

export async function addListItem(params: {
  list_id: string;
  ingredient_id?: string;
  custom_ingredient_id?: string;
  quantity?: number;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("list_items")
    .insert([
      {
        list_id: params.list_id,
        ingredient_id: params.ingredient_id ?? null,
        custom_ingredient_id: params.custom_ingredient_id ?? null,
        quantity: params.quantity ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleListItem(params: {
  itemId: string;
  checked: boolean;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("list_items")
    .update({ checked: params.checked })
    .eq("id", params.itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
