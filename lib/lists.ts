import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types";

export async function fetchLists(): Promise<Tables<"lists">[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lists")
    .select("*");
  console.log("test", error)
  if (error) throw error;
  
  return data ?? [];
}

export async function fetchListById(
  listId: string
): Promise<Tables<"lists">> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) throw error;
  return data;
}