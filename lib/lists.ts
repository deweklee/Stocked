import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types";

export async function fetchLists(): Promise<Tables<"lists">[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lists")
    .select("*");
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

export async function createList(name: string = "Untitled List") {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("lists")
    .insert([{ name, owner_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateList(listId: string, updates: { name?: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lists")
    .update(updates)
    .eq("id", listId)
    .select()
    .single();

  if (error) throw error;
  return data;
}