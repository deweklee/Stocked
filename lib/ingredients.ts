import { createClient } from "./supabase/client";
import type { Tables } from "@/types";

export async function fetchAllIngredients(): Promise<Tables<"ingredients">[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("ingredients").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCustomIngredients(): Promise<Tables<"custom_ingredients">[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("custom_ingredients")
    .select("*");

  if (error) throw error;
  return data ?? [];
}

export async function createCustomIngredient(name: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("custom_ingredients")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
